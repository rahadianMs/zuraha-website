# Dockerfile
# Base image for building
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the project and build
COPY . .
RUN npm run build

# Production image
FROM nginx:alpine

# Copy built assets to Nginx serving directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default Nginx config with ours
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
