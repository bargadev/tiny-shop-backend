#!/bin/bash

# Script auxiliar para obter IDs reais do banco de dados
# Use este script para obter os IDs corretos antes de executar test-checkout.sh

echo "=========================================="
echo "  Obtendo IDs do Banco de Dados"
echo "=========================================="

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Base URL
BASE_URL="http://localhost:3000"

echo -e "\n${BLUE}[1/4]${NC} ${GREEN}Buscando Customers...${NC}"
CUSTOMERS=$(curl -s $BASE_URL/customers)
CUSTOMER_ID=$(echo "$CUSTOMERS" | jq -r '.[0].customerId // empty')

if [ -z "$CUSTOMER_ID" ]; then
  echo -e "${YELLOW}⚠️  Nenhum customer encontrado${NC}"
else
  echo -e "${GREEN}✓${NC} Customer ID: ${YELLOW}$CUSTOMER_ID${NC}"
  CUSTOMER_NAME=$(echo "$CUSTOMERS" | jq -r '.[0].firstName + " " + .[0].lastName')
  echo "  Nome: $CUSTOMER_NAME"
fi

echo -e "\n${BLUE}[2/4]${NC} ${GREEN}Buscando Addresses...${NC}"
ADDRESSES=$(curl -s $BASE_URL/addresses)
ADDRESS_ID=$(echo "$ADDRESSES" | jq -r '.[0].addressId // empty')

if [ -z "$ADDRESS_ID" ]; then
  echo -e "${YELLOW}⚠️  Nenhum address encontrado${NC}"
else
  echo -e "${GREEN}✓${NC} Address ID: ${YELLOW}$ADDRESS_ID${NC}"
  ADDRESS_STREET=$(echo "$ADDRESSES" | jq -r '.[0].street')
  ADDRESS_CUSTOMER=$(echo "$ADDRESSES" | jq -r '.[0].customerId')
  echo "  Endereço: $ADDRESS_STREET"
  echo "  Customer deste endereço: $ADDRESS_CUSTOMER"
fi

echo -e "\n${BLUE}[3/4]${NC} ${GREEN}Buscando Items...${NC}"
ITEMS=$(curl -s $BASE_URL/items)
ITEM_ID=$(echo "$ITEMS" | jq -r '.[0].itemId // empty')

if [ -z "$ITEM_ID" ]; then
  echo -e "${YELLOW}⚠️  Nenhum item encontrado${NC}"
else
  echo -e "${GREEN}✓${NC} Item ID: ${YELLOW}$ITEM_ID${NC}"
  ITEM_NAME=$(echo "$ITEMS" | jq -r '.[0].name')
  ITEM_PRICE=$(echo "$ITEMS" | jq -r '.[0].price')
  echo "  Nome: $ITEM_NAME"
  echo "  Preço: R$ $ITEM_PRICE"
fi

echo -e "\n${BLUE}[4/4]${NC} ${GREEN}Buscando Payment Methods...${NC}"
PAYMENT_METHODS=$(curl -s $BASE_URL/payment-methods)
PAYMENT_METHOD_ID=$(echo "$PAYMENT_METHODS" | jq -r '.[0].id // empty')

if [ -z "$PAYMENT_METHOD_ID" ]; then
  echo -e "${YELLOW}⚠️  Nenhum payment method encontrado${NC}"
else
  echo -e "${GREEN}✓${NC} Payment Method ID: ${YELLOW}$PAYMENT_METHOD_ID${NC}"
  PAYMENT_NAME=$(echo "$PAYMENT_METHODS" | jq -r '.[0].name')
  echo "  Nome: $PAYMENT_NAME"
fi

echo -e "\n=========================================="
echo -e "${GREEN}Configuração para test-checkout.sh:${NC}"
echo "=========================================="

if [ -n "$CUSTOMER_ID" ] && [ -n "$ADDRESS_ID" ] && [ -n "$ITEM_ID" ] && [ -n "$PAYMENT_METHOD_ID" ]; then
  echo -e "CUSTOMER_ID=\"${YELLOW}$CUSTOMER_ID${NC}\""
  echo -e "ITEM_ID=\"${YELLOW}$ITEM_ID${NC}\""
  echo -e "ADDRESS_ID=\"${YELLOW}$ADDRESS_ID${NC}\""
  echo -e "PAYMENT_METHOD_ID=${YELLOW}$PAYMENT_METHOD_ID${NC}"
  
  echo -e "\n${GREEN}✓ Todos os IDs necessários foram encontrados!${NC}"
  echo -e "\nEdite o arquivo ${YELLOW}scripts/test-checkout.sh${NC} e atualize as variáveis com os valores acima."
else
  echo -e "\n${YELLOW}⚠️  Alguns IDs não foram encontrados.${NC}"
  echo "Execute o seed do banco de dados primeiro:"
  echo "  npm run db:seed"
fi

echo "=========================================="

