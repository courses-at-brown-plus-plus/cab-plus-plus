
import json
import csv

# Allow imports from the /server directory
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

from app import cabData as cabData

def test_all_pathway_data(app, client):
    res = client.get('/allPathwayData')
    assert res.status_code == 200

    expectedRowCount = 0
    with open('data/CAB_v1_formatted.csv') as csvFile: 
        reader = csv.DictReader(csvFile)
        for row in reader: 
            expectedRowCount += 1

    pathwayData = json.loads(res.get_data(as_text=True))["pathwayData"]
    assert expectedRowCount == len(pathwayData)

def test_csci_courses_exist(app, client): 
    res = client.get('/allPathwayData')
    pathwayData = json.loads(res.get_data(as_text=True))["pathwayData"]
    assert "CSCI 0190" in pathwayData
    assert "CSCI 0320" in pathwayData
    assert "CSCI 0330" in pathwayData
    assert "CSCI 0300" in pathwayData

def test_visa_courses_exist(app, client): 
    res = client.get('/allPathwayData')
    pathwayData = json.loads(res.get_data(as_text=True))["pathwayData"]
    assert "VISA 0100" in pathwayData
    assert "VISA 0130" in pathwayData
    assert "VISA 1110" in pathwayData

def test_contents_correct(app, client): 
    res = client.get('/allPathwayData')
    pathwayData = json.loads(res.get_data(as_text=True))["pathwayData"]
    assert 'Accelerated Introduction to Computer Science' == pathwayData["CSCI 0190"]["courseName"]
    assert 'Studio Foundation' == pathwayData["VISA 0100"]["courseName"]

