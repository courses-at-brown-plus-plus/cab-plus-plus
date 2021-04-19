import unittest
import time

# Allow imports from the /webscraping directory
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

from cab_scraper import CABScraper

from selenium import webdriver
from selenium.webdriver.support.ui import Select, WebDriverWait


class TestCABScraper(unittest.TestCase):

    def setUp(self):
        self.scraper = CABScraper()
        self.driver = self.scraper.driver

    def test_setup(self):
        self.assertEqual(self.driver.current_url, "https://cab.brown.edu/")

    def test_AFRI0800(self):
        # select Spring 2021 semester
        select_semester = Select(self.driver.find_element_by_id("crit-srcdb"))
        select_semester.select_by_visible_text("Spring 2021")

        # select 0000-0999 course range
        submit_button = self.driver.find_element_by_id("search-button")
        select_course_type = Select(self.driver.find_element_by_id("crit-coursetype"))

        select_course_type.select_by_value("coursetype_low")
        submit_button.click()
        time.sleep(0.5)

        course = self.driver.find_element_by_class_name("result--group-start")
        course.click()
        time.sleep(0.25)

        self.assertEqual(self.scraper.scrape_course(self.driver.page_source),
                                               {"courseName": "Theorizing Racism",
                                                "courseDesc": "Since the eruption of Black Lives Matter protest across the United States in response to the murder of George Floyd at the hands of Minneapolis police, the acknowledgement and denunciation of systemic racism in mainstream discourse has significantly increased. As more and more people agree that racism is a contemporary problem, an old question emerges: What do people mean when they say “racism”? This lecture course situates mainstream discourse about racism within racism’s contentious conceptual history, critically engages a dynamic interdisciplinary debate about the meaning of racism, and imagines what a it would take to achieve a world without racism.",
                                                "FYS": False,
                                                "SOPH": False,
                                                "DIAP": True,
                                                "WRIT": False,
                                                "CBLR": False,
                                                "COEX": False,
                                                "preReqs": []})

    def test_CSCI1260(self):
        search_bar = self.driver.find_element_by_id("crit-keyword")
        search_bar.send_keys("CSCI 1260")

        submit_button = self.driver.find_element_by_id("search-button")
        submit_button.click()
        time.sleep(0.5)

        course = self.driver.find_element_by_class_name("result--group-start")
        course.click()
        time.sleep(0.25)

        self.assertEqual(self.scraper.scrape_course(self.driver.page_source),
                         {"courseName": "Compilers and Program Analysis",
                          "courseDesc": "Lexical analysis, syntactic analysis, semantic analysis, code generation, code optimization, translator writing systems. Prerequisites: CSCI 0220, or CSCI 0320, or CSCI 0300, or CSCI 0330, or CSCI 1310, or CSCI 1330.",
                          "FYS": False,
                          "SOPH": False,
                          "DIAP": False,
                          "WRIT": False,
                          "CBLR": False,
                          "COEX": False,
                          "preReqs": [["CSCI 0220", "CSCI 0320", "CSCI 0300", "CSCI 0330", "CSCI 1310", "CSCI 1950S",
                                       "CSCI 1330"]]})

    def test_prereqs(self):
        self.assertEqual(self.scraper.parse_prereqs("ENGN 0490, 0720 and 0810"),
                         ["ENGN 0490", "ENGN 0720", "ENGN 0810"]) # ENGN 1150
        self.assertEqual(self.scraper.parse_prereqs("(CSCI 0320 or 1950N) and CSCI 1230"),
                         [["CSCI 0320", "CSCI 1950N"], "CSCI 1230"]) # CSCI 1950U
        self.assertEqual(self.scraper.parse_prereqs("CSCI 0330"), ["CSCI 0330"]) # CSCI 1670
        self.assertEqual(self.scraper.parse_prereqs("(MATH 0180, 0200, 0350, APMA 0350 or 0360) and (CSCI 1450, 0450, APMA 1650, 1655 or MATH 1620) and (CSCI 0220, 1010, 0510 or 1550) and (CSCI 0040, 0111, 0150, 0170 or 0190)"),
                         [["MATH 0180", "MATH 0200", "MATH 0350", "APMA 0350", "APMA 0360"],
                          ["CSCI 1450", "CSCI 0450", "APMA 1650", "APMA 1655", "MATH 1620"],
                          ["CSCI 0220", "CSCI 1010", "CSCI 0510", "CSCI 1550"],
                          ["CSCI 0040", "CSCI 0111", "CSCI 0150", "CSCI 0170", "CSCI 0190"]]) # CSCI 1440
        self.assertEqual(self.scraper.parse_prereqs("MATH 0100, 0170, 0180, 0190, 0200, 0350, minimum score of 4 in 'AP Calculus BC', minimum score of 5 in 'AP Calculus BC'"),
                         [["MATH 0100", "MATH 0170", "MATH 0180", "MATH 0190", "MATH 0200", "MATH 0350",
                           "minimum score of 4 in 'AP Calculus BC'", "minimum score of 5 in 'AP Calculus BC'"]])


if __name__ == '__main__':
    unittest.main()
