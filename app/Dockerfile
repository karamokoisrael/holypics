
FROM nginx:1.12-alpine
WORKDIR /usr/src/app
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./website /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]