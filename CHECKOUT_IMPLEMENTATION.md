# Implementação do Endpoint de Checkout

## Resumo

Foi implementado o sistema completo de checkout que permite criar pedidos a partir de carrinhos de compras.

## Arquivos Criados

### Módulo Order

1. **src/module/order/order.model.ts**
   - Define as interfaces `Order`, `OrderWithDetails` e `OrderItem`

2. **src/module/order/order.dto.ts**
   - Define os DTOs: `CreateOrderDto`, `CheckoutDto` e `UpdateOrderStatusDto`
   - Inclui validações com decorators do class-validator

3. **src/module/order/order.service.ts**
   - Serviço com toda a lógica de negócio para gerenciar pedidos
   - Métodos: `findAll`, `findOne`, `findByCustomerId`, `findByCartId`, `create`, `updateStatus`, `getOrderWithDetails`, `cancelOrder`
   - Validações completas antes de criar pedidos

4. **src/module/order/order.controller.ts**
   - Controlador com todos os endpoints REST para gerenciar pedidos
   - Rotas: GET /orders, GET /orders/:orderId, GET /orders/:orderId/details, GET /orders/customer/:customerId, POST /orders, PATCH /orders/:orderId/status, PUT /orders/:orderId/cancel

5. **src/module/order/order.module.ts**
   - Módulo NestJS que configura o Order module

6. **src/module/order/README.md**
   - Documentação completa com exemplos de uso de todos os endpoints

## Arquivos Modificados

### Shopping Cart

1. **src/module/shopping-cart/shopping-cart.dto.ts**
   - Adicionado `CheckoutCartDto` com validações

2. **src/module/shopping-cart/shopping-cart.service.ts**
   - Adicionado método `checkout()` que:
     - Valida se o carrinho existe
     - Valida se o carrinho tem um cliente associado
     - Valida se o carrinho não está vazio
     - Valida se o endereço pertence ao cliente
     - Valida se o método de pagamento está ativo (se fornecido)
     - Verifica se já não existe um pedido para este carrinho
     - Calcula o valor total automaticamente
     - Cria o pedido no banco de dados

3. **src/module/shopping-cart/shopping-cart.controller.ts**
   - Adicionado endpoint `POST /shopping-cart/:cartId/checkout`
   - Corrigido bug: `item_id` para `itemId` no método `addItemToCart`

### Aplicação Principal

1. **src/app.module.ts**
   - Adicionado `OrderModule` aos imports

## Endpoints Implementados

### Checkout (Método Recomendado)

```
POST /shopping-cart/:cartId/checkout
```

**Body:**

```json
{
  "addressId": "01HEQZY5GPQZY5GPQZY5GPQZY5",
  "paymentMethodId": 1
}
```

**Validações:**

- Carrinho deve existir
- Carrinho deve ter um cliente associado
- Carrinho não pode estar vazio
- Endereço deve pertencer ao cliente
- Método de pagamento deve estar ativo (opcional)
- Não pode já existir um pedido para este carrinho

**Response:**

```json
{
  "id": 1,
  "orderId": "01HEQZY5GPQZY5GPQZY5GPQZY5",
  "cartId": "01HEQZY5GPQZY5GPQZY5GPQZY5",
  "customerId": "01HEQZY5GPQZY5GPQZY5GPQZY5",
  "addressId": "01HEQZY5GPQZY5GPQZY5GPQZY5",
  "totalAmount": "150.00",
  "status": "pending",
  "paymentMethodId": 1,
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

### Outros Endpoints de Order

#### Listar todos os pedidos

```
GET /orders
```

#### Buscar pedido por ID

```
GET /orders/:orderId
```

#### Buscar pedido com detalhes dos itens

```
GET /orders/:orderId/details
```

#### Listar pedidos de um cliente

```
GET /orders/customer/:customerId
```

#### Atualizar status do pedido

```
PATCH /orders/:orderId/status
```

**Body:**

```json
{
  "status": "paid"
}
```

**Status válidos:** `pending`, `paid`, `shipped`, `delivered`, `canceled`

#### Cancelar pedido

```
PUT /orders/:orderId/cancel
```

## Fluxo de Uso Completo

1. **Criar carrinho:**

   ```bash
   POST /shopping-cart
   Body: { "customerId": "01HE..." }
   ```

2. **Adicionar itens:**

   ```bash
   POST /shopping-cart/:cartId/items
   Body: { "itemId": "01HE...", "quantity": 2, "price": 50.00 }
   ```

3. **Verificar carrinho:**

   ```bash
   GET /shopping-cart/:cartId
   ```

4. **Fazer checkout:**

   ```bash
   POST /shopping-cart/:cartId/checkout
   Body: { "addressId": "01HE...", "paymentMethodId": 1 }
   ```

5. **Consultar pedido:**
   ```bash
   GET /orders/:orderId/details
   ```

## Regras de Negócio

1. **Criação de Pedidos:**
   - Um carrinho só pode gerar um único pedido
   - O valor total é calculado automaticamente a partir dos itens do carrinho
   - O pedido inicia sempre com status "pending"

2. **Validações:**
   - Todos os IDs (ULID) são validados com o decorator `@IsUlid()`
   - O endereço deve pertencer ao cliente do carrinho
   - O método de pagamento deve estar ativo
   - O carrinho deve conter pelo menos um item

3. **Status do Pedido:**
   - `pending`: Pedido criado, aguardando pagamento
   - `paid`: Pagamento confirmado
   - `shipped`: Pedido enviado
   - `delivered`: Pedido entregue
   - `canceled`: Pedido cancelado

## Estrutura do Banco de Dados

A tabela `order` já existe no banco de dados (criada pela migration `1759669876001-CreateOrderTable.ts`) com a seguinte estrutura:

```sql
CREATE TABLE "order" (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(50) UNIQUE NOT NULL,
  cart_id VARCHAR(50) NOT NULL UNIQUE,
  customer_id VARCHAR(50) NOT NULL,
  address_id VARCHAR(50) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  payment_method_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Testes

**Nota:** Os arquivos de teste (\*.spec.ts) existentes precisam ser atualizados para usar a nomenclatura camelCase ao invés de snake_case. Isso é uma tarefa separada que pode ser feita posteriormente.

## Próximos Passos Sugeridos

1. Atualizar todos os arquivos de teste para usar camelCase
2. Adicionar testes para o novo módulo Order
3. Adicionar validação de estoque ao criar pedido (verificar se há quantidade disponível)
4. Implementar webhook ou notificação quando um pedido é criado
5. Adicionar histórico de mudanças de status do pedido
6. Implementar cancelamento de pedido com devolução de estoque
