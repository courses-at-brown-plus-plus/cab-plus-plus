
import json
import csv

# Allow imports from the /server directory
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

from app import cabData as cabData

def test_generate_recommendations(app, client):
    res = client.post('/generateRecommendations', json={ 
        "courses_taken": ["CSCI 0190", "CSCI 0320", "CSCI 0330", "CSCI 0180"], 
        "priorities": []
        }, follow_redirects=True)
    assert res.status_code == 200

    recommendedCourses = json.loads(res.get_data(as_text=True))["recommendedCourses"]

    # at least one CS course in recommendations since all courses are CS
    numOfCsCourses = 0

    for courseID in recommendedCourses: 
        if (courseID[0:4] == "CSCI"): 
            numOfCsCourses += 1
    assert numOfCsCourses > 0

def test_recs_with_priorities(app, client):
    res = client.post('/generateRecommendations', json={ 
        "courses_taken": ["VISA 0100", "VISA 1110", "VISA 0130"], 
        "priorities": ["High enjoyment", "Low difficulty"]
        }, follow_redirects=True)
    assert res.status_code == 200

    recommendedCourses = json.loads(res.get_data(as_text=True))["recommendedCourses"]

    # at least one VISA course in recommendations since all courses are VISA
    numOfCsCourses = 0

    for courseID in recommendedCourses: 
        if (courseID[0:4] == "VISA"): 
            numOfCsCourses += 1
    assert numOfCsCourses > 0

def test_bad_priority_label(app, client):
    res = client.post('/generateRecommendations', json={ 
        "courses_taken": ["VISA 0100"], 
        "priorities": ["NONEXISTENT", "Low difficulty"]
        }, follow_redirects=True)
    assert res.status_code == 500

def test_bad_course_id(app, client):
    res = client.post('/generateRecommendations', json={ 
        "courses_taken": ["NONEXISTENT"], 
        "priorities": []
        }, follow_redirects=True)
    assert res.status_code == 500

