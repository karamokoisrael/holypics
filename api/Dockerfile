FROM node:16-alpine
WORKDIR /app
COPY package.json package-lock.json /app/
RUN \
    if [ "$TARGETPLATFORM" = 'linux/arm64' ]; then \
    apk --no-cache add \
    python3 \
    build-base \
    && ln -sf /usr/bin/python3 /usr/bin/python \
    ; fi

ENV NODE_ENV=production
RUN npm install 
RUN npm run build

RUN \
    # Upgrade system and install 'ssmtp' to be able to send mails
    apk upgrade --no-cache && apk add --no-cache \
    ssmtp \
    # Add support for specifying the timezone of the container
    # using the "TZ" environment variable.
    tzdata 

# disable npm update warnings
RUN echo "update-notifier=false" >> ~/.npmrc

RUN chmod -R 755 /app
EXPOSE 8055
CMD ["npm", "start"]