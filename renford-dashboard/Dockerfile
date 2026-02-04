# Build stage
FROM node:20-alpine AS builder

ENV NODE_OPTIONS=--max_old_space_size=4024

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 80

CMD ["npm", "run", "start", "--", "-H", "0.0.0.0", "-p", "80"]
