model_name="holypics";
sudo rm -r shared
sudo mkdir models
sudo cp -r model.config models/
sudo rm -r models/$model_name
sudo mkdir models/$model_name
#sudo rm -r models/model/$1
#sudo mkdir models/model/$1
sudo unzip shared.zip 
sudo mv shared.zip shared/shared.zip
sudo cp -r shared/models/$model_name models/
sudo docker stop holypics
sudo docker rm holypics
sudo docker-compose up
