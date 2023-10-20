FROM node:18-alpine

WORKDIR /usr/src/api/server

COPY ./server/package*.json ./

RUN npm install

WORKDIR /usr/src/api

COPY . .

WORKDIR /usr/src/api/server

RUN npm run build

CMD [ "node", "dist/main.js" ]
