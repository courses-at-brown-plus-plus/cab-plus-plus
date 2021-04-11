from selenium import webdriver
from bs4 import BeautifulSoup
import re
import csv
import time
import json
import pandas as pd

from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException

from cookies import COOKIES


def avg(l):
    count = len(l)
    sum = 0
    for review in l:
        if review == "" or review == "na":
            count -= 1
        else:
            try:
                sum += float(review)
            except:
                sum += 0
    if count == 0:
        return ""
    return sum/count, count


def count_elem(l, elem):
    count = 0
    for review in l:
        if review == elem:
            count += 1
    return count


def compile_courses(filename):
    cab_data = pd.read_csv(filename)
    return cab_data["courseCode"]


class CritReviewScraper:
    def __init__(self, filename, timeout=10):
        self.driver = webdriver.Chrome()
        self.driver.get("https://thecriticalreview.org")

        self.driver.delete_cookie("connect.sid")
        # using another file to store cookie values to keep accounts secure
        self.driver.add_cookie({"name": "connect.sid", "domain": ".thecriticalreview.org",
                                "value": COOKIES["Critical Review"]})

        self.timeout = timeout
        self.filename = filename
        self.courses = []

    def scrape_course(self, course):
        print(course)

        department = course[:course.index(" ")]
        course_code = course[course.index(" ") + 1:]

        self.driver.get("https://thecriticalreview.org/search/" + department + "/" + course_code)
        soup = BeautifulSoup(self.driver.page_source, 'lxml')

        course_review_info = {}
        course_review_info["courseCode"] = course

        try:
            # no reviews for the course
            no_reviews = self.driver.find_element_by_css_selector("#unreturned_banner_message")
            self.courses.append(course_review_info)
        except NoSuchElementException:
            course_rating = soup.find('div', class_="c_rating")["data-num"]
            course_review_info["courseRating"] = course_rating

            course_data = soup.find('div', class_="review_data")
            reviews = course_data["data-test-value"]

            # demographic data
            course_review_info["freshmen"] = course_data["data-frosh"]
            course_review_info["sophomores"] = course_data["data-soph"]
            course_review_info["juniors"] = course_data["data-jun"]
            course_review_info["seniors"] = course_data["data-sen"]
            course_review_info["gradStudents"] = course_data["data-grad"]

            if reviews == "":
                self.courses.append(course_review_info)
                return

            reviews = json.loads(reviews)

            # hours spent on course
            if "minhours" in reviews:
                course_review_info["avgHrs"] = avg(reviews["minhours"])
            if "maxhours" in reviews:
                course_review_info["maxHrs"] = avg(reviews["maxhours"])

            # course feedback statistics
            if "readings" in reviews:
                course_review_info["readingsWorthwhile"] = avg(reviews["readings"])
            if "class-materials" in reviews:
                course_review_info["materialsUseful"] = avg(reviews["class-materials"])
            if "difficult" in reviews:
                course_review_info["difficult"] = avg(reviews["difficult"])
            if "learned" in reviews:
                course_review_info["learnedALot"] = avg(reviews["learned"])
            if "loved" in reviews:
                course_review_info["enjoyedCourse"] = avg(reviews["loved"])
            if "grading-speed" in reviews:
                course_review_info["timelyGrading"] = avg(reviews["grading-speed"])
            if "grading-fairness" in reviews:
                course_review_info["fairGrading"] = avg(reviews["grading-fairness"])

            # concentrator demographics
            if "conc" in reviews:
                course_review_info["concentratorYes"] = count_elem(reviews["conc"], "C")
                course_review_info["concentratorNo"] = count_elem(reviews["conc"], "N")
                course_review_info["concentratorMaybe"] = count_elem(reviews["conc"], "D")

            # taken as requirement?
            if "requirement" in reviews:
                course_review_info["requirementYes"] = count_elem(reviews["requirement"], "Y")
                course_review_info["requirementNo"] = count_elem(reviews["requirement"], "N")

            # expected grades
            if "grade" in reviews:
                course_review_info["expectedA"] = count_elem(reviews["grade"], "A")
                course_review_info["expectedB"] = count_elem(reviews["grade"], "B")
                course_review_info["expectedC"] = count_elem(reviews["grade"], "C")
                course_review_info["expectedS"] = count_elem(reviews["grade"], "S")
                course_review_info["expectedNC"] = count_elem(reviews["grade"], "NC")

            self.courses.append(course_review_info)

    def save_to_csv(self, filename):
        csv_columns = ["courseCode", "courseRating", "freshmen", "sophomores", "juniors", "seniors", "gradStudents",
                       "avgHrs", "maxHrs", "readingsWorthwhile", "materialsUseful", "difficult", "learnedALot",
                       "enjoyedCourse", "timelyGrading", "fairGrading",
                       "concentratorYes", "concentratorNo", "concentratorMaybe", "requirementYes", "requirementNo",
                       "expectedA", "expectedB", "expectedC", "expectedS", "expectedNC"]
        try:
            with open("../server/data/" + filename, "w") as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
                writer.writeheader()
                for course_info in self.courses:
                    print(course_info)
                    writer.writerow(course_info)
        except IOError:
            print("I/O error")


courses = compile_courses("../server/data/CAB_v1_no_duplicates.csv")
filename = input("What file should data be saved to (ex: CritReview_data.csv)?\t")
scraper = CritReviewScraper(filename)
for course in courses:
    scraper.scrape_course(course)
scraper.save_to_csv(filename)