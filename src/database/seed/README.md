# Database Seeds

Este diretório contém arquivos SQL para popular o banco de dados com dados iniciais.

## Como usar

### 🚀 Automático (Recomendado)

Os usuários são criados **automaticamente** quando você inicia o ambiente de desenvolvimento. O processo funciona assim:

1. **Migrations**: Executadas primeiro para criar a estrutura do banco
2. **Seeds**: Executados depois para inserir os dados iniciais

```bash
# Iniciar o ambiente de desenvolvimento
npm run docker:dev:up

# O banco será criado automaticamente com as tabelas e usuários
```

### 🔧 Manual (se necessário)

Se precisar executar manualmente:

```bash
# Executar o script de inicialização completo
docker exec tiny-shop-backend-dev sh sh-script/init-db.sh

# Ou executar apenas os seeds
docker exec tiny-shop-backend-dev sh -c "PGPASSWORD=postgres psql -h postgres -U postgres -d tiny_shop -f src/database/seed/01-init-user-table.sql"

# Verificar se funcionou
curl http://localhost:3000/users
```

## Dados inseridos

### Usuários (`01-init-user-table.sql`)

O arquivo insere 5 usuários de exemplo:

| Nome            | Email                     | Senha    |
| --------------- | ------------------------- | -------- |
| João Silva      | joao.silva@email.com      | 12345678 |
| Maria Santos    | maria.santos@email.com    | 12345678 |
| Pedro Oliveira  | pedro.oliveira@email.com  | 12345678 |
| Ana Costa       | ana.costa@email.com       | 12345678 |
| Carlos Ferreira | carlos.ferreira@email.com | 12345678 |

**Nota**: As senhas estão hasheadas com bcrypt para segurança.

### Clientes (`02-init-customer-table.sql`)

O arquivo insere 5 clientes de exemplo com dados pessoais e de contato.

### Endereços (`03-init-address-table.sql`)

O arquivo insere endereços de exemplo associados aos clientes.

### Items (`04-init-item-table.sql`)

O arquivo insere 8 items de exemplo incluindo notebooks, periféricos, monitores e acessórios para informática.

### Carrinhos de Compras (`05-init-shopping-cart-table.sql`)

O arquivo insere 5 carrinhos de compras, um para cada cliente cadastrado.

### Itens do Carrinho (`06-init-shopping-cart-item-table.sql`)

O arquivo insere itens nos carrinhos de compras, relacionando os produtos com os carrinhos dos clientes. Cada carrinho possui de 3 a 4 itens com diferentes quantidades.

### Pedidos (`07-init-order-table.sql`)

O arquivo insere 3 pedidos de exemplo:

- **João Silva**: Pedido entregue (delivered) - Notebook + Mouse + Teclado
- **Maria Santos**: Pedido enviado (shipped) - 2 Monitores + Webcam
- **Ana Costa**: Pedido pago (paid) - Cadeira Gamer + Notebook + Monitor

Os pedidos estão vinculados aos carrinhos de compras, clientes e endereços de entrega correspondentes.

## 🔄 Resetar o banco (se necessário)

Se precisar resetar completamente o banco e executar os seeds novamente:

```bash
# Parar e remover containers e volumes
npm run docker:dev:clean

# Iniciar novamente (os seeds serão executados automaticamente)
npm run docker:dev:up
```

## Vantagens desta abordagem

- ✅ **Automático**: Executa automaticamente no ambiente de desenvolvimento
- ✅ **Seguro**: Só roda em desenvolvimento, nunca em produção
- ✅ **Ordem correta**: Executa migrations primeiro, depois seeds
- ✅ **Robusto**: Aguarda PostgreSQL estar pronto antes de executar
- ✅ **Simples**: Apenas arquivos SQL + script de inicialização
- ✅ **Versionável**: Controle de versão com Git
- ✅ **Transparente**: Fácil de ver e modificar os dados
- ✅ **Docker-friendly**: Integrado ao docker-compose.dev.yml
