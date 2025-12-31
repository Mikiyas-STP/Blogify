# Frontend Dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Build argument for API URL
ARG VITE_API_URL=http://localhost:5001
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN npm run build

# Verify build output exists
RUN ls -la /app/dist || (echo "Build failed - dist folder not found" && exit 1)

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Verify files were copied and show contents
RUN ls -la /usr/share/nginx/html
RUN echo "Contents of /usr/share/nginx/html:" && ls -R /usr/share/nginx/html || true

# Create nginx configuration file
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Proper MIME types for JavaScript modules
    location ~* \.(js|mjs)$ {
        add_header Content-Type application/javascript;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Error logging
    error_log /var/log/nginx/error.log;
    access_log /var/log/nginx/access.log;
}
EOF

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]