import unittest
import time

# Allow imports from the /webscraping directory
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

from critical_review_scraper import CritReviewScraper

from selenium import webdriver
from selenium.webdriver.support.ui import Select, WebDriverWait


class TestCritReviewScraper(unittest.TestCase):

    def setUp(self):
        self.scraper = CritReviewScraper()
        self.driver = self.scraper.driver

    def test_setup(self):
        self.assertEqual(self.driver.current_url, "https://thecriticalreview.org/")

    def test_EAST0600(self):
        # has all fields
        self.scraper.scrape_course("EAST 0600")
        self.assertEqual(self.scraper.courses,
                         [{"courseCode": "EAST 0600",
                          "courseRating": '4.21',
                          "freshmen": '2',
                          "sophomores": '0',
                          "juniors": '2',
                          "seniors": '0',
                          "gradStudents": '1',
                          "avgHrs": (3.25, 4),
                          "maxHrs": (7.0, 4),
                          "readingsWorthwhile": (4.0, 3),
                          "materialsUseful": (4.25, 4),
                          "difficult": (2.75, 4),
                          "learnedALot": (4.25, 4),
                          "enjoyedCourse": (4.25, 4),
                          "timelyGrading": (4.5, 4),
                          "fairGrading": (4.25, 4),
                          "concentratorYes": 1,
                          "concentratorNo": 2,
                          "concentratorMaybe": 1,
                          "requirementYes": 0,
                          "requirementNo": 4,
                          "expectedA": 3,
                          "expectedB": 1,
                          "expectedC": 0,
                          "expectedS": 0,
                          "expectedNC": 0}])

    def test_CSCI0070(self):
        # only has info abt year level distribution
        self.scraper.scrape_course("CSCI 0070")
        self.assertEqual(self.scraper.courses,
                         [{"courseCode": "CSCI 0070",
                           "courseRating": '3.11',
                           "freshmen": '46',
                           "sophomores": '26',
                           "juniors": '19',
                           "seniors": '20',
                           "gradStudents": '0'}])

    def test_MGRK0300(self):
        # has info abt year level distribution, hours, concentrators, and expecte
        self.scraper.scrape_course("MGRK 0300")
        self.assertEqual(self.scraper.courses,
                         [{"courseCode": "MGRK 0300",
                           "courseRating": "4.83",
                           "freshmen": '0',
                           "sophomores": '0',
                           "juniors": '0',
                           "seniors": '4',
                           "gradStudents": '1',
                           "avgHrs": (3.5, 4),
                           "maxHrs": (7.0, 4),
                           "concentratorYes": 2,
                           "concentratorNo": 2,
                           "concentratorMaybe": 0,
                           "requirementYes": 3,
                           "requirementNo": 1,
                           "expectedA": 2,
                           "expectedB": 1,
                           "expectedC": 0,
                           "expectedS": 1,
                           "expectedNC": 0}])

    def test_CSCI0300(self):
        # no reviews
        self.scraper.scrape_course("CSCI 0300")
        self.assertEqual(self.scraper.courses, [{"courseCode": "CSCI 0300"}])
    
    def test_avg(self):
        self.assertEqual(self.scraper.avg(["", "1"]), (1, 1))
        self.assertEqual(self.scraper.avg(["1", "2"]), (1.5, 2))
        self.assertEqual(self.scraper.avg(["1", "na"]), (1, 1))
        self.assertEqual(self.scraper.avg(["1.5"]), (1.5, 1))

    def test_count_elem(self):
        self.assertEqual(self.scraper.count_elem([], "A"), 0)
        self.assertEqual(self.scraper.count_elem(["B", "C", "D"], "A"), 0)
        self.assertEqual(self.scraper.count_elem(["A", "A", "A"], "A"), 3)
        self.assertEqual(self.scraper.count_elem(["A", "1", 1], "1"), 1)


if __name__ == '__main__':
    unittest.main()
