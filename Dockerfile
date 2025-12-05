# --- STAGE 1: Build ---
# 使用一个包含 Node.js 的官方镜像作为构建环境
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json (或 yarn.lock, pnpm-lock.yaml)
COPY package.json ./
# 如果您使用 pnpm 或 yarn，请取消下面一行的注释并替换
# COPY pnpm-lock.yaml ./

# 安装依赖
# 如果您使用 pnpm 或 yarn，请将 npm install 替换为 pnpm install 或 yarn install
RUN npm install

# 复制所有剩余的源代码
COPY . .

# 构建生产版本的应用
RUN npm run build

# --- STAGE 2: Production ---
# 使用一个轻量级的 Nginx 镜像作为生产环境
FROM nginx:1.25-alpine

# 从构建阶段复制构建好的静态文件到 Nginx 的 web 根目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制自定义的 Nginx 配置文件
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]