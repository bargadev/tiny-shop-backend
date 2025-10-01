#!/bin/bash

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h postgres -p 5432 -U postgres; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is ready!"

# Run migrations
echo "Running migrations..."
npm run migration:run

# Run seeds
echo "Running seeds..."
PGPASSWORD=postgres psql -h postgres -U postgres -d tiny_shop -f src/database/seeds/01-initial-users.sql
PGPASSWORD=postgres psql -h postgres -U postgres -d tiny_shop -f src/database/seeds/02-initial-customers.sql
PGPASSWORD=postgres psql -h postgres -U postgres -d tiny_shop -f src/database/seeds/03-initial-addresses.sql
PGPASSWORD=postgres psql -h postgres -U postgres -d tiny_shop -f src/database/seeds/04-initial-items.sql

echo "Database initialization complete!"
