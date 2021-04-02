from selenium import webdriver
from bs4 import BeautifulSoup
import re
import csv
import time

from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import ElementClickInterceptedException


class CABScraper:
    def __init__(self, headless=True, timeout=10):
        self.driver = webdriver.Chrome()
        self.driver.get("https://cab.brown.edu/")

        self.timeout = timeout
        self.courses = []

    def scrape_semester(self, semester):
        select_semester = Select(self.driver.find_element_by_id("crit-srcdb"))
        select_semester.select_by_visible_text(semester)

        self.scrape_course_range("coursetype_low")
        self.scrape_course_range("coursetype_mid")
        self.scrape_course_range("coursetype_high")

    def scrape_course_range(self, value):
        submit_button = self.driver.find_element_by_id("search-button")
        select_course_type = Select(self.driver.find_element_by_id("crit-coursetype"))

        select_course_type.select_by_value(value)
        submit_button.click()
        time.sleep(0.5)
        self.wait(EC.element_to_be_clickable((By.CSS_SELECTOR, ".result--group-start")))
        print(value)
        for course in self.driver.find_elements_by_class_name("result--group-start"):
            course.click()
            self.wait(EC.presence_of_element_located((By.CSS_SELECTOR, ".detail-title")))
            time.sleep(0.25)
            try:
                section = self.driver.find_element_by_class_name("course-section--viewing")
            except:
                try:
                    section = self.driver.find_element_by_class_name("course-section")
                    section.click()
                except:
                    print("sad! section not clicked")
            course_info = self.scrape_course(self.driver.page_source)
            if course_info is None:
                continue
            else:
                course_code = self.driver.find_element_by_class_name("dtl-course-code").text
                print(course_code)
                if course_code not in self.courses:
                    course_info["courseCode"] = course_code
                    self.courses.append(course_info)

    def scrape_course(self, page_source):
        course_info = {}
        soup = BeautifulSoup(page_source, 'lxml')

        course_name = soup.find('div', class_='detail-title').get_text()

        course_desc = soup.find('div', class_='section--description')
        if course_desc is None:
            return None
        else:
            course_desc_value = course_desc.find('div', class_='section__content').get_text()

        curricular_programs = self.check_section(soup.find('div', class_='section--attr_html'))

        reg_restrictions = self.check_section(soup.find('div', class_='section--registration_restrictions'))
        prereqs = ""
        if reg_restrictions is not None:
            if "Prerequisites:" in reg_restrictions:
                if "minimum score of WAIVE" in reg_restrictions:
                    prereqs = reg_restrictions[reg_restrictions.index(": ") + 2
                                           :reg_restrictions.index(" or minimum score of WAIVE")]
                else:
                    prereqs = reg_restrictions[reg_restrictions.index(": ") + 2
                                               :reg_restrictions.index(".")]
            # else:
            #     if "Prerequisite" in course_desc_value:
            #         starting_index = course_desc_value.index(": ")
            #         prereqs = course_desc_value[starting_index + 2
            #                                     :course_desc_value.index(";", starting_index)]

        course_info["courseName"] = course_name
        course_info["courseDesc"] = course_desc_value
        for course_designation in ["FYS", "SOPH", "DIAP", "WRIT", "CBLR", "COEX"]:
            if curricular_programs is not None:
                course_info[course_designation] = course_designation in curricular_programs
            else:
                course_info[course_designation] = False
        if prereqs is "":
            course_info["preReqs"] = []
        else:
            course_info["preReqs"] = self.parse_prereqs(prereqs)

        print(course_info)
        return course_info

    def wait(self, condition):
        return WebDriverWait(self.driver, self.timeout).until(condition)
    
    def check_section(self, section):
        if section is None:
            return None
        else:
            return section.find('div', class_='section__content').get_text()

    def parse_prereqs(self, prereqs):
        class_name_regex = r"[A-Z]{3,4} \d{4}[A-Z]?"

        if prereqs[:2] == "((":
            prereqs = prereqs[1:len(prereqs)-1]

        if "(" not in prereqs and "and" in prereqs:
            without_departments = prereqs.replace(" and", ",").split(", ")
        elif "(" not in prereqs:
            without_departments = [prereqs.split(", ")]
        else:
            parse_and = re.split(r" (?<!\()\band\b(?![\w\s]*[\)]) ", prereqs)

            parse_or = []
            for course_group in parse_and:
                if "(" in course_group:
                    course_group = course_group[1:len(course_group)-1]
                    if "and" in course_group:
                        parse_or += course_group.replace(" and ", ", ").split(", ")
                    elif "or" in course_group:
                        parse_or.append(course_group.replace(" or ", ", ").split(", "))
                else:
                    parse_or.append(course_group)

            without_departments = parse_or

        department = ""
        add_departments = []
        for course_group in without_departments:
            if type(course_group) is list:
                new_course_group = []
                for item in course_group:
                    if re.search(class_name_regex, item):
                        department = item[:item.index(" ")]
                        new_course_group.append(item)
                    else:
                        new_course_group.append(department + " " + item)
                add_departments.append(new_course_group)
            else:
                if re.search(class_name_regex, course_group):
                    department = course_group[:course_group.index(" ")]
                    add_departments.append(course_group)
                else:
                    add_departments.append(department + " " + course_group)

        if len(add_departments) == 1 and type(add_departments[0]) is list:
            return add_departments[0]

        return add_departments

    def save_to_csv(self):
        csv_columns = ["courseCode", "courseName", "courseDesc", "preReqs", "FYS", "SOPH", "DIAP", "WRIT", "CBLR", "COEX"]
        try:
            with open("../data/CAB_v1.csv", "w") as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
                writer.writeheader()
                for course in self.courses:
                    writer.writerow(course)
        except IOError:
            print("I/O error")


scraper = CABScraper()
scraper.scrape_semester("Fall 2020")
time.sleep(0.5)
scraper.scrape_semester("Spring 2021")
time.sleep(0.5)
scraper.scrape_semester("Summer 2021")
scraper.save_to_csv()