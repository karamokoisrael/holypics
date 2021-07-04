import uuid
import requests
import pathlib
import os
from PIL import Image
import hashlib

def process(file):
    class_dir = "images_reinforce_test/"+file.split('/')[2] + "/"
    
    try:
        img = Image.open(file) # open the image file
        img.verify() # verify that it is, in fact an image
        #width, height = img.size

        #if width < 300 or height < 300:
            #raise Exception("not a good image, maybe a logo")
            
        print("verified")
    except Exception as wrong: 
        print(Exception)
        os.system("rm -r "+file)
        print("deleted")
        
data_directory = pathlib.Path("images_reinforce_test")

folders = [directory for directory in data_directory.iterdir() if directory.is_dir()]



for i, direc in enumerate(folders):
    #remove_duplicates(str(direc))
    files = os.listdir(direc)
    count = 1
    for file in files:
        file_src = str(direc)+"/"+file
        
        
        print(count, "/", len(files), " processing =>", file_src)
        if not ".jpg" in file and not ".jpeg" in file:
            print("no jpg. Deleting")
            os.system("rm -r "+file_src)
        else:
            process(file_src) 
        count+=1   
        
    os.system("image-cleaner "+str(direc))