FROM node:20-alpine3.16

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

ENTRYPOINT ["sh", "/app/entrypoint.sh"]