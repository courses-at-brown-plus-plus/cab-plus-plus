from sklearn.metrics.pairwise import cosine_similarity

import os
# Prevent warnings and info messages of imports from outputting, but not errors
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import tensorflow as tf
import tensorflow_hub as hub
import pandas as pd
import math

import sys
import getopt

class CsvLoader(object):
    """Class for loading in and processing CSV files."""

    def __init__(self, data_loc: str):
        """Stores the data location and loads in the csv as a pandas dataframe,
        as well as save the headers."""
        self.data_loc = data_loc
        self.data = pd.read_csv(data_loc, index_col=0)
        self.headers = self.data.columns.tolist()
    
    def __str__(self):
        """Defines a string representation of the CsvLoader object."""
        return self.data_loc

    def get_data(self, column: str = None):
        """Gets the data. If column name is specified, gets that specific column."""
        if column is None:
            return self.data
        else:
            if column in self.headers:
                return self.data[column]
            else:
                return None

class TextComparison(object):
    def __init__(self, model_loc: str = None):
        """Stores the model location and loads in the model. If no model location is
        specified, no model is loaded in."""
        if model_loc is None:
            self.model_loc = None
            self.model = None
        else:
            self.model_loc = model_loc
            self.model = hub.load(model_loc)

        self.data = None
        self.dept_data = None

        # Hyperparams
        self.TEXT_WEIGHT = 0.8
        self.DEPT_WEIGHT = 0.2
    
    def __str__(self):
        """Defines a string representation of the TextComparison object."""
        return self.model_loc

    def use_similarity(self, base_document: str, documents: list):
        """Gets the USE similarity of a list of documents compared to a single 
        base document, returning the values."""
        base_embeddings = self.model([base_document])
        embeddings = self.model(documents)

        scores = cosine_similarity(base_embeddings, embeddings).flatten()
        return scores
    
    def get_cross_product_similarity(self, docs: list, names: list):
        """Gets the USE similarity of a list of documents compared to a list of
        documents, saving the resultant in the self.data variable."""

        temp = list(zip(names, docs))
        unique_indices = []
        items = []
        for i in range(len(temp)):
            if temp[i][0] not in items:
                unique_indices.append(i)
                items.append(temp[i][0])
        res = [temp[i] for i in unique_indices]
        names = [i[0] for i in res]
        docs = [i[1] for i in res]

        doc_sims = []
        for doc in docs:
            doc_sims.append(self.use_similarity(doc, docs))
        self.data = pd.DataFrame(doc_sims, names, names)

    def import_saved_similarity(self, filename: str):
        """Imports an existing similarity csv."""
        self.data = pd.read_csv(filename, index_col=0)
        fixed_courses = [x.replace("\xa0", " ").split(".")[0] for x in self.data.columns.tolist()]
        self.data.columns = fixed_courses
        self.data.index = fixed_courses
    
    def import_department_similarity(self, filename: str):
        """Imports an existing department similarity csv."""
        self.dept_data = pd.read_csv(filename, index_col=0)

    def save_scores(self, filename: str):
        """Saves data if it exists."""
        if self.data is not None:
            self.data.to_csv(filename)
            return True
        else:
            return False

    def get_data(self):
        """Grabs the data."""
        return self.data

    def clear_data(self):
        """Clears the data."""
        self.data = None

    def get_most_similar(self, column: str, num: int = 1):
        """Grabs the course most similar to the given course. If a num is specified,
        it will get that number of similar courses. If num = None, grabs all of the values."""
        if self.data is not None:
            similarities = [a for a in sorted(list(zip(self.data.columns.tolist(), self.data[column])), key=lambda a: a[1], reverse=True) if a[0] != column]
            if self.dept_data is not None:
                similarities_with_dept = sorted([(a[0], a[1]*self.TEXT_WEIGHT + self.dept_data[a[0].split(" ")[0]][column.split(" ")[0]]*self.DEPT_WEIGHT) for a in similarities],
                            key=lambda a: a[1], reverse=True)
                return similarities_with_dept[0: num]
            else:
                return similarities[0: num]
        else:
            return None
    
    def get_most_similar_multiple(self, columns: list, num: int = 1):
        """Grabs the course most similar to the given list of courses. If a num is specified,
        it will get that number of similar courses. If num = None, grabs all of the values."""
        if self.data is not None:
            similarities = [a for a in sorted(list(zip(self.data.columns.tolist(), (self.data[columns].sum(axis=1)/float(len(columns))))), 
                        key=lambda a: a[1], reverse=True) if a[0] not in columns]
            if self.dept_data is not None:
                column_depts = [a.split(" ")[0] for a in columns]
                similarities_with_dept = sorted([(a[0], a[1]*self.TEXT_WEIGHT 
                            + self.dept_data[column_depts].sum(axis=1)[a[0].split(" ")[0]]*(self.DEPT_WEIGHT / float(len(columns)))) 
                            for a in similarities], key=lambda a: a[1], reverse=True)
                return similarities_with_dept[0: num]
            else:
                return similarities[0: num]
        else:
            return None

class MetadataComparison(object):
    def __init__(self, metadata_loc: str):
        """Initializes the metadata location and creates a CsvLoader of the metadata."""
        self.metadata_loc = metadata_loc
        self.data = CsvLoader(metadata_loc)

        # Hyperparams
        self.priority_weight = [0.4, 0.25, 0.15, 0.1]
        self.total = 1.0

    def __str__(self):
        """Defines a string representation of the MetadataComparison object."""
        return self.metadata_loc

    def data_is_valid(self, val):
        """Helper to check if a value of data is valid."""
        if type(val) == int or type(val) == float:
            return not (math.isnan(val))
        else:
            return not (val == "n/a")

    def get_category_vals(self, course: str):
        """Grabs the value of the course, before weighted by priorities."""
        if math.isnan(self.data.get_data("courseRating")[course]):
            return None
        else:
            if self.data_is_valid(self.data.get_data("avgHrs")[course]) and self.data_is_valid(self.data.get_data("maxHrs")[course]):
                time_commitment = ((min(1, 1.5/(float(self.data.get_data("avgHrs")[course].strip("()").split(", ")[0])))
                            + min(1, 1.5/(float(self.data.get_data("maxHrs")[course].strip("()").split(", ")[0]))))/2.0)
            elif self.data_is_valid(self.data.get_data("avgHrs")[course]):
                time_commitment = min(1, 1.5/(float(self.data.get_data("avgHrs")[course].strip("()").split(", ")[0])))
            elif self.data_is_valid(self.data.get_data("maxHrs")[course]):
                time_commitment = min(1, 1.5/(float(self.data.get_data("maxHrs")[course].strip("()").split(", ")[0])))
            else:
                time_commitment = None
            
            if self.data_is_valid(self.data.get_data("difficult")[course]):
                difficulty = ((5.0 - float(self.data.get_data("difficult")[course].strip("()").split(", ")[0])) / 5.0)
            else:
                difficulty = None
            
            if self.data_is_valid(self.data.get_data("enjoyedCourse")[course]) and self.data_is_valid(self.data.get_data("courseRating")[course]):
                enjoyment = ((float(self.data.get_data("enjoyedCourse")[course].strip("()").split(", ")[0])
                        + float(self.data.get_data("courseRating")[course]))/10.0)
            elif self.data_is_valid(self.data.get_data("enjoyedCourse")[course]):
                enjoyment = float(self.data.get_data("enjoyedCourse")[course].strip("()").split(", ")[0]) / 5.0
            elif self.data_is_valid(self.data.get_data("courseRating")[course]):
                enjoyment = float(self.data.get_data("courseRating")[course]) / 5.0
            else:
                enjoyment = None
            
            non_conc = ((float(self.data.get_data("concentratorYes")[course]) + 0.5 * float(self.data.get_data("concentratorMaybe")[course])) /
                        (float(self.data.get_data("concentratorYes")[course]) + float(self.data.get_data("concentratorNo")[course])
                        + float(self.data.get_data("concentratorMaybe")[course])))
            
            try:
                class_size = min(1, 10.0 / (float(self.data.get_data("freshmen")[course]) + float(self.data.get_data("sophomores")[course])
                            + float(self.data.get_data("juniors")[course]) + float(self.data.get_data("seniors")[course]) 
                            + float(self.data.get_data("gradStudents")[course])))
            except:
                class_size = None

            if self.data_is_valid(self.data.get_data("fairGrading")[course]):
                grading = ((float(self.data.get_data("fairGrading")[course].strip("()").split(", ")[0])) / 5.0)
            else:
                grading = None

            priority_vals = {"Time Commitment": time_commitment, "Difficulty": difficulty, "Enjoyment": enjoyment, 
                        "Suitability for none-concentrators": non_conc, "Small class size": class_size, "Fair grading": grading}
            return priority_vals

    
    def get_fit_value(self, course: str, priorities: list):
        """Grabs the value of the course according to the priorities."""
        if math.isnan(self.data.get_data("courseRating")[course]):
            return None
        else:
            priority_vals = self.get_category_vals(course)
            priority = self.priority_weight[:len(priorities)]
            non_priority = self.total - sum(self.priority_weight[:len(priorities)])
            fit = 0
            total = 0
            for i in range(len(priorities)):
                if (priority_vals[priorities[i]] is not None):
                    fit += priority_vals[priorities[i]] * priority[i]
                    total += priority[i]
            
            non_priority_vals = [a for a in priority_vals.keys() if a not in priorities]
            for i in range(len(non_priority_vals)):
                if (priority_vals[non_priority_vals[i]] is not None):
                    fit += priority_vals[non_priority_vals[i]] * non_priority
                    total += non_priority

            return fit / total

class Algorithm(object):
    def __init__(self, text_compare: TextComparison, metadata_compare: MetadataComparison):
        """Assembles both algorithm parts from an instance of TextComparison
        and an instance of MetadataComparison."""
        self.text_compare = text_compare
        self.metadata_compare = metadata_compare

        # Hyperparams
        self.text_weight = 0.8
        self.metadata_weight = 0.2
    
    def get_recs(self, course_list: list, priorities: list, num: int = 1):
        """Gets course recommendations based on the course list and priorities. If a num is specified,
        it will get that number of similar courses. If num = None, grabs all of the values. Default num: 1"""
        text_vals = self.text_compare.get_most_similar_multiple(course_list, num=None)
        priority_vals = [self.metadata_compare.get_fit_value(a[0], priorities) for a in text_vals]
        final = [(a[0][0], a[0][1]*self.text_weight + a[1]*self.metadata_weight) if a[1] is not None else a[0] for a in zip(text_vals, priority_vals)]
        final_sorted = sorted(final, key=lambda a: a[1], reverse=True)
        return final_sorted[:num]

if __name__ == "__main__":
    default_formatting_error = "Arguments not formatted properly. Run `python3 algorithm.py -h` to see the allowed argument formats."

    try:
        opts, args = getopt.getopt(sys.argv[1:], "hs:d:m:c:n:t:")
    except getopt.GetoptError:
        print(default_formatting_error)
        sys.exit()

    flags = [x[0] for x in opts]

    if '-h' in flags:
        print("Usage: python3 algorithm.py -m <model_location> -t <textdata_location> -s <save_location> \n OR \n" + 
            "python3 algorithm.py -c <course_name> -s <similaritydata_location> -m <metadata_location> [-n <num_recommendations>] [-d <departmentsimilarity_location>]")
        sys.exit()
    elif '-m' in flags and '-s' in flags and '-t' in flags:
        model_loc = [x[1] for x in opts if x[0]=="-m"][0]
        save_loc = [x[1] for x in opts if x[0]=="-s"][0]
        data_loc = [x[1] for x in opts if x[0]=="-t"][0]

        data = CsvLoader(data_loc)
        algorithm = TextComparison(model_loc)
        # print(data.get_data("courseDesc"))
        algorithm.get_cross_product_similarity(data.get_data("courseDesc"), data.get_data("courseCode"))
        algorithm.save_scores(save_loc)

        sys.exit()
    elif '-c' in flags and '-s' in flags and '-m' in flags:
        course = [x[1] for x in opts if x[0]=="-c"][0]
        similarity_data_loc = [x[1] for x in opts if x[0]=="-s"][0]
        metadata_loc = [x[1] for x in opts if x[0]=="-m"][0]

        text_compare = TextComparison()
        metadata_compare = MetadataComparison(metadata_loc)
        text_compare.import_saved_similarity(similarity_data_loc)
        if '-d' in flags:
            department_similarity_loc = [x[1] for x in opts if x[0]=="-d"][0]
            text_compare.import_department_similarity(department_similarity_loc)

        if '-n' in flags:
            print(text_compare.get_most_similar(course, int([x[1] for x in opts if x[0]=="-n"][0])))
        else:
            print(text_compare.get_most_similar(course))
        sys.exit()
    else:
        print(default_formatting_error)
        sys.exit()
