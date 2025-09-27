#!/bin/sh

echo "Aguardando o banco de dados..."
while ! nc -z postgres 5432; do
  sleep 1
done

echo "Banco de dados está pronto!"

echo "Iniciando aplicação (migrations executadas automaticamente pelo TypeORM)..."
npm run start:dev
