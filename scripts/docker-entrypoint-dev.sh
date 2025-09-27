#!/bin/sh

# Aguardar o banco de dados estar pronto
echo "Aguardando o banco de dados..."
while ! nc -z postgres 5432; do
  sleep 1
done

echo "Banco de dados está pronto!"

# Executar migrations usando ts-node (para desenvolvimento)
echo "Executando migrations..."
npx typeorm-ts-node-commonjs migration:run -d src/database/data-source.ts

# Iniciar a aplicação
echo "Iniciando aplicação..."
exec "$@"
