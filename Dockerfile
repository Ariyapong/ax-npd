FROM node:16-alpine AS base
ENV NODE_ENV=production
# Add a work directory
WORKDIR /app

# Cache and Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --production=false

FROM node:16-alpine AS builder
WORKDIR /app

# Copy app files
COPY . .
# Build the app
COPY --from=base /app/node_modules ./node_modules
RUN VITE_STATUS_PROJECT=staging yarn build

FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/vite.config.ts ./vite.config.ts
COPY --from=builder /app/server ./server

# Installs latest Chromium (100) package.
RUN apk add --no-cache \
    chromium \
    chromium-chromedriver \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

USER pptruser

EXPOSE 3000

ENTRYPOINT node --experimental-specifier-resolution=node ./server/index.js --host 0.0.0.0 --port 3000
