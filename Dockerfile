FROM node:18.16.0

RUN mkdir -p /app
WORKDIR /app
COPY . /app/

RUN npm install

EXPOSE 8000

CMD ["node", "./index.js"]