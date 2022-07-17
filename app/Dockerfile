FROM node:16.13.1 as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY . ./
RUN yarn run build:web

# Stage 2 - the production environment
FROM nginx:1.12-alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]