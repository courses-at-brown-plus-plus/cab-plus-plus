
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

import csv

PORT = "5000"
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

cabData = {}

@app.route("/allPathwayData", methods=["GET"])
@cross_origin()
def allPathwayData(): 
    # Reformat cab data for frontend
    pathwayData = cabData
    print(cabData)
    return jsonify({"pathwayData": pathwayData}), 200

@app.route("/allCourseCodes", methods=["GET"])
@cross_origin()
def allCourseCodes(): 
    courseCodes = cabData.keys()
    return jsonify({"courseCodes": courseCodes}), 200

@app.route("/generateRecommendations", methods=["POST"])
@cross_origin()
def generateRecommendations(): 
    coursesTaken = request.json["courses_taken"]
    priorities = request.json["priorities"]

    # Run algorithm here
    recommendedCourses = []
    return jsonify({"recommendedCourses": recommendedCourses}), 200

def appSetup(): 
    with open('data/CAB_v1_formatted.csv') as csvFile: 
        reader = csv.DictReader(csvFile)
        for row in reader: 
            cabData[row['courseCode']] = row
    #  print(cabData)

appSetup()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=True)

