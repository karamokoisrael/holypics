# Pull latest image of tensorflow serving
FROM tensorflow/serving:latest

# COPY FILES
COPY . /

# gRPC
EXPOSE 8500

# REST
EXPOSE 8501

# ENTRYPOINT
ENTRYPOINT ["/usr/bin/tf_serving_entrypoint.sh"]

# CMD
CMD ["--model_name=nsfw_content_moderator", "--model_base_path=/tf_serving", "--model_config_file=/models/models.config"]