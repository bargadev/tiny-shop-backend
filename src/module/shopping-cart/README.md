# Shopping Cart Module

This module provides endpoints for managing shopping carts and cart items.

## Endpoints

### Shopping Cart Management

- `POST /shopping-cart` - Create a new shopping cart

### Shopping Cart Items Management

- `POST /shopping-cart/:cartId/items` - Add an item to a cart
- `PUT /shopping-cart/:cartId/items/:itemId` - Update item quantity in a cart
- `DELETE /shopping-cart/:cartId/items/:itemId` - Remove an item from a cart

## Request/Response Examples

### Create Shopping Cart

```json
POST /shopping-cart
{
  "customer_id": "optional-customer-id"
}
```

### Add Item to Cart

```json
POST /shopping-cart/{cartId}/items
{
  "item_id": "item-ulid",
  "quantity": 2,
  "price": 29.99
}
```

### Update Item Quantity

```json
PUT /shopping-cart/{cartId}/items/{itemId}
{
  "quantity": 3
}
```
