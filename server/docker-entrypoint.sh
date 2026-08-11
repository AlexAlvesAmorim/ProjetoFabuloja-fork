#!/bin/bash
# Database initialization script for Docker container
# Runs migrations and seeds the database

set -e

echo "🔄 Waiting for PostgreSQL to be ready..."
until pg_isready -h postgres -U postgres -d fabuloja; do
  sleep 2
done

echo "✅ PostgreSQL is ready"

echo "🔄 Generating Prisma Client..."
npx prisma generate

echo "🔄 Running migrations..."
npx prisma migrate deploy

echo "🔄 Seeding database..."
npx prisma db seed

echo "✅ Database initialization complete"