# Dockerfile (multi-stage - recomendado)
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Etapa de build — instala todas as deps (dev + prod) e roda build
FROM base AS builder
COPY package*.json ./
# Se você tem package-lock.json, copie também: COPY package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa final (runner) — somente runtime (instala apenas production)
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# criar usuário não-root por segurança
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copiar artefatos de build
# Se seu build gerar .next/standalone/server.js, isso será usado; senão copiaremos .next
COPY --from=builder /app/public ./public
# Tenta copiar standalone se existir
COPY --from=builder /app/.next/standalone ./.next/standalone || true
# Copia o diretório .next como fallback
COPY --from=builder /app/.next ./.next

# Copia package.json e instala apenas deps de produção
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Ajusta permissões para usuário nextjs e usa usuário não-root
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000
ENV PORT=3000
CMD ["npm", "run", "start"]