
import os
import sys
from utility import download_images, remove_duplicates, remove_small_files, rename_all_files, delete_unreadable_images
txt_files_path = "../nsfw-content-moderation-data/raw_data"
dataset_path = "../data/datasets/nsfw-content-moderation"
if __name__ == "__main__":
    download_data = {
        "classes": sys.argv[1].split(","),
        "clean": False,
        "remove_duplicates": True,
        "remove_small_files": True,
        "rename_all_files": False,
        "delete_unreadable_images": True,
        "count_set": 0 if len(sys.argv) < 4 else int(sys.argv[3]),
        "limit_point": 2000 if len(sys.argv) < 3 else int(sys.argv[2]) 
    }

    for path in download_data["classes"]:
        try:
            data_path = os.path.join(txt_files_path, path)
            store_path = os.path.join(dataset_path, path)
            os.system("mkdir {}".format(store_path))
            if download_data["clean"]:
                os.system("rm -r {}/*".format(store_path))
                pass
            files = [f for f in os.listdir(data_path) if os.path.isfile(
                os.path.join(data_path, f))]
            download_images(store_path, source_file=os.path.join(
                data_path, files[0]), count_set=download_data["count_set"], limit_point=download_data["limit_point"])

            if download_data["delete_unreadable_images"]:
                delete_unreadable_images(store_path)
            if download_data["remove_duplicates"]:
                remove_duplicates(store_path)
            if download_data["remove_small_files"]:
                remove_small_files(store_path)
            if download_data["rename_all_files"]:
                rename_all_files(store_path)

        except Exception as wrong:
            print(wrong)
