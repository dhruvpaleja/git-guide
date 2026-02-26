# ===========================================================================
# Frontend
# ===========================================================================

# Stage 1: Install frontend dependencies
FROM node:20-alpine AS frontend-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY --from=frontend-deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Serve frontend with nginx
FROM nginx:stable-alpine AS frontend
COPY --from=frontend-build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# ===========================================================================
# Backend
# ===========================================================================

FROM node:20-alpine AS backend
WORKDIR /app
COPY server/package.json server/package-lock.json ./
RUN npm ci
COPY server/ .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/index.js"]

