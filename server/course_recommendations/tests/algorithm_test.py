import unittest

# Allow imports from the parent directory
import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from course_recommendations.algorithm import TextComparison, MetadataComparison, Algorithm