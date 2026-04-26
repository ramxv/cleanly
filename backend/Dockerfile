FROM node:22-alpine AS base
RUN corepack enable

FROM base AS builder
RUN apk add --no-cache gcompat
WORKDIR /app
ENV CI=true

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm prisma:generate && \
    pnpm build && \
    pnpm prune --prod

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist /app/dist
COPY --from=builder --chown=nestjs:nodejs /app/package.json /app/package.json
COPY --from=builder --chown=nestjs:nodejs /app/prisma /app/prisma

USER nestjs
EXPOSE 3000

CMD ["sh", "-c", "node -e \"const{execSync}=require('child_process');execSync('npx prisma migrate deploy',{stdio:'inherit'})\" && node dist/main"]
