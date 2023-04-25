ARG NODE_VERSION=18.10.0

FROM node:${NODE_VERSION} AS builder

ARG TARGETPLATFORM

WORKDIR /app
RUN npm i -g pnpm@7.26.1
# ENV NODE_ENV=production
COPY . /app

RUN \
    if [ "$TARGETPLATFORM" = 'linux/arm64' ]; then \
    apk --no-cache add \
    python3 \
    build-base \
    && ln -sf /usr/bin/python3 /usr/bin/python \
    ; fi
RUN pnpm install
RUN pnpm run build
# RUN pnpm prune --prod



# Directus image
FROM node:${NODE_VERSION}

ARG VERSION
ARG REPOSITORY=directus/directus

LABEL directus.version="${VERSION}"

# Default environment variables
# (see https://docs.directus.io/reference/environment-variables/)
ENV \
    EXTENSIONS_PATH="/app/extensions" \
    STORAGE_LOCAL_ROOT="/app/uploads"



# Switch to user 'node' and directory '/directus'
USER node
WORKDIR /app

# disable npm update warnings
RUN echo "update-notifier=false" >> ~/.npmrc
RUN mkdir -p /app/extensions \
    /app/extensions/displays \
    /app/extensions/endpoints \
    /app/extensions/hooks \
    /app/extensions/interfaces \ 
    /app/extensions/modules \ 
    /app/extensions/operations \ 
    /app/extensions/panels ; exit 0

RUN mkdir /app/uploads; exit 0

COPY --from=builder --chown=node:node /app .

RUN chown node:node /app/uploads ; exit 0
RUN chown node:node /app/extensions ; exit 0

EXPOSE 8055
CMD npm start