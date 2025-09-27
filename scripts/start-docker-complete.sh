#!/bin/sh

echo "🚀 Iniciando Tiny Shop Backend - Setup Docker Completo"
echo "======================================================"

# Parar containers existentes
echo "📦 Parando containers existentes..."
docker-compose down

# Subir tudo com o profile complete (PostgreSQL + App com migrações)
echo "🐳 Subindo aplicação completa em Docker..."
docker-compose --profile complete up

echo "🎉 Aplicação rodando completamente em Docker!"
