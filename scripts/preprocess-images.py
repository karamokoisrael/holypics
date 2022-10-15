
import os
import sys
from utility import remove_duplicates, remove_small_files, rename_all_files, delete_unreadable_images, create_csv_history
txt_files_path = "../nsfw-content-moderation-data/raw_data"
dataset_path = "../data/datasets/nsfw-content-moderation/images"
csv_data_path = "../data/datasets/nsfw-content-moderation/data.csv"
if __name__ == "__main__":
    download_data = {
        "classes": sys.argv[1].split(","),
        "remove_duplicates": True if len(sys.argv) < 3 else bool(sys.argv[2]),
        "remove_small_files": True if len(sys.argv) < 4 else bool(sys.argv[3]),
        "rename_all_files": False if len(sys.argv) < 5 else bool(sys.argv[4]),
        "delete_unreadable_images": True if len(sys.argv) < 6 else bool(sys.argv[5])
    }
    os.system("sudo rm -r {}".format(os.path.join(dataset_path, ".DS_Store")))
    data_dirs = os.listdir(dataset_path) if download_data["classes"][0] != "*" else download_data["classes"]
    for path in data_dirs:
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
    create_csv_history(csv_data_path, dataset_path)
