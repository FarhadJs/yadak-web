# ---------- ساخت Nuxt ----------
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .

# آدرس داخلی API در شبکه داکر (برای پروکسی /api و نقشه سایت)
ARG API_INTERNAL_URL=http://api:4000
ARG SITE_URL=http://localhost:3000
ENV API_INTERNAL_URL=$API_INTERNAL_URL
ENV SITE_URL=$SITE_URL
ENV NODE_ENV=production

RUN npm run build

# ---------- اجرا ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
