import csv

cab_data = {}

output_text = 'courseCode,courseName,courseDesc,preReqs,FYS,SOPH,DIAP,WRIT,CBLR,COEX\n'

with open('../server/data/CAB_v1.csv') as csvFile: 
    reader = csv.DictReader(csvFile)
    for row in reader: 
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


    csvFile.seek(0)
    reader = csv.DictReader(csvFile)
    for row in reader:
        course_code = row['courseCode']

        row['preReqs'] = str(cab_data[course_code])

        output_text += ','.join(row.values()) + '\n'

print(output_text)


with open('../server/data/CAB_v1_formatted.csv', 'w') as csvFile: 
    csvFile.write(output_text)
