#!/bin/sh

echo "🚀 Iniciando Tiny Shop Backend - Setup Completo"
echo "================================================"

# Parar containers existentes
echo "📦 Parando containers existentes..."
docker-compose down

# Subir apenas o PostgreSQL
echo "🐘 Subindo PostgreSQL..."
docker-compose up postgres -d

# Aguardar o banco estar pronto
echo "⏳ Aguardando banco de dados..."
while ! nc -z localhost 5432; do
  sleep 1
done

echo "✅ Banco de dados está pronto!"

# Executar migrações
echo "🔄 Executando migrações..."
npm run migration:run

# Verificar se as migrações foram executadas
if [ $? -eq 0 ]; then
  echo "✅ Migrações executadas com sucesso!"
else
  echo "❌ Erro ao executar migrações!"
  exit 1
fi

# Iniciar aplicação
echo "🚀 Iniciando aplicação..."
npm run start:dev
