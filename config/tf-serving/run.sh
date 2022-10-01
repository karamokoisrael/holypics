sudo docker build --no-cache -t tf_serving .
sudo docker run -p 8501:8501 tf_serving