FROM node:18-alpine

WORKDIR /app/server

COPY ./server/package*.json ./

RUN npm ci

WORKDIR /app

COPY . .

WORKDIR /app/server

RUN npm run build

CMD [ "node", "dist/main.js" ]
