import pandas as pd
from algorithm import TextComparison

courses = pd.read_csv("./server/data/similarities.csv", index_col=0).columns.tolist()
algorithm = TextComparison("./server/models/universal-sentence-encoder_4")
algorithm.import_saved_similarity("./server/data/similarities.csv")

courses = [x.replace("\xa0", " ").split(".")[0] for x in courses]
departments = list(set([x.split(" ")[0] for x in courses]))
dept_courses = {}
for i in departments:
  dept_courses[i] = [x for x in courses if x.split(" ")[0] == i]
# print(departments, dept_courses)

dept_similarities = []
for i in departments:
  temp = []
  for j in departments:
    sum_sim = 0
    count = 0
    for x in dept_courses[i]:
      # print(algorithm.get_most_similar(x, num=None))
      sims = [a for a in algorithm.get_most_similar(x, num=None) if a[0].split(" ")[0] == j]
      count += len(sims)
      for y in sims:
        # print(y)
        try:
          sum_sim += y[1]
        except:
          print(i, j, x)
    total_sim = sum_sim / count
    temp.append(total_sim)
  dept_similarities.append(temp)

final = pd.DataFrame(dept_similarities, departments, departments)
final.to_csv("./server/data/dept_similarities.csv")