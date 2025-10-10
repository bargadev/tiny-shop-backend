export interface ShoppingCart {
  id: number;
  cartId: string;
  customerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShoppingCartItem {
  id: number;
  cartId: string;
  itemId: string;
  quantity: number;
  price: number;
  addedAt: Date;
}
