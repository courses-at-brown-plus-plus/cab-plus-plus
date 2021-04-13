
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

import csv
from algorithm import TextComparison, MetadataComparison, Algorithm

PORT = 5000
app = Flask(__name__)
#  cors = CORS(app)
cors = CORS(app, resources={r"/*":{"origins": "*", "supports_credentials": True}})

app.config['CORS_HEADERS'] = 'Content-Type'

cabData = {}

@app.route("/allPathwayData", methods=["GET"])
@cross_origin()
def allPathwayData(): 
    # Reformat cab data for frontend
    pathwayData = cabData
    print("request received all pathwayData ")
    return jsonify({"pathwayData": pathwayData}), 200

@app.route("/allCourseCodes", methods=["GET"])
@cross_origin()
def allCourseCodes(): 
    courseCodes = list(cabData.keys())
    print("request received all course codes")
    return jsonify({"courseCodes": courseCodes}), 200

@app.route("/generateRecommendations", methods=["POST"])
@cross_origin()
def generateRecommendations(): 
    print("request received, generating recommendations")
    courses_taken = request.json["courses_taken"]
    priorities = request.json["priorities"]
    #  print("courses taken: " + courses_taken)
    #  print("priorities" + priorities)

    # Run algorithm here
    text_compare = TextComparison()
    metadata_compare = MetadataComparison("./data/CritReview_data.csv")
    text_compare.import_saved_similarity("./data/similarities.csv")
    algorithm = Algorithm(text_compare, metadata_compare)
    recommended_courses = algorithm.get_recs(courses_taken, priorities, 5)
    print("request received generate recs")
    print("recommended_courses: ")
    print(recommended_courses)
    print(type(recommended_courses))

    ret = []
    for item in recommended_courses: 
        ret.append(item[0])
    return jsonify({"recommendedCourses": ret}), 200

def appSetup(): 
    with open('data/CAB_v1_formatted.csv') as csvFile: 
        reader = csv.DictReader(csvFile)
        for row in reader: 
            #TODO: Don't use eval
            row['preReqs'] = eval(row['preReqs'])
            cabData[row['courseCode']] = row

    print("app setup done")
    #  print(cabData)

appSetup()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=True)

