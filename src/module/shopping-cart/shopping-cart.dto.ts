import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';
import { IsUlid } from '../../validators';

export class CreateShoppingCartDto {
  @IsOptional()
  @IsUlid()
  customerId?: string;
}

export class CheckoutCartDto {
  @IsUlid()
  addressId: string;

  @IsNumber()
  @IsOptional()
  paymentMethodId?: number;
}

export class AddItemToCartDto {
  @IsUlid()
  itemId: string;

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
  cartId: string;
  itemId: string;
  quantity: number;
  price: number;
  addedAt: Date;
  itemName: string;
  itemDescription: string;
  itemSku: string;
  itemCategory: string;
  subtotal: number;
}

export interface CartWithItemsAndTotal {
  cartId: string;
  customerId?: string;
  createdAt: Date;
  updatedAt: Date;
  items: CartItemWithDetails[];
  totalAmount: number;
  totalItems: number;
}
