import requests
import os
from PIL import Image
from urllib.request import urlopen
import uuid
from pathlib import Path     
import sys
 
def dwd_images(count_set, source_file, directory, limitPoint = 10000):
    total = len(open(Path(source_file)).readlines())
    image_input_file = open(source_file, "r")
    
    count = count_set
    image_input_file = [image_input_fileS for image_input_fileS in image_input_file]
    ids = str(uuid.uuid1())
    
    if limitPoint == 10000:
        image_url_list = image_input_file[count_set:]
    else:
        image_url_list = image_input_file[count_set:limitPoint]
        
    for url in image_url_list:
        count+=1
        try:
            currentId = str(uuid.uuid1())
            file = directory+"/"+ids+currentId+".jpg"
            response = requests.get(url, stream=True)
            with open(file, 'wb') as f:
                f.write(response.content)
            f.close()
            
            print("{0} / {1} success => {2} path => {3}".format(count, total, url, file))

        except Exception as wrong: 
            print("{0} / {1} req failure => {2} : {3}".format(count, total, url, wrong))
            pass
        

startPoint = 0
limitPoint = 10000
directory = "images_reinforce_test/adult"
source_file = "deploy-adult.txt"

if __name__ == "__main__":
    print(sys.argv)
    
    if len(sys.argv)>1:
        source_file = sys.argv[1]
    if len(sys.argv)>2:
        directory = sys.argv[2]
    
    if len(sys.argv)>3:
        startPoint = int(sys.argv[3])
        
    if len(sys.argv)>4:
        limitPoint = int(sys.argv[4])
        
        
        
        

dwd_images(startPoint,source_file, directory, limitPoint)
#os.system("image-cleaner "+directory)
#python dwda.py deploy-neutral.txt images_reinforce_test/neutral &