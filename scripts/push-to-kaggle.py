import json
import os
import sys
import time
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

credentials = {"username": os.getenv("KAGGLE_USERNAME"), "key": os.getenv("KAGGLE_KEY")}
dataset_path = "../data/datasets/nsfw-content-moderation"
kaggle_key_store='kaggle.json'
with open(kaggle_key_store, 'w', encoding='utf-8') as f:
    json.dump(credentials, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    dataset_name = "nsfw-content-moderation" if len(sys.argv) < 2 else int(sys.argv[1])
    save_name = 'updated_data_{}'.format(time.time())
    os.system("kaggle datasets status {}".format(dataset_name))
    os.system("kaggle datasets metadata -p {0} {1} ".format(dataset_path, dataset_name))
    os.system("kaggle datasets version -p {0} -m {1} --dir-mode zip".format(dataset_path, save_name))
