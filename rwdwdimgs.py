import pathlib
import os
base_dir = "OID/Dataset/train"
location = "images/neutral"


if __name__ == "__main__":
    print(sys.argv)
    
    if len(sys.argv)>1:
        base_dir = sys.argv[1]
    if len(sys.argv)>2:
        location = sys.argv[2]
     
    data_directory = pathlib.Path(base_dir)

    folders = [directory for directory in data_directory.iterdir() if directory.is_dir()]

    for i, direc in enumerate(folders):
        os.system("rm -r "+str(direc)+"/Label")
        os.system("mv "+str(direc)+"/* "+location)