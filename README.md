# cs0320 Term Project 2021

**Team Members:** Emily Ye, Gareth Mansfield, Kevin Hsu, William Sun

**Team Strengths and Weaknesses:**

_Emily:_ Strengths - Python, Java, web scraping, project management; Weaknesses - Web dev, design

_Gareth:_ Strengths - Python, SQL, React; Weaknesses - design, Python web dev

_Kevin:_ Strengths - Web dev / frontend, React, Flask, Rails, Linux; Weaknesses - Machine learning, Selenium

_William:_ Strengths - Python (e.g. Flask), machine learning (PyTorch), Express.js; Weaknesses - React, design

**Project Idea(s):**
### Idea 1: C@B Visualizer
_Problem:_ Having a lot of interests comes with the struggle of keeping track of what courses are interesting, 
what prerequisites are required for cool courses, and how to fit these courses into a schedule.

_Project Idea:_ C@B prerequisite/track visualization: a directed graph of courses where prerequisites lead to 
higher level courses. This would not only allow people to see the courses they're interested in and what is 
required to take them, but would also make for an interesting visualization as to how much diversity there is in 
courses at Brown and how they overlap by department. This would also help visualize prerequisites and how many there are.

_Framework/Languages:_
* React/JS for the frontend
* Java/Python for visualization and data processing
* Python (Selenium, Scrapy) for web scraping
* Java (Spark)/Python (Flask)

_Features:_
* Course visualization in a directed graph
* Data grabbed from C@B to keep updated with current courses and what courses are offered in the semester
* A GUI to filter out by department(s), by the years/semesters in which courses are offered, etc.
* A place for people to report issues with the way courses are listed (for example, if a course has a prerequisite but it isn't listed under the prerequisite section of C@B so it would have to be manually added in, or a course changes between semesters and the prerequisites need to be updated)

### Idea 2 - Digital Gardening
_Problem:_
A lot of people have their own personal collection of notes for random topics, but it's usually stored in folders as 
text files or documents. This project allows an interactive way to showcase your library of niche knowledge, and 
let people explore in a leisurely fashion.

_Project Idea:_
We present a platform for  Digital Gardening, which is kind of like blogging, but geared more towards the style of 
creating a sketchbook/notebook/personal wiki. We think it would be really nice to look into creating a platform for 
this, but instead of just texts and links, the project could display it as an actual botanical garden with plants, 
standing as access points for text pages. There would still be a search bar for easy access, but the idea would be to 
take a stroll in other people's digital gardens with an avatar and explore their thoughts in that fashion. 
Assets for the project could potentially come from pixelating freely-usable images, and there could also be 
small animals that walk up to visitors in the garden and presenting ideas as a randomizer.

This could also expand towards a more game-type project, keeping track of points, visitors, and how much a user's 
plants/ideas grow, then allowing users to purchase additional infrastructure with those points.

_Proposed Languages & Frameworks:_
* React (JS) for the frontend
* Flask (Python) for the backend

_Critical features:_
* Display the notes/botanical garden of each person: pixelating the free assets in an aesthetic way that fits the 
  overall vibes, and properly placing them in the project
* Editor to organize and file new notes: having a clean drag and drop file system might prove to be challenging
* Have an avatar that's able to walk around: collision detection with other objects efficiently could be complicated
* Being able to see and interact with other players: socket connections and broadcasting to players in close 
  proximity might be difficult

### Idea 3 - Physics Simulator
_Problem:_ Physics can be difficult for beginners because concepts are hard to visualize.

_Project Description:_ A platform to host physics tutorials accompanied by diagrams/simulations (e.g. collision model 
for momentum, gravitational potential/attraction, optics, etc. -- depending on how much time we have).

_Proposed Languages & Frameworks:_
* React (JS) for the frontend (possibly with the help of other libraries?)
* Spark (Java) / Flask (Python) for the backend -- Python preferred
* Could potentially create a desktop app purely in Python instead of web app with frontend and backend

_Features:_
* Physics simulation demos - Written lessons/explanations accompanied by simulations the user can interact with
  * For example: An optics simulation where the user can adjust the angle that a laser hits the surface of a body of water, and can see how the change in incident angle affects the refracted angle
* If time: allow users to upload notes / videos / questions related to the topic

**Mentor TA:** _Put your mentor TA's name and email here once you're assigned one!_

## Meetings
_On your first meeting with your mentor TA, you should plan dates for at least the following meetings:_

**Specs, Mockup, and Design Meeting:** _(Schedule for on or before March 15)_

**4-Way Checkpoint:** _(Schedule for on or before April 5)_

**Adversary Checkpoint:** _(Schedule for on or before April 12 once you are assigned an adversary TA)_

## How to Build and Run
_A necessary part of any README!_
