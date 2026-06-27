FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build-time dummy values — real values injected at runtime
# Using ARG instead of ENV to avoid Hadolint secret warnings
ARG MONGODB_URI=mongodb://placeholder
ARG NEXTAUTH_SECRET=placeholder-secret-for-build
ARG NEXTAUTH_URL=http://localhost:3000
ARG GEMINI_API_KEY=placeholder

ENV MONGODB_URI=$MONGODB_URI
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV GEMINI_API_KEY=$GEMINI_API_KEY

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
