# Use Node.js as the base image
FROM node:18 AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./

# Install dependencies and ensure esbuild is correctly installed
RUN npm install --omit=dev \
  npm install @rollup/rollup-linux-x64-gnu && \
  npm rebuild esbuild --update-binary

# Copy remaining files
COPY . .

# Reinstall esbuild one more time to fix version conflicts
RUN npm rebuild esbuild --update-binary

# Build the frontend
RUN npm run build

# Use Nginx to serve the built files
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/dist ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
