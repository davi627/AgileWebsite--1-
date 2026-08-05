# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
RUN apk add --no-cache python3 make g++ wget
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/web/package.json packages/web/
COPY packages/apis/package.json packages/apis/
RUN pnpm install --frozen-lockfile

FROM deps AS builder
COPY packages/web packages/web
COPY packages/apis packages/apis

ARG VITE_API_BASE_URL=http://localhost:5000
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN pnpm --filter web build

FROM deps AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY packages/apis packages/apis
COPY --from=builder /app/packages/web/build packages/web/build
COPY packages/web/public/web.config packages/web/build/web.config

RUN mkdir -p packages/apis/public/uploads

WORKDIR /app/packages/apis

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5000/health || exit 1

CMD ["node", "index.js"]
