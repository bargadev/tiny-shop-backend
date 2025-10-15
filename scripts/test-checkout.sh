#!/bin/bash

# Script para testar o fluxo completo de checkout
# Certifique-se de que a aplicação está rodando em http://localhost:3000

echo "=========================================="
echo "  Teste de Fluxo Completo de Checkout"
echo "=========================================="

# Configurações - IDs do seed (02-init-customer-table.sql, 03-init-address-table.sql, 04-init-item-table.sql)
# Customer: João Silva
CUSTOMER_ID="01JQZ8K9M2N3P4Q5R6S7T8W9V0"
# Item: Mouse Logitech MX Master 3 - R$ 549,90
ITEM_ID="01JQZ9K1M2N3P4Q5R6S7T8W9V1"
# Address: Rua das Flores, 123 - Centro, São Paulo/SP (endereço principal do João Silva)
ADDRESS_ID="01JQZAA1M2N3P4Q5R6S7T8W9V0"
# Payment Method: 1 (primeiro método de pagamento ativo)
PAYMENT_METHOD_ID=1

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Criar carrinho
echo -e "\n${BLUE}[1/5]${NC} ${GREEN}Criando carrinho...${NC}"
CART_RESPONSE=$(curl -s -X POST http://localhost:3000/shopping-cart \
  -H "Content-Type: application/json" \
  -d "{
    \"customerId\": \"$CUSTOMER_ID\"
  }")

echo "$CART_RESPONSE" | jq '.'

# Extrair cartId da resposta
CART_ID=$(echo "$CART_RESPONSE" | jq -r '.cartId')

if [ "$CART_ID" == "null" ] || [ -z "$CART_ID" ]; then
  echo -e "${YELLOW}⚠️  Erro ao criar carrinho. Verifique se o customerId existe.${NC}"
  exit 1
fi

echo -e "${GREEN}✓${NC} Cart ID: ${YELLOW}$CART_ID${NC}"

# 2. Adicionar item ao carrinho
echo -e "\n${BLUE}[2/5]${NC} ${GREEN}Adicionando item ao carrinho...${NC}"
ITEM_RESPONSE=$(curl -s -X POST http://localhost:3000/shopping-cart/$CART_ID/items \
  -H "Content-Type: application/json" \
  -d "{
    \"itemId\": \"$ITEM_ID\",
    \"quantity\": 2,
    \"price\": 50.00
  }")

echo "$ITEM_RESPONSE" | jq '.'

# Verificar se o item foi adicionado
ITEM_ID_RESPONSE=$(echo "$ITEM_RESPONSE" | jq -r '.itemId')
if [ "$ITEM_ID_RESPONSE" == "null" ] || [ -z "$ITEM_ID_RESPONSE" ]; then
  echo -e "${YELLOW}⚠️  Erro ao adicionar item. Verifique se o itemId existe.${NC}"
  exit 1
fi

echo -e "${GREEN}✓${NC} Item adicionado com sucesso"

# 3. Adicionar mais um item diferente (opcional)
echo -e "\n${BLUE}[3/5]${NC} ${GREEN}Adicionando segundo item ao carrinho...${NC}"
# Teclado Mecânico Keychron K2 - R$ 899,00
curl -s -X POST http://localhost:3000/shopping-cart/$CART_ID/items \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": "01JQZ9K1M2N3P4Q5R6S7T8W9V2",
    "quantity": 1,
    "price": 899.00
  }' | jq '.'

# 4. Verificar carrinho
echo -e "\n${BLUE}[4/5]${NC} ${GREEN}Verificando carrinho com itens...${NC}"
CART_DETAILS=$(curl -s -X GET http://localhost:3000/shopping-cart/$CART_ID)
echo "$CART_DETAILS" | jq '.'

TOTAL_AMOUNT=$(echo "$CART_DETAILS" | jq -r '.totalAmount')
TOTAL_ITEMS=$(echo "$CART_DETAILS" | jq -r '.totalItems')

echo -e "${GREEN}✓${NC} Total de itens: ${YELLOW}$TOTAL_ITEMS${NC}"
echo -e "${GREEN}✓${NC} Valor total: ${YELLOW}R$ $TOTAL_AMOUNT${NC}"

# 5. Fazer checkout
echo -e "\n${BLUE}[5/5]${NC} ${GREEN}Fazendo checkout...${NC}"
ORDER_RESPONSE=$(curl -s -X POST http://localhost:3000/shopping-cart/$CART_ID/checkout \
  -H "Content-Type: application/json" \
  -d "{
    \"addressId\": \"$ADDRESS_ID\",
    \"paymentMethodId\": $PAYMENT_METHOD_ID
  }")

echo "$ORDER_RESPONSE" | jq '.'

# Extrair orderId
ORDER_ID=$(echo "$ORDER_RESPONSE" | jq -r '.orderId')

if [ "$ORDER_ID" == "null" ] || [ -z "$ORDER_ID" ]; then
  echo -e "${YELLOW}⚠️  Erro ao fazer checkout. Verifique se o addressId existe e pertence ao customer.${NC}"
  echo -e "${YELLOW}Resposta completa:${NC}"
  echo "$ORDER_RESPONSE" | jq '.'
  exit 1
fi

echo -e "${GREEN}✓${NC} Order ID: ${YELLOW}$ORDER_ID${NC}"

# 6. Verificar detalhes do pedido
echo -e "\n${GREEN}Verificando detalhes do pedido criado...${NC}"
curl -s -X GET http://localhost:3000/orders/$ORDER_ID/details | jq '.'

echo -e "\n=========================================="
echo -e "${GREEN}✓ Teste concluído com sucesso!${NC}"
echo -e "=========================================="
echo -e "Cart ID: ${YELLOW}$CART_ID${NC}"
echo -e "Order ID: ${YELLOW}$ORDER_ID${NC}"
echo -e "Total: ${YELLOW}R$ $TOTAL_AMOUNT${NC}"
echo "=========================================="

