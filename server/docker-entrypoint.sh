#!/bin/sh
set -e

# Ensure database schema exists (project has no migrations, uses db push)
npx prisma db push --skip-generate

# Start the Fastify server
node dist/index.js