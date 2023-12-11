FROM node:18

WORKDIR /app/server-mongodb

COPY package*.json ./

RUN yarn

COPY . .

CMD [ "yarn", "dev"]