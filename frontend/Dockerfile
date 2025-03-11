# Sử dụng Node.js image chính thức
FROM node:18-alpine

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json trước để cache
COPY package*.json ./

# Cài đặt dependencies
RUN npm install 

RUN npm install && npm install axios react-router-dom react-icons react-bootstrap bootstrap

# Copy toàn bộ mã nguồn vào container
COPY . .

# # Build ứng dụng (nếu chạy production)
# RUN npm run build

# Mở port 3000
EXPOSE 3000

# Lệnh chạy ứng dụng
CMD ["npm", "start"]