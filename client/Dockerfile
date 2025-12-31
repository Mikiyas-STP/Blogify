# =========================
# Build stage
# =========================
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build-time env (Vite)
ARG VITE_API_URL=http://localhost:5001
ENV VITE_API_URL=$VITE_API_URL

# Build frontend
RUN npm run build

# Verify build output
RUN test -d dist || (echo "❌ dist folder not found" && exit 1)

# =========================
# Production stage
# =========================
FROM nginx:alpine

# Copy Nginx config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built frontend
COPY --from=build /app/dist /usr/share/nginx/html

# Expose HTTP
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
