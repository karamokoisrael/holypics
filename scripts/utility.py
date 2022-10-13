import hashlib
import os
from pathlib import Path
import random
from urllib import request
from urllib.request import urlopen
import uuid
from PIL import Image


def hashFile(filename):
    # For large files, if we read it all together it can lead to memory overflow, So we take a blocksize to read at a time
    BLOCKSIZE = 65536
    hasher = hashlib.md5()
    with open(filename, 'rb') as file:
        # Reads the particular blocksize from file
        buf = file.read(BLOCKSIZE)
        while (len(buf) > 0):
            hasher.update(buf)
            buf = file.read(BLOCKSIZE)
    return hasher.hexdigest()


def clean_up_data_dir(data_dir):
    data_sub_directories = os.listdir(data_dir)
    for data_sub_directory in data_sub_directories:
        path_to_delete = os.path.join(data_dir, data_sub_directory, ".*")
        os.system("rm -r {}".format(path_to_delete))
    os.system("rm -r {}/.ipynb_checkpoints".format(data_dir))
    os.system("rm -r {}/.DS_Store".format(data_dir))


def download_images(destination, source_file="*.txt", limit_point=-1, count_set=0):
    total = len(open(Path(source_file)).readlines())
    image_input_file = open(source_file, "r")
    count = count_set
    image_input_file = [
        image_input_fileS for image_input_fileS in image_input_file]
    ids = str(uuid.uuid1())
    image_url_list = []
    if limit_point != -1 and len(image_input_file) > limit_point:
        image_url_list = image_input_file[count_set:limit_point]

    for url in image_url_list:
        count += 1
        try:
            currentId = str(uuid.uuid1())
            file = destination+"/"+ids+currentId+".jpg"
            response = urlopen(url, timeout=3)
            with open(file, 'wb') as f:
                f.write(response.read())
            f.close()

            print(
                "{0} / {1} success => {2} path => {3}".format(count, total, url, file))

        except Exception as wrong:
            print("{0} / {1} req failure => {2} : {3}".format(count, total, url, wrong))
            pass


def remove_duplicates(dir, include_src=False):
    hashMap = {}
    # List to store deleted files
    deletedFiles = []
    source_dup_file = []
    filelist = os.listdir(dir)
    for f in filelist:
        f = os.path.join(dir, f)
        key = hashFile(f)
        # If key already exists, it deletes the file
        if key in hashMap.keys():
            deletedFiles.append(f)
            if include_src:
                try:
                    index = source_dup_file.index(key)
                except Exception as e:
                    source_dup_file.append(key)
            os.remove(f)
        else:
            hashMap[key] = f
    if include_src:
        for key in source_dup_file:
            deletedFiles.append(f)
            os.remove(hashMap[key])

    if len(deletedFiles) != 0:
        for deleted_file in deletedFiles:
            print('Deleted Files {0}'.format(deleted_file))
        print("total deleted => {}".format(len(deletedFiles)))
    else:
        print('No duplicate files found')


def remove_small_files(dir, min_size=5):
    for root, _, files in os.walk(dir):
        for f in files:
            fullpath = os.path.join(root, f)
            try:
                if os.path.getsize(fullpath) < min_size * 1024:  # set file size in kb
                    print(fullpath)
                    os.remove(fullpath)
            except Exception as e:
                print("Error" + fullpath)


def rename_all_files(dir, prefix=""):
    for root, _, files in os.walk(dir):
        for f in files:
            fullpath = os.path.join(root, f)
            try:
                filename, file_extension = os.path.splitext(fullpath)
                newname = prefix+str(uuid.uuid1())+"."+file_extension
                os.rename(fullpath, os.path.join(dir, newname))

            except Exception as e:
                print(e)
                print("Error" + fullpath)


def delete_unreadable_images(dir):
    for root, _, files in os.walk(dir):
        for f in files:
            fullpath = os.path.join(root, f)
            try:
                img = Image.open(fullpath)
            except Exception as e:
                os.system("rm {}".format(fullpath))
                print("Removing => " + fullpath)


def remove_randomly_dir_files(dir, limit=2, percentage=0):
    files = os.listdir(dir)

    if (percentage != 0):
        limit = int((percentage * len(files)) / 100)

    print("Total files found : {}".format(len(files)))
    deleted_indexes = [-1]
    count = 0
    if limit >= len(files):
        print("limit >= len(files)")
        return

    for i in range(0, limit):
        if len(deleted_indexes) > limit:
            print("len(deleted_index) > limit")
            break

        random_index = -1

        while (random_index in deleted_indexes) == True:
            random_index = random.randint(0, len(files)-1)

        deleted_indexes.append(random_index)
        count += 1

        print("deleting {0}/{1}; index => {2}".format(i +
              1, limit, random_index))
        os.remove(os.path.join(dir, files[random_index]))

    print("Total deleted files {}".format(count))
    print("Total files remaining {}".format(len(os.listdir(dir))))
