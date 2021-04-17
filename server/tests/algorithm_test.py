import unittest

# Allow imports from the /server directory
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

from course_recommendations.algorithm import TextComparison, MetadataComparison, Algorithm

class TestAlgorithmProperties(unittest.TestCase):

    def setUp(self):
        self.text_compare = TextComparison()
        self.metadata_compare = MetadataComparison(parent_dir + "/data/CritReview_data_v2.csv")
        self.text_compare.import_saved_similarity(parent_dir + "/data/similarities_v2.csv")
        self.text_compare.import_department_similarity(parent_dir + "/data/dept_similarities_v2.csv")
        self.algorithm = Algorithm(self.text_compare, self.metadata_compare)

    def test_correct_num(self):
        self.assertEqual(len(self.algorithm.get_recs(["CSCI 0190", "CSCI 0320"], [], 10)), 10)
        self.assertEqual(len(self.algorithm.get_recs(["CSCI 0190", "CSCI 0320"], [], 0)), 0)
        self.assertEqual(len(self.algorithm.get_recs(["CSCI 0190", "CSCI 0320"], [])), 1)
        self.assertEqual(len(self.algorithm.get_recs(["CSCI 0190", "CSCI 0320"], [], None)), 2603)

    def test_sub_results(self):
        self.assertEqual(self.algorithm.get_recs(["CSCI 0190", "CSCI 0320"], [], 10), 
                    self.algorithm.get_recs(["CSCI 0190", "CSCI 0320"], [], None)[:10])
        self.assertEqual(self.algorithm.get_recs(["CSCI 0190", "CSCI 0320"], [], 1), 
                    self.algorithm.get_recs(["CSCI 0190", "CSCI 0320"], [], 10)[:1])
        self.assertEqual(self.algorithm.get_recs(["CSCI 0190", "CSCI 0320"], [], 1), 
                    self.algorithm.get_recs(["CSCI 0190", "CSCI 0320"], [], None)[:1])
    
    def test_change_input(self):
        self.assertNotEqual(self.algorithm.get_recs(["CSCI 0190", "CSCI 0320"], ["High enjoyment"], 10), 
                    self.algorithm.get_recs(["CSCI 0190", "CSCI 0320"], [], 10))
        self.assertNotEqual(self.algorithm.get_recs(["VISA 0100", "CSCI 0320"], ["High enjoyment", "Low difficulty"], 10), 
                    self.algorithm.get_recs(["CSCI 0190", "CSCI 0320"], ["High enjoyment", "Low difficulty"], 10))
        self.assertNotEqual(self.algorithm.get_recs(["CSCI 0190", "CSCI 0320"], ["High enjoyment", "Low difficulty", "Low time commitment"], 10), 
                    self.algorithm.get_recs(["CSCI 0190", "CSCI 0320"], ["High enjoyment", "Low difficulty"], 10))
    
    def test_edge_case_inputs(self):
        with self.assertRaises(ZeroDivisionError):
            self.algorithm.get_recs([], ["High enjoyment"], 10)
        with self.assertRaises(KeyError):
            self.algorithm.get_recs(["CSCI 0190"], ["high enjoyment"], 10)
        self.assertEqual(len(self.algorithm.get_recs(["CSCI 0190"], ["High enjoyment"], 10000)), 
                    len(self.algorithm.get_recs(["CSCI 0190"], ["High enjoyment"], None)))

class TestAlgorithmResultsProperties(unittest.TestCase):

    def setUp(self):
        self.text_compare = TextComparison()
        self.metadata_compare = MetadataComparison(parent_dir + "/data/CritReview_data_v2.csv")
        self.text_compare.import_saved_similarity(parent_dir + "/data/similarities_v2.csv")
        self.text_compare.import_department_similarity(parent_dir + "/data/dept_similarities_v2.csv")
        self.algorithm = Algorithm(self.text_compare, self.metadata_compare)

    def test_departments(self):
        self.assertTrue("CSCI" in [a[0].split(" ")[0] for a in self.algorithm.get_recs(["CSCI 0190", "CSCI 0320", "CSCI 0330"], [], 10)])
        self.assertTrue("MATH" in [a[0].split(" ")[0] for a in self.algorithm.get_recs(["CSCI 0220", "MATH 0540"], [], 10)])
        self.assertTrue("VISA" in [a[0].split(" ")[0] for a in self.algorithm.get_recs(["CSCI 0190", "VISA 0100"], [], 10)])
        self.assertTrue("CSCI" in [a[0].split(" ")[0] for a in self.algorithm.get_recs(["CSCI 0190", "VISA 0100"], [], 10)])

if __name__ == '__main__':
    unittest.main()