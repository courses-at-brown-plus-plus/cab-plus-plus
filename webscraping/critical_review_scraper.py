from selenium import webdriver
from bs4 import BeautifulSoup
import re
import csv
import time

from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException

from cookies import COOKIES


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
        department = course[:course.index(" ")]
        course_code = course[course.index(" ") + 1:]

        self.driver.get("https://thecriticalreview.org/search/" + department + "/" + course_code)
        #soup = BeautifulSoup(self.driver.page_source)

        try:
            # no reviews for the course
            no_reviews = self.driver.find_element_by_css_selector("unreturned_banner_message")
            print("no reviews found")
            return {}
        except NoSuchElementException:
            # TODO: scrape course review
            return {}


filename = input("What file should data be saved to (ex: CritReview_data.csv)?\t")
scraper = CritReviewScraper(filename)
scraper.scrape_course("CSCI 0300")