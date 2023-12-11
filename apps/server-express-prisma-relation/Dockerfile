FROM node:18

WORKDIR /app/server

COPY package*.json ./

RUN npm i

COPY . .

CMD [ "npm", "run", "dev"]