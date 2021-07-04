import uuid
import requests
import pathlib
import os
from PIL import Image
import hashlib
import sys


def remove_duplicates(class_name):
    print("removing duplicate files from '"+class_name+"'")
    os.system('cd images/ && var=$(duplicates --dups-only '+class_name+')  && rm $(echo $var | sed "s/.jpg/.jpg /g") ')
    
image_class = "*"

if __name__ == "__main__":
    print(sys.argv)
    
    if len(sys.argv)>1:
        image_class = sys.argv[1]
    
    if image_class == "*":
        data_directory = pathlib.Path("images")
        folders = [directory for directory in data_directory.iterdir() if directory.is_dir()]
        for i, direc in enumerate(folders):
            remove_duplicates(str(direc).split('/')[1])
    else:
        remove_duplicates(image_class)