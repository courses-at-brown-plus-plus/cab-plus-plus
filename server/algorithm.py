from sklearn.metrics.pairwise import cosine_similarity

import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import tensorflow as tf
import tensorflow_hub as hub
import pandas as pd

import sys
import getopt

class CsvLoader(object):
    def __init__(self, data_loc: str):
        self.data_loc = data_loc
        self.data = pd.read_csv(data_loc)
        self.headers = self.data.columns.tolist()
    
    def __str__(self):
        return self.data_loc

    def get_data(self, column: str = None):
        if column is None:
            return self.data
        else:
            if column in self.headers:
                return self.data[column]
            else:
                return None

class TextComparison(object):
    def __init__(self, model_loc: str = None):
        if model_loc is None:
            self.model_loc = None
            self.model = None
        else:
            self.model_loc = model_loc
            self.model = hub.load(model_loc)

        self.data = None
    
    def __str__(self):
        return self.model_loc

    def use_similarity(self, base_document: str, documents: list):
        base_embeddings = self.model([base_document])
        embeddings = self.model(documents)

        scores = cosine_similarity(base_embeddings, embeddings).flatten()
        return scores
    
    def get_cross_product_similarity(self, docs: list, names: list):
        doc_sims = []
        for doc in docs:
            doc_sims.append(self.use_similarity(doc, docs))
        self.data = pd.DataFrame(doc_sims, names, names)

    def import_saved_similarity(self, filename: str):
        self.data = pd.read_csv(filename, index_col=0)
    
    def save_scores(self, filename: str):
        if self.data is not None:
            self.data.to_csv(filename)
            return True
        else:
            return False
    
    def get_data(self):
        return self.data

    def clear_data(self):
        self.data = None
    
    def get_most_similar(self, column: str, num: int = 1):
        if self.data is not None:
            return sorted(list(zip(self.data.columns.tolist(), self.data[column])), key=lambda a: a[1], reverse=True)[1: num + 1]
        else:
            return None

class MetadataComparison(object):
    def __init__(self, metadata_loc: str):
        self.metadata_loc = metadata_loc
        self.data = CsvLoader(metadata_loc)

    def __str__(self):
        return self.metadata_loc

class Algorithm(object):
    def __init__(self, text_compare: TextComparison, metadata_compare: MetadataComparison):
        self.text_compare = text_compare
        self.metadata_compare = metadata_compare

if __name__ == "__main__":
    default_formatting_error = "Arguments not formatted properly. Run `python3 algorithm.py -h` to see the allowed argument formats."

    try:
        opts, args = getopt.getopt(sys.argv[1:], "hs:d:m:c:")
    except getopt.GetoptError:
        print(default_formatting_error)
        sys.exit()
    
    flags = [x[0] for x in opts]

    if '-h' in flags:
        print("Usage: python3 algorithm.py -m <model_location> -t <textdata_location> -s <save_location> \n OR \n" + 
            "python3 algorithm.py -c <course_name> -d <similaritydata_location> [-n <num_recommendations>]")
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
    elif '-c' in flags and '-d' in flags:
        course = [x[1] for x in opts if x[0]=="-c"][0]
        similarity_data_loc = [x[1] for x in opts if x[0]=="-d"][0]

        algorithm = TextComparison()
        algorithm.import_saved_similarity(similarity_data_loc)

        if '-n' in opts:
            print(algorithm.get_most_similar(course, int([x[1] for x in opts if x[0]=="-n"][0])))
        else:
            print(algorithm.get_most_similar(course))
        sys.exit()
    else:
        print(default_formatting_error)
        sys.exit()
