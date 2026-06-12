FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Pass dummy env vars so Next.js build doesn't crash
# Real values are injected at runtime via docker run -e
ENV MONGODB_URI=mongodb://placeholder
ENV NEXTAUTH_SECRET=placeholder-secret-for-build
ENV NEXTAUTH_URL=http://localhost:3000
ENV GEMINI_API_KEY=placeholder

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENV NODE_ENV=production

USER appuser

EXPOSE 3000

CMD ["node", "server.js"]
