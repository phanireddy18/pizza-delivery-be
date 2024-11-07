FROM keymetrics/pm2:18-alpine
LABEL maintainer="redblocks.solutions"

COPY ./build /app
COPY ./.env /app/.env
COPY ./package.json /app/package.json
COPY ./pm2/ecosystem.config.js /app/ecosystem.config.js
RUN mkdir -p /app/logs


WORKDIR /app
RUN npm install

