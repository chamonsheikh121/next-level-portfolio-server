FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm and openssl (required for Prisma)
RUN apk add --no-cache openssl
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

# Enable build scripts for Prisma and install
RUN pnpm install --frozen-lockfile --ignore-scripts=false

COPY . .

# Generate Prisma Client (with dummy DATABASE_URL for build)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npx prisma generate

RUN pnpm build

FROM node:20-alpine AS production

WORKDIR /app

# Install pnpm and openssl (required for Prisma)
RUN apk add --no-cache openssl
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

# Install ALL dependencies (including dev) for Prisma migrations support
RUN pnpm install --frozen-lockfile --ignore-scripts=false

# Copy built app and generated Prisma client from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma/generated ./prisma/generated

# Copy Prisma migration files and config
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/start.sh ./

RUN chmod +x start.sh

EXPOSE 3000

# Run migrations and start the app
CMD ["./start.sh"]
