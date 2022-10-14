
import os
import sys
from utility import remove_duplicates, remove_small_files, rename_all_files, delete_unreadable_images
txt_files_path = "../nsfw-content-moderation-data/raw_data"
dataset_path = "../data/datasets/nsfw-content-moderation/tmp"
if __name__ == "__main__":
    download_data = {
        "classes": sys.argv[1].split(","),
        "remove_duplicates": True if len(sys.argv) < 3 else bool(sys.argv[2]),
        "remove_small_files": True if len(sys.argv) < 4 else bool(sys.argv[3]),
        "rename_all_files": False if len(sys.argv) < 5 else bool(sys.argv[4]),
        "delete_unreadable_images": True if len(sys.argv) < 6 else bool(sys.argv[5])
    }
    for path in download_data["classes"]:
        try:
            data_path = os.path.join(txt_files_path, path)
            store_path = os.path.join(dataset_path, path)

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
