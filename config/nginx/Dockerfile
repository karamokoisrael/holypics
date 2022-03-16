FROM nginx:1.17.8-alpine

# Copy the public directory
COPY ./laboutiik-api/v2/ /app/api

# Copy the nginx config file
COPY ./config/nginx/default.conf /etc/nginx/conf.d/default.conf