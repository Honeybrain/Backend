FROM node:18.16.0

WORKDIR /app

COPY . .

RUN yarn install

EXPOSE 50051

CMD ["yarn", "start"]