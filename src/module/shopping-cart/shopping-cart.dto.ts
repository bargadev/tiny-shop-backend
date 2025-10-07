export class CreateShoppingCartDto {
  customer_id?: string;
}

export class AddItemToCartDto {
  item_id: string;
  quantity: number;
  price: number;
}

export class UpdateItemQuantityDto {
  quantity: number;
}
