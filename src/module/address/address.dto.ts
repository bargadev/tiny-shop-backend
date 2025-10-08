import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { IsUlid } from '../../validators';

export interface Address {
  id: number;
  customer_id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_primary: boolean;
  created_at: Date;
  updated_at: Date;
}

export class CreateAddressDto {
  @IsUlid()
  customerId: string;

  @IsString()
  street: string;

  @IsString()
  number: string;

  @IsString()
  @IsOptional()
  complement?: string;

  @IsString()
  neighborhood: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postalCode: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}

export class UpdateAddressDto {
  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  number?: string;

  @IsString()
  @IsOptional()
  complement?: string;

  @IsString()
  @IsOptional()
  neighborhood?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}
