import json
from operator import mod
from flask import Flask, jsonify, request, abort, make_response
import requests
from dotenv import load_dotenv
from tinydb import TinyDB, Query
import os
import tensorflow as tf
import tensorflow_hub as hub
import imutils
from PIL import Image 
import numpy as np
import cv2
from random import randrange
from cachetools import cached, LRUCache, TTLCache



my_id = os.getenv("ID")
my_secret_key = os.getenv("SECRET_KEY")


app = Flask(__name__)
db = TinyDB('db.json')
load_dotenv()


# consts
DATASET_API_ACCESS_TOKEN = os.getenv("DATASET_API_ACCESS_TOKEN")
DATASET_ID = os.getenv("DATASET_ID")
PORT = int ( os.getenv("PORT") )
MODELS_CACHE_MAX_SIZE = int( os.getenv("MODELS_CACHE_MAX_SIZE") )
MODELS_CACHE_TTL = int( os.getenv("MODELS_CACHE_TTL") )

PREDICTION_THRESHOLD = float( os.getenv("PREDICTION_THRESHOLD") )

APP_MODE= str( os.getenv("APP_MODE") )

# APP_THREADED= bool( os.getenv("APP_THREADED") )

# APP_PROCESSES= int( os.getenv("APP_PROCESSES") )

DB_FILE = "db.json"
IMAGE_RES = 224
DIMENSIONS = (IMAGE_RES, IMAGE_RES)
MODELS = {}
CONFIG={"prediction_threshold": PREDICTION_THRESHOLD}

STATUS_CODE=500
CODE="UNEXPECTED_ERROR"
MESSAGE="Nous avons rencontré une erreur interne lors de l'opération"
# funcs

@cached(cache=TTLCache(maxsize=MODELS_CACHE_MAX_SIZE, ttl=MODELS_CACHE_TTL))
def load_model_sequence():
    models = []
    models_dump = {}
    with open(DB_FILE) as json_file:
            models = json.load(json_file)
            
    for model_data in models:
        model_name = model_data["config"]["name"]
        model_path = "uploads/{}.h5".format(model_data["file"])
        model = tf.keras.models.load_model(
            model_path, 
            custom_objects={'KerasLayer': hub.KerasLayer})
        models_dump[model_name] = {
            "configs": model_data["config"],
            "model": model,
            "session_id": model_data["session_id"]
        }
    return models_dump

@cached(cache=TTLCache(maxsize=MODELS_CACHE_MAX_SIZE, ttl=MODELS_CACHE_TTL))
def get_configs():
    configs = {"prediction_threshold": PREDICTION_THRESHOLD}
    try:
        dataset_api_url = "https://4tro8cx1.directus.app/items/configurations?access_token={0}"
        r = requests.get(dataset_api_url.format(DATASET_API_ACCESS_TOKEN))
        r_json = r.json()["data"]
        configs = r_json
    except Exception as wrong:
        pass
    
    return configs
    

def make_custom_exception(message=MESSAGE, status_code=STATUS_CODE, code=CODE):
    global STATUS_CODE, CODE, MESSAGE
    MESSAGE=message
    STATUS_CODE=status_code
    CODE=code
    raise Exception(message)

def sequence_predict_raw(image_array):
    global MODELS
    predictions = {}
    to_print = ""
    for model_name in MODELS.keys():
        model_data = MODELS[model_name]
        model = model_data["model"]
        prediction = model.predict(image_array)
        class_name = model_data["configs"]["base_class"]
        # predictions[class_name] = prediction[0][0]
        predictions[class_name] = float(prediction[0][0])

        try:
            prob_str = str(prediction[0][0]*100)[0:5]
        except Exception as wrong: 
              prob_str = str(prediction[0][0]*100)

        config = get_configs()

        if prediction[0][0] > config["prediction_threshold"]:
            to_print  += "{0}: {1}% \n".format( class_name, prob_str)

    return to_print, predictions

def sequence_predict_single_image_from_url(url):
    image = imutils.url_to_image(url)
    imageRGB = cv2.cvtColor(image , cv2.COLOR_BGR2RGB)
    image_resized = cv2.resize(imageRGB, DIMENSIONS, interpolation = cv2.INTER_AREA)/255
    to_print, predictions = sequence_predict_raw(np.array([image_resized]))
    return to_print, predictions, Image.fromarray(cv2.resize(imageRGB, DIMENSIONS, interpolation = cv2.INTER_AREA))

def sequence_predict_single_image_from_path(path, break_line=True):
    image = cv2.imread(path)
    imageRGB = cv2.cvtColor(image , cv2.COLOR_BGR2RGB)
    image_resized = cv2.resize(imageRGB, DIMENSIONS, interpolation = cv2.INTER_AREA)/255
    to_print, predictions = sequence_predict_raw(np.array([image_resized]))
    return to_print, predictions, Image.fromarray(cv2.resize(imageRGB, DIMENSIONS, interpolation = cv2.INTER_AREA))

def sequence_predict_single_raw_image(image, break_line=True):
    to_print, predictions = sequence_predict_raw(image)
    return to_print, predictions, image

def sequence_predict_url_batch(urls, figsize=(30, 30), verbose=False, break_line=True):
    predictions_output = []    
    images=[]
    for url in urls:
        try:
            image = imutils.url_to_image(url)
            # imageBGR = cv2.imdecode(image, cv2.IMREAD_COLOR)
            imageRGB = cv2.cvtColor(image , cv2.COLOR_BGR2RGB)
            image_resized = cv2.resize(imageRGB, DIMENSIONS, interpolation = cv2.INTER_AREA)/255
            images.append(np.array([image_resized]))
        except Exception as wrong:
            pass


@app.route('/downloadModels')
def download_models():
    try: 
        try:
            os.remove(DB_FILE) 
        except Exception as wrong:
            print("no db, creating")

        dataset_api_url = "https://4tro8cx1.directus.app/{0}?access_token={1}{2}"
        r = requests.get(dataset_api_url.format("items/models", DATASET_API_ACCESS_TOKEN, "&filter[status]=published&limit=-1&sort=-date_created"))
        models = r.json()["data"]
        saved_data =  []
        already_dowloaded = []

        for model_data in models:
            model_name = model_data["config"]["name"]
            if model_name in already_dowloaded:
                continue

            already_dowloaded.append(model_name)

            try:
                print("downloading => ", model_name)
                r = requests.get(dataset_api_url.format("assets/{}".format(model_data["file"]), DATASET_API_ACCESS_TOKEN, ""), allow_redirects=True)
                model_path = "uploads/{}.h5".format(model_data["file"])
                open(model_path, 'wb').write(r.content)
                saved_data.append(model_data)
            except Exception as wrong: 
                print("skipping => ",model_name, " ", wrong)

        with open(DB_FILE, 'w') as outfile:
            outfile.write(json.dumps(saved_data))
        return jsonify(saved_data)
    except Exception as wrong: 
        payload = {
                "errors": [
                    {
                        "message": str(wrong),
                        "extensions": {
                            "code": "UNEXPECTED_ERROR"
                        }
                    }
                ]
            }
        return jsonify(payload)

@app.route("/predictFromUrl", methods=['POST'])
def predict_from_url():
    global STATUS_CODE
    try: 
        global MODELS
        MODELS = load_model_sequence()
        url = request.json["url"]
        to_print, predictions, image = sequence_predict_single_image_from_url(url)
        output = {"to_print": to_print, "predictions": predictions, "url": url}
        return jsonify(output)

    except Exception as wrong: 
        print(wrong)
        return jsonify(
            {
                "errors": [
                    {
                        "message": MESSAGE,
                        "extensions": {
                            "code": CODE
                        }
                    }
                ]
            }
        ), STATUS_CODE

@app.route("/predictFromRandomUrl", methods=['POST'])
def predict_from_random_url():
    global STATUS_CODE
    try: 
        global MODELS
        MODELS = load_model_sequence()
        collections = [
            "8909560",
            "1242151", #https://unsplash.com/collections/1242151/sexy
            "1785701",
            "8991200", #https://unsplash.com/collections/8991200/sexy
            "5052004"
        ]
        url = "https://source.unsplash.com/collection/{}".format(collections[randrange(len(collections)-1)])
        redirects = requests.get(url)
        url = redirects.url
        to_print, predictions, image = sequence_predict_single_image_from_url(url)
        prediction_data = json.dumps(str(predictions))
        return jsonify({"to_print": to_print, "predictions": prediction_data, "url": url})

    except Exception as wrong: 
        print(wrong)
        return jsonify(
            {
                "errors": [
                    {
                        "message": MESSAGE,
                        "extensions": {
                            "code": CODE
                        }
                    }
                ]
            }
        ), STATUS_CODE

@app.route("/leaveFeedback", methods=['POST'])
def leave_feedback():
    global STATUS_CODE
    try: 
        rating = request.json["rating"]
        comment = request.json["comment"]
        prediction_data = request.json["prediction_data"]
        image_url = request.json["image_url"]
        payload = {
            "rating": rating,
            "comment": comment,
            "prediction_data": prediction_data,
            "dataset_id": DATASET_ID,
            "image_url": image_url
        }
        

        req_url = "https://4tro8cx1.directus.app/items/feedbacks"
        headers = {"Content-Type": "application/json", "Authorization": "Bearer {}".format(DATASET_API_ACCESS_TOKEN)}
        r = requests.post(req_url, data=json.dumps(payload), headers=headers)
        res_json = r.json()
        # print(res_json)
        return jsonify({"message": "Effectuée avec succès"})

    except Exception as wrong: 
        print(wrong)
        return jsonify(
            {
                "errors": [
                    {
                        "message": MESSAGE,
                        "extensions": {
                            "code": CODE
                        }
                    }
                ]
            }
        ), STATUS_CODE

@app.route('/getConfigs', methods=['GET'])
def get_api_configs():
    try: 
        configs = get_configs()
        return jsonify(configs)
    except Exception as wrong: 
        payload = {
                "errors": [
                    {
                        "message": str(wrong),
                        "extensions": {
                            "code": "UNEXPECTED_ERROR"
                        }
                    }
                ]
            }
        return jsonify(payload)


if __name__ == "__main__":
    if APP_MODE == "production":
        app.run(host="0.0.0.0", debug=True, 
        # threaded=APP_THREADED, processes=APP_PROCESSES
        )
    else:
        app.run(host="0.0.0.0", port="{}".format(PORT), debug=True)
    
    