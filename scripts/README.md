# Scripts de Teste

Este diretório contém scripts para facilitar o teste da API.

## 📋 Scripts Disponíveis

### 1. `get-ids.sh` - Obter IDs do Banco

Script auxiliar que busca IDs reais do banco de dados para usar nos testes.

**Como usar:**

```bash
# Certifique-se de que a aplicação está rodando
npm run start:dev

# Em outro terminal, execute:
./scripts/get-ids.sh
```

**O que ele faz:**

- Busca o primeiro customer cadastrado
- Busca o primeiro address cadastrado
- Busca o primeiro item do estoque
- Busca o primeiro método de pagamento ativo
- Exibe as variáveis prontas para copiar no `test-checkout.sh`

**Requisitos:**

- A aplicação deve estar rodando em `http://localhost:3000`
- O comando `jq` deve estar instalado (para formatar JSON)
- Você deve ter executado o seed do banco antes: `npm run db:seed`

---

### 2. `test-checkout.sh` - Teste Completo de Checkout

Script que executa o fluxo completo de checkout, desde a criação do carrinho até a geração do pedido.

**Como usar:**

```bash
# 1. Primeiro, obtenha os IDs reais do banco
./scripts/get-ids.sh

# 2. Edite o arquivo test-checkout.sh e atualize as variáveis no topo:
#    - CUSTOMER_ID
#    - ITEM_ID
#    - ADDRESS_ID
#    - PAYMENT_METHOD_ID

# 3. Execute o script
./scripts/test-checkout.sh
```

**O que ele faz:**

1. ✅ Cria um carrinho para o customer
2. ✅ Adiciona itens ao carrinho
3. ✅ Adiciona mais um item (demonstração)
4. ✅ Verifica o carrinho com totais
5. ✅ Faz o checkout (cria o pedido)
6. ✅ Busca os detalhes do pedido criado

**Saída esperada:**

```
==========================================
  Teste de Fluxo Completo de Checkout
==========================================

[1/5] Criando carrinho...
✓ Cart ID: 01JQZABC123DEF456GHI789JKL

[2/5] Adicionando item ao carrinho...
✓ Item adicionado com sucesso

[3/5] Adicionando segundo item ao carrinho...

[4/5] Verificando carrinho com itens...
✓ Total de itens: 3
✓ Valor total: R$ 150.00

[5/5] Fazendo checkout...
✓ Order ID: 01JQZDEF789GHI012JKL345MNO

Verificando detalhes do pedido criado...

==========================================
✓ Teste concluído com sucesso!
==========================================
Cart ID: 01JQZABC123DEF456GHI789JKL
Order ID: 01JQZDEF789GHI012JKL345MNO
Total: R$ 150.00
==========================================
```

**Requisitos:**

- A aplicação deve estar rodando em `http://localhost:3000`
- O comando `jq` deve estar instalado
- Os IDs configurados no script devem existir no banco
- O `addressId` deve pertencer ao `customerId` configurado

---

## 🔧 Instalando o `jq`

O `jq` é uma ferramenta para processar JSON na linha de comando.

### macOS

```bash
brew install jq
```

### Linux (Ubuntu/Debian)

```bash
sudo apt-get install jq
```

### Linux (CentOS/RHEL)

```bash
sudo yum install jq
```

---

## 🚀 Fluxo Rápido

```bash
# 1. Inicie a aplicação
npm run start:dev

# 2. Em outro terminal, execute o seed (se ainda não fez)
npm run db:seed

# 3. Obtenha os IDs
./scripts/get-ids.sh

# 4. Edite o test-checkout.sh com os IDs obtidos
nano scripts/test-checkout.sh
# ou
code scripts/test-checkout.sh

# 5. Execute o teste
./scripts/test-checkout.sh
```

---

## 📝 Exemplos de Curl Manual

Se preferir testar manualmente sem os scripts:

### Criar carrinho

```bash
curl -X POST http://localhost:3000/shopping-cart \
  -H "Content-Type: application/json" \
  -d '{"customerId": "SEU_CUSTOMER_ID"}'
```

### Adicionar item

```bash
curl -X POST http://localhost:3000/shopping-cart/SEU_CART_ID/items \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": "SEU_ITEM_ID",
    "quantity": 2,
    "price": 50.00
  }'
```

### Fazer checkout

```bash
curl -X POST http://localhost:3000/shopping-cart/SEU_CART_ID/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "addressId": "SEU_ADDRESS_ID",
    "paymentMethodId": 1
  }'
```

### Buscar pedido

```bash
curl http://localhost:3000/orders/SEU_ORDER_ID/details | jq '.'
```

---

## 🐛 Troubleshooting

### Erro: "command not found: jq"

- Instale o `jq` seguindo as instruções acima

### Erro: "Connection refused"

- Verifique se a aplicação está rodando: `npm run start:dev`
- Verifique se está na porta correta (3000 por padrão)

### Erro: "Customer not found" ou "Address not found"

- Execute o seed do banco: `npm run db:seed`
- Use o script `get-ids.sh` para obter IDs válidos

### Erro: "Address does not belong to customer"

- Verifique se o `addressId` pertence ao `customerId` configurado
- Use o script `get-ids.sh` para garantir que os IDs estão corretos

### Erro: "Cart is empty"

- Certifique-se de adicionar itens ao carrinho antes de fazer checkout
- Verifique se o `itemId` está correto e o item existe no banco
