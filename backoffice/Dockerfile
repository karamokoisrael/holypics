FROM node:16.13.1
WORKDIR /app
COPY package.json package-lock.json /app/
EXPOSE 8055

ENV NODE_ENV=production
# RUN npm install 
RUN npm cache clean --force
RUN npm fund
RUN npm audit fix --force
RUN npm i --package-lock-only
RUN npm audit fix --force

RUN chmod -R 755 /app
CMD ["npm", "start"]