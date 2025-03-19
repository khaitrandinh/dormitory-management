# Sử dụng Node.js image chính thức
FROM node:20-alpine

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy package.json để cài đặt dependencies
COPY package*.json ./

# Cài đặt dependencies (giảm thời gian build bằng cách giữ cache)
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Mở port 3000
EXPOSE 3000