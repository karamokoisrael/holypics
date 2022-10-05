FROM node:16.13.1
WORKDIR /app
COPY package.json package-lock.json /app/
EXPOSE 8055

ENV NODE_ENV=production
# RUN npm install && npm cache clean --force
RUN npm i --only=production --no-package-lock

RUN chmod -R 755 /app
CMD ["npm", "start"]