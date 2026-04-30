# ========================================
# Stage 1: Build the React Application
# ========================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the app for production
RUN npm run build

# ========================================
# Stage 2: Serve with Nginx
# ========================================
FROM nginx:alpine

# Copy the build output from the previous stage to Nginx's default public dir
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (Nginx default)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
