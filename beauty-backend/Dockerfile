# Path: beauty-backend/Dockerfile
FROM node:20-alpine

# نصب وابستگی‌های مورد نیاز برای better-sqlite3
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 10000

CMD ["node", "dist/server.js"]