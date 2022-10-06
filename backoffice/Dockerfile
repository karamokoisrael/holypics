FROM node:latest
WORKDIR /app
COPY package.json package-lock.json /app/
EXPOSE 8055

ENV NODE_ENV=production
RUN npm install 

RUN chmod -R 755 /app
CMD ["npm", "start"]