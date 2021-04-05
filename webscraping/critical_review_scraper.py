from selenium import webdriver
from bs4 import BeautifulSoup
import re
import csv
import time

from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import ElementClickInterceptedException

from cookies import COOKIES


class CritReviewScraper:
    def __init__(self, filename, timeout=10):
        self.driver = webdriver.Chrome()
        self.driver.get("https://thecriticalreview.org")

        # using another file to store cookie values to keep accounts secure
        self.driver.add_cookie({"name": "connect.sid", "domain": "https://thecriticalreview.org/",
                                "value": COOKIES["Critical Review"]})

        self.timeout = timeout
        self.filename = filename
        self.courses = []