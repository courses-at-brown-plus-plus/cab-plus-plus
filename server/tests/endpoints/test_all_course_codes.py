
import json
import csv

# Allow imports from the /server directory
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

from app import cabData as cabData

def test_all_course_codes_length(app, client):
    res = client.get('/allCourseCodes')
    assert res.status_code == 200

    expectedRowCount = 0
    with open('data/CAB_v1_formatted.csv') as csvFile: 
        reader = csv.DictReader(csvFile)
        for row in reader: 
            expectedRowCount += 1

    courseCodes = json.loads(res.get_data(as_text=True))["courseCodes"]
    assert expectedRowCount == len(courseCodes)

def test_csci_courses_exist(app, client): 
    res = client.get('/allCourseCodes')
    courseCodes = json.loads(res.get_data(as_text=True))["courseCodes"]
    assert "CSCI 0190" in courseCodes
    assert "CSCI 0320" in courseCodes
    assert "CSCI 0330" in courseCodes
    assert "CSCI 0300" in courseCodes

def test_visa_courses_exist(app, client): 
    res = client.get('/allCourseCodes')
    courseCodes = json.loads(res.get_data(as_text=True))["courseCodes"]
    assert "VISA 0100" in courseCodes
    assert "VISA 0130" in courseCodes
    assert "VISA 1110" in courseCodes

