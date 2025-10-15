# Order Module

Este módulo gerencia os pedidos criados a partir de carrinhos de compras.

## Endpoints

### POST /orders

Cria um pedido manualmente (geralmente não usado diretamente, use checkout).

**Body:**

```json
{
  "cartId": "01HEQZY5GPQZY5GPQZY5GPQZY5",
  "customerId": "01HEQZY5GPQZY5GPQZY5GPQZY5",
  "addressId": "01HEQZY5GPQZY5GPQZY5GPQZY5",
  "paymentMethodId": 1
}
```

### GET /orders

Lista todos os pedidos.

**Response:**

```json
[
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
]
```

### GET /orders/:orderId

Busca um pedido por ID.

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

### GET /orders/:orderId/details

Busca um pedido com detalhes dos itens.

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
  "updatedAt": "2025-01-15T10:00:00Z",
  "items": [
    {
      "itemId": "01HEQZY5GPQZY5GPQZY5GPQZY5",
      "itemName": "Product Name",
      "quantity": 2,
      "price": 50.0,
      "subtotal": 100.0
    }
  ]
}
```

### GET /orders/customer/:customerId

Lista todos os pedidos de um cliente específico.

**Response:** Array de pedidos (mesmo formato do GET /orders)

### PATCH /orders/:orderId/status

Atualiza o status de um pedido.

**Body:**

```json
{
  "status": "paid"
}
```

**Status válidos:**

- `pending` - Pedido criado, aguardando pagamento
- `paid` - Pagamento confirmado
- `shipped` - Pedido enviado
- `delivered` - Pedido entregue
- `canceled` - Pedido cancelado

**Response:**

```json
{
  "id": 1,
  "orderId": "01HEQZY5GPQZY5GPQZY5GPQZY5",
  "status": "paid",
  ...
}
```

### PUT /orders/:orderId/cancel

Cancela um pedido (atalho para atualizar status para 'canceled').

**Response:**

```json
{
  "id": 1,
  "orderId": "01HEQZY5GPQZY5GPQZY5GPQZY5",
  "status": "canceled",
  ...
}
```

## Checkout via Shopping Cart

A forma recomendada de criar pedidos é através do endpoint de checkout do carrinho:

### POST /shopping-cart/:cartId/checkout

Cria um pedido a partir do carrinho de compras.

**Body:**

```json
{
  "addressId": "01HEQZY5GPQZY5GPQZY5GPQZY5",
  "paymentMethodId": 1
}
```

**Validações:**

- O carrinho deve existir
- O carrinho deve estar associado a um cliente
- O carrinho não pode estar vazio
- O endereço deve pertencer ao cliente do carrinho
- O método de pagamento deve estar ativo (se fornecido)
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

## Fluxo de Checkout Completo

1. **Criar carrinho:**

   ```bash
   POST /shopping-cart
   {
     "customerId": "01HEQZY5GPQZY5GPQZY5GPQZY5"
   }
   ```

2. **Adicionar itens ao carrinho:**

   ```bash
   POST /shopping-cart/:cartId/items
   {
     "itemId": "01HEQZY5GPQZY5GPQZY5GPQZY5",
     "quantity": 2,
     "price": 50.00
   }
   ```

3. **Verificar carrinho:**

   ```bash
   GET /shopping-cart/:cartId
   ```

4. **Fazer checkout:**

   ```bash
   POST /shopping-cart/:cartId/checkout
   {
     "addressId": "01HEQZY5GPQZY5GPQZY5GPQZY5",
     "paymentMethodId": 1
   }
   ```

5. **Verificar pedido criado:**
   ```bash
   GET /orders/:orderId/details
   ```

## Modelo de Dados

### Order

- `id` (number) - ID interno sequencial
- `orderId` (string) - ULID único do pedido
- `cartId` (string) - ULID do carrinho de compras
- `customerId` (string) - ULID do cliente
- `addressId` (string) - ULID do endereço de entrega
- `totalAmount` (decimal) - Valor total do pedido
- `status` (string) - Status do pedido
- `paymentMethodId` (number, opcional) - ID do método de pagamento
- `createdAt` (timestamp) - Data/hora de criação
- `updatedAt` (timestamp) - Data/hora da última atualização

## Observações

- Um carrinho só pode gerar um único pedido
- O valor total do pedido é calculado automaticamente a partir dos itens do carrinho
- Após criar um pedido, o carrinho não pode mais ser alterado
- Os itens do pedido são preservados através da referência ao carrinho
