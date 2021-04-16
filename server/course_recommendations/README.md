# How to use

Before using the server properly, a data/similarities.csv has to be genenerated. In order to do so, download the model as dictated by the README.md in the models folder, and then generate the csv by running the command `python3 algorithm.py -m "./models/universal-sentence-encoder_4" -d "./data/CAB_v2.csv" -s "./data/similarities_v2.csv"`.

# Usage of algorithm.py

All of the following commands should be run in the command line:

`python3 algorithm.py -h` - Shows the possible accepted arguments for algorithm.py

`python3 algorithm.py -m <model_location> -t <textdata_location> -s <save_location>` - Saves a csv file of comparisons at the given save location, given the location of texts and the location of the model.

`python3 algorithm.py -c <course_name> -s <similaritydata_location> -m <metadata_location> [-n <num_recommendations>] [-d <departmentsimilarity_location>]` - Gives recommendations for the given course, given the location of the similarity data, the location of the metadata (Critical Review data), and optionally given the number of recommendations (default: 1) as well as optionally given the overall department similarities.
