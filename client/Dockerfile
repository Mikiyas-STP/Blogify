# ---------- Build stage ----------
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Build argument for API URL
# - Local: defaults to localhost
# - Production: overridden in Coolify build variables
ARG VITE_API_URL=http://localhost:5001
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN npm run build

# Verify build output exists
RUN ls -la /app/dist || (echo "Build failed - dist folder not found" && exit 1)

# ---------- Production stage ----------
FROM nginx:alpine

# Copy Nginx configuration
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


#for local use :- docker build -t blogify-frontend .
#docker run -p 3000:80 blogify-frontend
