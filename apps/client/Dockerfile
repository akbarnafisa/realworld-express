FROM node:16

WORKDIR /app/client

COPY package*.json ./

RUN npm i

COPY . .

CMD [ "npm", "run", "dev", "--host" ]