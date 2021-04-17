# cs0320 Term Project 2021

**Team Members:** Emily Ye, Gareth Mansfield, Kevin Hsu, William Sun

**Team Strengths and Weaknesses:**

_Emily:_ Strengths - Python, Java, web scraping, project management; Weaknesses - Web dev, design

_Gareth:_ Strengths - Python, SQL, React; Weaknesses - design, Python web dev

_Kevin:_ Strengths - Web dev / frontend, React, Flask, Rails, Linux; Weaknesses - Machine learning, Selenium

_William:_ Strengths - Python (e.g. Flask), machine learning (PyTorch), Express.js; Weaknesses - React, design

**Project Idea:**
### C@B Visualizer
_Problem:_ Having a lot of interests comes with the struggle of keeping track of what courses are interesting, 
what prerequisites are required for cool courses, and how to fit these courses into a schedule.

_Project Idea:_ C@B prerequisite/track visualization: a directed graph of courses where prerequisites lead to 
higher level courses. This would not only allow people to see the courses they're interested in and what is 
required to take them, but would also make for an interesting visualization as to how much diversity there is in 
courses at Brown and how they overlap by department. This would also help visualize prerequisites and how many there are.
In addition, this would connect to a recommendation system that can help pick out courses that are similar to courses
they have taken and enjoyed.

_Framework/Languages:_
* React/JS for the frontend
* Python for visualization and data processing
* Python (Selenium, Scrapy) for web scraping
* Python (Flask)

_Features:_
* Course visualization in a directed graph
* Data grabbed from C@B to keep updated with current courses and what courses are offered in the semester
* A GUI to filter out by department(s), by the years/semesters in which courses are offered, etc.
* A place for people to report issues with the way courses are listed (for example, if a course has a prerequisite but it isn't listed under the prerequisite section of C@B so it would have to be manually added in, or a course changes between semesters and the prerequisites need to be updated)

_Algorithmic Complexity Features:_
* A recommendation system that recommends courses based on concentration, what courses have been taken, and what 
  prerequisites have been taken. Additional factors such as course difficulty and professor ratings can be scraped from
  the Critical Review and added/ranked by the user depending on what they care most about.
* Underlying implementation is a dynamically updating algorithm that determines the probability of course similarity 
  based on the probability matrices of correlations between departments and other courses that have been taken by 
  the user, which will have to be updated every time new courses are added or new user information is provided.
* We are hoping to use Python for the backend of this project because there is a significant amount of data 
  science/machine learning and web scraping involved, which we are most familiar with in Python.

**Mentor TA:** Sarah Rockhill (sarah_rockhill@brown.edu)

## Meetings
_On your first meeting with your mentor TA, you should plan dates for at least the following meetings:_

**Specs, Mockup, and Design Meeting:** March 15

**4-Way Checkpoint:** April 5

**Adversary Checkpoint:** _(Schedule for on or before April 12 once you are assigned an adversary TA)_

## How to Build and Run

### Frontend
1. `npm install` in `client/`
2. `npm start` in `client` to start the webpage on localhost port 3000

### Backend
1. `pip install -r requirements.txt` in `server/`
2. Add a `CABPP_MONGO_CONNECTION` environment variable, with the connection string for your MongoDB setup to store issue reports
3. `python app.py` in `server/` to start the server on localhost port 5000
4. Either generate your own `data/similarities_v2.csv`, or contact us and we'll either give you the file download, or send you the remote access url to use in an environment variable.

## Testing the Flask server
1. `pip install -r requirements.txt` in `server/`
2. Ensure all environment variables and package installs from the backend build/run instructions were followed
3. Either copy the `server/data/` directory into `server/tests/endpoints/`, or make a symlink of it in that directory
4. `python -m pytest` in `server/tests/endpoints/`

## Resources & REST API table
| URL/ENDPOINT             | VERB | DESCRIPTION                                                   |
|--------------------------|------|---------------------------------------------------------------|
| /allPathwayData          | GET  | Retrieves pathway data scraped                                |
| /allCourseCodes          | GET  | Returns all available course codes                            |
| /generateRecommendations | POST | Generates recommendations { courses_taken, priorities }       |
| /logIssue                | POST | Logs issue to database { issue_type, prereq_id, unlocked_id } |

