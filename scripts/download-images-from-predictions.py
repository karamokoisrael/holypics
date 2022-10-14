import os
from urllib.request import urlopen
import requests
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

domain = str(os.getenv("API_URL"))
dataset_path = "../data/datasets/nsfw-content-moderation/tmp"
req = requests.get(
    domain+"/items/feedbacks?filter[moderation_classes][_nnull]=true&filter[downloaded_for_dataset][_neq]=true&filter[image][_nnull]=true")
data = req.json()["data"]
print(data)
count = 0
total = len(data)
existing_paths = []
for fileData in data:
    try:
        path = os.path.join(dataset_path, fileData["moderation_classes"][0])
        file  = os.path.join(path, fileData["image"])
        if not fileData["moderation_classes"][0] in existing_paths:
            os.system("mkdir {}".format(path))
            existing_paths.append(fileData["moderation_classes"][0])
            
        print("processing {0}/{1} => {2}".format(count+1, total, file))
        dwd_url = "{0}/file/{1}".format(domain, fileData["image"])
        response = urlopen(dwd_url, timeout=3)
        with open(file, 'wb') as f:
            f.write(response.read())
        count += 1
    except Exception as wrong:
        print("error for {0}/{1} => {2}".format(count+1, total, wrong))
        count += 1
        pass
