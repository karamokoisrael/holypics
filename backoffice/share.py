import os
directus_projects = [
    "/Applications/XAMPP/xamppfiles/htdocs/laboutiik/monimmo-backoffice",
    "/Users/macpro/Desktop/computer-science/projects/crypto-market/backoffice",
    "/Users/macpro/Desktop/computer-science/projects/juridis-ci/backoffice",
]

for directus_projet in directus_projects:
    
    os.system("sudo rm -r {}/extensions/displays".format(directus_projet))
    os.system("sudo rm -r {}/extensions/interfaces".format(directus_projet))
    os.system("cp -r extensions/displays {}/extensions".format(directus_projet))
    os.system("cp -r extensions/interfaces {}/extensions".format(directus_projet))