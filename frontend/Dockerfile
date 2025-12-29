# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# Install deps first (better cache)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
# If you use Angular 18 default builder, this works:
RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:1.27-alpine

# Nginx SPA config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files (adjust if your dist path differs)
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
