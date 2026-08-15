FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm config set fetch-timeout 600000 \
    && npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm ci

COPY . .

RUN npm run build

# Production image
FROM node:20-bookworm-slim
WORKDIR /app
COPY --from=0 /app/node_modules ./node_modules
COPY --from=0 /app/dist ./dist
COPY --from=0 /app/package.json ./package.json
COPY --from=0 /app/package-lock.json ./package-lock.json

EXPOSE 5173

ENV HOST=0.0.0.0
ENV PORT=5173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]