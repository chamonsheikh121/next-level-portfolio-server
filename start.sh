#!/bin/sh

# Run migrations (uses prisma.config.ts for schema location)
echo "Running database migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting application..."
node dist/main
