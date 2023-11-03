FROM node:16

WORKDIR /app/server

COPY package*.json ./

RUN npm i

COPY . .

CMD [ "npm", "run", "dev"]