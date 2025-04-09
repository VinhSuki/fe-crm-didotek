# Sử dụng Node.js làm base image
FROM node:18-alpine AS builder

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json (hoặc yarn.lock nếu dùng Yarn)
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng React với Vite
RUN npm run build

# Sử dụng image nginx để phục vụ ứng dụng
FROM nginx:alpine

# Sao chép các file build từ bước builder vào thư mục nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy file cấu hình nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Mở cổng 80 để truy cập ứng dụng
EXPOSE 80

# Khởi động nginx
CMD ["nginx", "-g", "daemon off;"]