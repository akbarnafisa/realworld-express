FROM node:18

WORKDIR /apps/client

COPY package*.json ./

RUN yarn

COPY . .

CMD [ "yarn", "dev", "--host" ]