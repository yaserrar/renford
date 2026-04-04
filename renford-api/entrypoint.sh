#!/bin/sh

set -e

    
echo "Prisma migrate..."
dotenv -e .env -- npx prisma migrate deploy

echo "Prisma generate..."
dotenv -e .env -- npx prisma generate

echo "Build..."
npm run build

echo "App is running..."
npm run start
