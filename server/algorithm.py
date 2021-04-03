from sklearn.metrics.pairwise import cosine_similarity

import tensorflow as tf
import tensorflow_hub as hub
import pandas as pd

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
    def __init__(self, model_loc: str):
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
    data = CsvLoader("./data/CAB_v1.csv")
    algorithm = TextComparison("./models/universal-sentence-encoder_4")
    print(data.get_data("courseDesc"))
    algorithm.get_cross_product_similarity(data.get_data("courseDesc"), data.get_data("courseCode"))
    algorithm.save_scores("./data/similarities.csv")

    # algorithm = TextComparison("./models/universal-sentence-encoder_4")
    # algorithm.import_saved_similarity("./data/similarities.csv")
    # print(algorithm.get_most_similar("CSCI 0330"))