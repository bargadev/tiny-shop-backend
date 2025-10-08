import { IsNumber, IsPositive, Min } from 'class-validator';
import { IsUlid } from '../../validators';

export class CreateShoppingCartDto {
  customer_id?: string;
}

export class AddItemToCartDto {
  @IsUlid()
  item_id: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;
}

export class UpdateItemQuantityDto {
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}

export interface CartItemWithDetails {
  id: number;
  cart_id: string;
  item_id: string;
  quantity: number;
  price: number;
  added_at: Date;
  item_name: string;
  item_description: string;
  item_sku: string;
  item_category: string;
  subtotal: number;
}

export interface CartWithItemsAndTotal {
  cart_id: string;
  customer_id?: string;
  created_at: Date;
  updated_at: Date;
  items: CartItemWithDetails[];
  total_amount: number;
  total_items: number;
}
