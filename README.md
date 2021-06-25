# 🚕 Courses@Brown++ (C@B++)
Most Brown students would agree that Brown's course catalog, [Courses@Brown](https://cab.brown.edu/), has room for improvement. Especially with the Open Curriculum and the wide range of interests shared by Brown students, it's difficult to figure out how courses fit into different concentrations. C@B's course recommendations often seem arbitrary as well, which means students often aren't exposed to unique classes that they might be interested in.

C@B++ serves as an add-on to the current Courses@Brown page. It uses graphical visualizations of concentration pathways and course suggestions informed by data from [the Critical Review](https://thecriticalreview.org/) to create an easier course planning experience for Brown students.

C@B++ was originally created as a final project for [CS32: Introduction to Software Engineering](http://cs.brown.edu/courses/cs0320/) at Brown University.

## 💡 Main Features

### 🐾 Pathways
Students can use C@B++ to visualize all the different courses and prerequisites in each concentration. By entering the courses they have already taken, they can see which courses they have already achieved all prerequisites for and can take in upcoming semesters. Users can also annotate graphs to indicate which courses they are interested in taking, save their annotations, and view or compare them at a later time. Double-clicking on any course within the graph can also bring up more information to allow users to get a clear understanding of each course.

### 📝 Course Suggestions
C@B++ compares potential future courses to each of a student's previous courses in order to determine which courses to recommend. Users can also rank priorities for their recommendations, such as prioritizing courses with lower time commitment or courses that are good for non-concentrators.

### 🚧 Reporting Issues
Unfortunately, C@B++ is completely informed by data from Courses@Brown and the Critical Review, both of which can be unstandardized or even inaccurate. At the bottom of the screen, users can report issues with course prerequisites (e.g. CSCI 0320 should have CSCI 0190 as a prerequisite, but it currently doesn't) so that C@B++ can continue improving moving forward.

When an issue is reported, the frontend graph visualization will automatically update to display the changed prerequisites. The report will also be sent to a backend database, where a C@B++ administrator will manually review it at a later time and determine whether it is necessary to change C@B++'s source data. This is to protect against any issue reports that may be made in error. Due to this precaution, if a user refreshes the page after an issue report, the graph will return to its initial state.

## 🛠 How to Build and Run
There are more specific instructions for running the course recommendation model in the `server/course_recommendations`
folder and for running the webscraping scripts in the `webscraping` folder. It is not necessary to run those parts of
the code to see our overall project, which can be done by following the following instructions:

### Frontend
1. `npm install` in `client/`
2. `npm start` in `client` to start the webpage on localhost port 3000

### Backend
1. `pip install -r requirements.txt` in `server/`
2. Add a `CABPP_MONGO_CONNECTION` environment variable, with the connection string for your MongoDB setup to store issue reports
3. `python app.py` in `server/` to start the server on localhost port 5000
4. Either generate your own `data/similarities_v2.csv`, or contact us and we'll either give you the file download, or send you the remote access url to use in an environment variable.

### Testing the Flask server (optional)
1. `pip install -r requirements.txt` in `server/`
2. Ensure all environment variables and package installs from the backend build/run instructions were followed
3. Either copy the `server/data/` directory into `server/tests/endpoints/`, or make a symlink of it in that directory
4. `python -m pytest` in `server/tests/endpoints/`

## 👥 Contributors
- [Emily Ye](https://github.com/emxly-21)
- [Gareth Mansfield](https://github.com/GarethMansfield)
- [Kevin Hsu](https://github.com/kaisucode)
- [William Sun](https://github.com/willsun88)