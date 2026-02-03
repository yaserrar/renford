#!/bin/sh

echo "Prisma generate..."
npx prisma generate --schema=./schema.prisma

echo "Prisma is runing..."
npx prisma studio --schema=./schema.prisma -p 5000