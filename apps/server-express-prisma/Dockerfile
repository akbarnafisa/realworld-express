FROM node:18

WORKDIR /app/server-prisma

COPY package*.json ./

RUN yarn

COPY . .

CMD [ "yarn", "dev"]