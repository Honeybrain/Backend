FROM node:14-alpine

WORKDIR /back
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "index.js"]