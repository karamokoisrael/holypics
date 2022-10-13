import requests
import numpy as np
import cv2
domain = "https://mgx-api.karamokoisrael.tech"
req = requests.get(
    domain+"/items/feedbacks?filter[moderation_classes][_nnull]=true&filter[downloaded_for_dataset][_eq]=false&filter[image][_nnull]=true")
data = req.json()["data"]
count = 0
total = len(data)
for fileData in data:
    try:
        file = "data/images/{0}/hp-{1}.jpg" .format(
            fileData["moderation_classes"][0], fileData["image"])
        print("processing {0}/{1} => {2}".format(count+1, total, file))
        dwd_url = "{0}/file/{1}".format(domain, fileData["image"])
        image_response = requests.get(dwd_url)
        image = np.asarray(bytearray(image_response.content), dtype="uint8")
        imageBGR = cv2.imdecode(image, cv2.IMREAD_COLOR)
        imageRGB = cv2.cvtColor(imageBGR, cv2.COLOR_BGR2RGB)
        cv2.imwrite(file, imageBGR)
        count += 1
    except Exception as wrong:
        print("error for {0}/{1} => {2}".format(count+1, total, wrong))
        count += 1
        pass
