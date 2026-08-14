# Path: backend/Dockerfile
FROM node:18-alpine

# نصب وابستگی‌های مورد نیاز برای build better-sqlite3
RUN apk add --no-cache python3 make g++

# تنظیم کار دایرکتوری
WORKDIR /app

# کپی package.json و package-lock.json
COPY package*.json ./

# نصب وابستگی‌ها
RUN npm install --legacy-peer-deps

# کپی بقیه فایل‌ها
COPY . .

# Build پروژه
RUN npm run build

# پورت
EXPOSE 10000

# اجرای برنامه
CMD ["npm", "start"]