export interface Order {
  id: number;
  orderId: string;
  cartId: string;
  customerId: string;
  addressId: string;
  totalAmount: number;
  status: string;
  paymentMethodId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderWithDetails extends Order {
  items?: OrderItem[];
}

export interface OrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
  subtotal: number;
}
