FROM node:17

WORKDIR /app

COPY package*.json ./

RUN yarn install --production

COPY . .

CMD ["yarn", "run", "start"]