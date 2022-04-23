import os

# if os.environ.get('OS','') == 'Windows_NT':

directus_projects = [
    '/Users/macpro/Desktop/computer-science/projects/crypto-market/backoffice',
]

# directus_projects = [
#     "/Applications/XAMPP/xamppfiles/htdocs/laboutiik/monimmo-backoffice",
#     "/Users/macpro/Desktop/computer-science/projects/crypto-market/backoffice",
#     "/Users/macpro/Desktop/computer-science/projects/juridis-ci/backoffice",
# ]


extensions_type = ["displays", "interfaces"]
for directus_projet in directus_projects:

    for extension_type in extensions_type:
        extensions = os.listdir(os.path.join("extensions", extension_type))
        os.system(
            "sudo rm -r {0}/extensions/{1}".format(directus_projet, extension_type))
        os.system(
            "sudo mkdir {0}/extensions/{1}".format(directus_projet, extension_type))

        for extension in extensions:
            extension_data_list = os.listdir(os.path.join(
                "extensions", extension_type, extension))
            for extension_data in extension_data_list:
                if extension_data != "node_modules":
                    # print(extension_data)
                    current_path = os.path.join(
                        "extensions", extension_type, extension, extension_data)
                    destination_path = os.path.join(
                        directus_projet, "extensions", extension_type, extension, extension_data)
                    os.system(
                        "sudo cp -r {0} {1}".format(current_path, destination_path))
