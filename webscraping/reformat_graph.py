import csv

cab_data = {}

rows = []

with open('../server/data/CAB_v1.csv') as csvFile: 
    reader = csv.DictReader(csvFile)
    for row in reader: 
        rows.append(row)
        course_code = row['courseCode']
        cab_data[course_code] = []

        # Convert string to nested list
        prereqs = eval(row['preReqs'])

        for prereq in prereqs:
            port = 0
            maxPort = 0

            if type(prereq) == str:
                port = 0
                if prereq not in cab_data:
                    cab_data[prereq] = []
                cab_data[prereq].append((course_code, port))
            elif type(prereq) == list:
                maxPort += 1
                port = maxPort
                for subreq in prereq:
                    if subreq not in cab_data:
                        cab_data[subreq] = []
                    cab_data[subreq].append((course_code, port))

for row in rows:
    row['preReqs'] = cab_data[row['courseCode']]

try:
    with open("../server/data/CAB_v1_formatted.csv", "w") as csvFile:
        csv_columns = ["courseCode", "courseName", "courseDesc", "preReqs",
                       "FYS", "SOPH", "DIAP", "WRIT", "CBLR", "COEX"]
        writer = csv.DictWriter(csvFile, fieldnames=csv_columns)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)
except IOError:
    print("I/O error")