
import os
import sys
from utility import download_collection_from_unsplash, remove_duplicates, remove_small_files, rename_all_files, delete_unreadable_images
dataset_path = "../data/datasets/nsfw-content-moderation/tmp"
if __name__ == "__main__":
    download_data = {
        "classes": sys.argv[1].split(","),
        "clean": False,
        "remove_duplicates": True,
        "remove_small_files": True,
        "rename_all_files": False,
        "delete_unreadable_images": True,
        "count_set": 0 if len(sys.argv) < 4 else int(sys.argv[3]),
        "limit_point": 2000 if len(sys.argv) < 3 else int(sys.argv[2]),
    }

    for path in download_data["classes"]:
        query = path
        path = path.replace(" ", "_")
        try:
            store_path = os.path.join(dataset_path, path)
            os.system("mkdir {}".format(store_path))
            if download_data["clean"]:
                os.system("rm -r {}/*".format(store_path))
                pass
            download_collection_from_unsplash(query, store_path)

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
