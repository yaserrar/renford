#!/bin/sh

set -e

echo "Build..."
npm run build

echo "App is running..."
npm run start
