#!/bin/sh

# Run migrations (uses prisma.config.ts for schema location)
echo "Running database migrations..."
npx prisma migrate deploy

# Start the application with IPv4 DNS preference to fix IPv6 connectivity issues
echo "Starting application with IPv4 DNS preference..."
export NODE_OPTIONS="--dns-result-order=ipv4first"
node --dns-result-order=ipv4first dist/main
