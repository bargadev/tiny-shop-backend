#!/bin/sh

# Aguardar o banco de dados estar pronto
echo "Aguardando o banco de dados..."
while ! nc -z postgres 5432; do
  sleep 1
done

echo "Banco de dados está pronto!"

# Compilar TypeScript (apenas em desenvolvimento)
if [ "$NODE_ENV" != "production" ]; then
  echo "Compilando TypeScript..."
  npm run build
fi

# Executar migrations
echo "Executando migrations..."
npm run migration:run

# Iniciar a aplicação
echo "Iniciando aplicação..."
exec "$@"
