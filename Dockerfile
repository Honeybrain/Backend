# Étape de build
FROM node:18.16.0 AS builder

WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

FROM node:18.16.0-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install --production

EXPOSE 3000

CMD ["node", "dist/main"]
