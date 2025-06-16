# Sử dụng hình ảnh Node.js chính thức
FROM node:18-alpine

# Thiết lập thư mục làm việc bên trong container
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies with cache mount
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy source code
COPY . .

# Expose port mà server sử dụng
EXPOSE 4000

# Lệnh để chạy server
CMD ["npm", "run", "start:docker"]
