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
PGPASSWORD=postgres psql -h postgres -U postgres -d tiny_shop -f src/database/seed/01-init-user-table.sql
PGPASSWORD=postgres psql -h postgres -U postgres -d tiny_shop -f src/database/seed/02-init-customer-table.sql
PGPASSWORD=postgres psql -h postgres -U postgres -d tiny_shop -f src/database/seed/03-init-address-table.sql
PGPASSWORD=postgres psql -h postgres -U postgres -d tiny_shop -f src/database/seed/04-init-item-table.sql
PGPASSWORD=postgres psql -h postgres -U postgres -d tiny_shop -f src/database/seed/05-init-shopping-cart-table.sql
PGPASSWORD=postgres psql -h postgres -U postgres -d tiny_shop -f src/database/seed/06-init-shopping-cart-item-table.sql
PGPASSWORD=postgres psql -h postgres -U postgres -d tiny_shop -f src/database/seed/07-init-order-table.sql
PGPASSWORD=postgres psql -h postgres -U postgres -d tiny_shop -f src/database/seed/08-init-payment-method-table.sql 

echo "Database initialization complete!"
