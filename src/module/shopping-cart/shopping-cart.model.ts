export interface ShoppingCart {
  id: number;
  cart_id: string;
  customer_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ShoppingCartItem {
  id: number;
  cart_id: string;
  item_id: string;
  quantity: number;
  price: number;
  added_at: Date;
}
