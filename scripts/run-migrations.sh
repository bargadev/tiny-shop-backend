#!/bin/sh

echo "Aguardando o banco de dados..."
while ! nc -z postgres 5432; do
  sleep 1
done

echo "Banco de dados está pronto!"

echo "Executando migrations..."
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d src/database/data-source.ts

echo "Migrations executadas com sucesso!"
