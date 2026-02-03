FROM node:20-alpine3.16

ENV NODE_OPTIONS=--max_old_space_size=4024

WORKDIR /

COPY package.json ./
RUN npm install

COPY . .

RUN npm install -g dotenv-cli

ENTRYPOINT ["sh", "/entrypoint.sh"]
