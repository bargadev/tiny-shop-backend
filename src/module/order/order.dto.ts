import { IsNumber, IsOptional, IsString } from 'class-validator';
import { IsUlid } from '../../validators';

export class CreateOrderDto {
  @IsUlid()
  cartId: string;

  @IsUlid()
  customerId: string;

  @IsUlid()
  addressId: string;

  @IsNumber()
  @IsOptional()
  paymentMethodId?: number;
}

export class CheckoutDto {
  @IsUlid()
  addressId: string;

  @IsNumber()
  @IsOptional()
  paymentMethodId?: number;
}

export class UpdateOrderStatusDto {
  @IsString()
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'canceled';
}
