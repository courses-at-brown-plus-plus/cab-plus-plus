from sklearn.metrics.pairwise import cosine_similarity

import tensorflow as tf
import tensorflow_hub as hub
import pandas as pd

class CsvLoader(object):
    def __init__(self, data_loc: str):
        self.data_loc = data_loc
        self.data = pd.read_csv(data_loc)
        self.headers = self.data.columns.tolist()
    
    def get_data(self, column: str = None):
        if column is not None:
            return self.data
        else:
            if column not in self.headers:
                return self.data[column]
            else:
                return None

class AlgorithmLoader(object):
    def __init__(self, model_loc: str):
        self.model_loc = model_loc
        self.model = hub.load(model_loc)
    
    def use_similarity(self, base_document: str, documents: list):
        base_embeddings = self.model([base_document])
        embeddings = self.model(documents)

        scores = cosine_similarity(base_embeddings, embeddings).flatten()
        return scores

        # highest_score = 0
        # highest_score_index = 0
        # for i, score in enumerate(scores):
        #     if highest_score < score:
        #         highest_score = score
        #         highest_score_index = i

        # most_similar_document = documents[highest_score_index]
        # print("Most similar document by USE with the score:", most_similar_document, highest_score)
    
    def get_cross_product(self, docs: list):
        doc_sims = []
        for doc in docs:
            doc_sims.append(self.use_similarity(doc, docs))
        return doc_sims



base_document = "This is an example sentence for the document to be compared"
documents = ["This is an example sentence for the document to be compared", "This is the collection of documents to be compared against the base_document"]

algorithm = AlgorithmLoader("./models/universal-sentence-encoder_4")
scores = algorithm.use_similarity(base_document, documents)

highest_score = 0
highest_score_index = 0
for i, score in enumerate(scores):
    if highest_score < score:
        highest_score = score
        highest_score_index = i

most_similar_document = documents[highest_score_index]
print("Most similar document by USE with the score:", most_similar_document, highest_score)