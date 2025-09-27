# Tiny Shop Backend

Backend API para o sistema Tiny Shop, construído com NestJS, PostgreSQL e Docker.

## 🚀 Tecnologias

- **NestJS** - Framework Node.js para aplicações server-side
- **PostgreSQL** - Banco de dados relacional
- **TypeORM** - ORM para TypeScript e JavaScript
- **Docker** - Containerização da aplicação
- **Docker Compose** - Orquestração de containers

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- Docker
- Docker Compose

## 🛠️ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <repository-url>
cd tiny-shop-backend
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=tiny_shop
NODE_ENV=development
PORT=3000
```

## 🐳 Executando com Docker

### Desenvolvimento
```bash
# Inicia apenas o banco de dados
docker-compose up postgres

# Inicia a aplicação em modo desenvolvimento (com hot reload)
docker-compose --profile dev up app-dev
```

### Produção
```bash
# Inicia todos os serviços
docker-compose up -d
```

### Parar os serviços
```bash
docker-compose down
```

## 🚀 Executando Localmente

### 1. Inicie o banco de dados
```bash
docker-compose up postgres -d
```

### 2. Execute a aplicação
```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## 📚 Endpoints da API

### Health Check
- `GET /` - Página inicial
- `GET /health` - Status da aplicação

### Users
- `GET /users` - Lista todos os usuários
- `GET /users/:id` - Busca usuário por ID
- `POST /users` - Cria novo usuário
- `PUT /users/:id` - Atualiza usuário
- `DELETE /users/:id` - Remove usuário

### Exemplo de criação de usuário
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "João Silva", "email": "joao@example.com"}'
```

## 🗄️ Banco de Dados

O banco de dados PostgreSQL é configurado automaticamente com:
- Database: `tiny_shop`
- Usuário: `postgres`
- Senha: `postgres`
- Porta: `5432`

### Estrutura da tabela users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## 📝 Scripts Disponíveis

- `npm run start` - Inicia a aplicação
- `npm run start:dev` - Inicia em modo desenvolvimento
- `npm run start:debug` - Inicia em modo debug
- `npm run start:prod` - Inicia em modo produção
- `npm run build` - Compila a aplicação
- `npm run test` - Executa testes unitários
- `npm run test:e2e` - Executa testes e2e
- `npm run test:cov` - Executa testes com cobertura
- `npm run lint` - Executa linter
- `npm run format` - Formata código

## 🔧 Configuração do Docker

### Dockerfile
- Multi-stage build para otimização
- Usuário não-root para segurança
- Health check configurado
- Cache de dependências

### Docker Compose
- Serviço PostgreSQL
- Serviço da aplicação
- Rede isolada
- Volumes persistentes
- Perfil de desenvolvimento

## 📁 Estrutura do Projeto

```
src/
├── entities/          # Entidades do banco de dados
├── users/            # Módulo de usuários
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── app.controller.ts
├── app.service.ts
├── app.module.ts
└── main.ts
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
