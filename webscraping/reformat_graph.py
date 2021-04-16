import csv

cab_data = {}

rows = []

with open('../server/data/CAB_v2.csv') as csvFile: 
    reader = csv.DictReader(csvFile)
    for row in reader: 
        rows.append(row)
        course_code = row['courseCode']
        if course_code not in cab_data:
            cab_data[course_code] = []

        # Convert string to nested list
        prereqs = eval(row['preReqs'])

        port = 0
        maxPort = 0

        for prereq in prereqs:
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

print(cab_data['MATH 0540'])

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