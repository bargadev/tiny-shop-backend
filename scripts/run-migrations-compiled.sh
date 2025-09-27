#!/bin/sh

echo "Aguardando o banco de dados..."
while ! nc -z postgres 5432; do
  sleep 1
done

echo "Banco de dados está pronto!"

echo "Compilando migrations..."
npm run build

echo "Executando migrations..."
npx typeorm migration:run -d dist/database/data-source.js

echo "Migrations executadas com sucesso!"

echo "Iniciando aplicação..."
npm run start:dev
