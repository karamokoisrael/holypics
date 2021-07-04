import uuid
import requests
import pathlib
import os
from PIL import Image
import hashlib
import sys
def process(file):    
    try:
        img = Image.open(file) # open the image file
        img.verify() # verify that it is, in fact an image
        print("verified")
        width, height = img.size
        #if width < 300 or height < 300:
            #raise Exception("not a good image, maybe a logo") 
    except Exception as wrong: 
        print(Exception)
        os.system("rm -r "+file)
        print("deleted")
        
        
data_directory = pathlib.Path("images")

image_class = "drawings"
startPoint = 0

if __name__ == "__main__":
    print(sys.argv)
    
    if len(sys.argv)>1:
        image_class = sys.argv[1]
        
    if len(sys.argv)>2:
        startPoint = sys.argv[2]
    
    
    files = os.listdir("images/"+image_class)
    #remove_duplicates("images/"+image_class)
    count = 1
    
    for file in files:
        file_src = "images/"+image_class+"/"+file
        print(count, "/", len(files), " processing =>", file_src)

        if count < startPoint:
            print("skipped")
        else:    
            if not ".jpg" and not ".jpeg" in file:
                print("no jpg. Deleting")
                os.system("rm -r "+file_src)
            else:
                process(file_src) 
        count+=1
    os.system("images/"+image_class)