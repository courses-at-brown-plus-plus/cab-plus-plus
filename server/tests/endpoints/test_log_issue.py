
import json
import csv

# Allow imports from the /server directory
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

from app import cabData as cabData

def test_log_issue(app, client):
    res = client.post('/logIssue', json={ 
        "issue_type": "remove", 
        "prereq_id": "CSCI 0190", 
        "unlocked_id": "VISA 0100"
        }, follow_redirects=True)
    assert res.status_code == 200

    expected = {'message': 'logged'}
    assert expected == json.loads(res.get_data(as_text=True))

def test_repeat_logs(app, client):
    expected = {'message': 'logged'}
    res = client.post('/logIssue', json={ 
        "issue_type": "remove", 
        "prereq_id": "CSCI 0190", 
        "unlocked_id": "VISA 0100"
        }, follow_redirects=True)
    assert res.status_code == 200
    assert expected == json.loads(res.get_data(as_text=True))

    res = client.post('/logIssue', json={ 
        "issue_type": "remove", 
        "prereq_id": "CSCI 0190", 
        "unlocked_id": "VISA 0100"
        }, follow_redirects=True)
    assert res.status_code == 200
    assert expected == json.loads(res.get_data(as_text=True))

