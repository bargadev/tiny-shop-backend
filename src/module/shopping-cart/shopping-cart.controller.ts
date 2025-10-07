import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import {
  AddItemToCartDto,
  CreateShoppingCartDto,
  UpdateItemQuantityDto,
} from './shopping-cart.dto';
import { ShoppingCart, ShoppingCartItem } from './shopping-cart.model';
import { ShoppingCartService } from './shopping-cart.service';

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @Post()
  async create(
    @Body() createShoppingCartDto: CreateShoppingCartDto,
  ): Promise<ShoppingCart> {
    return this.shoppingCartService.create(createShoppingCartDto);
  }

  @Post(':cartId/items')
  async addItemToCart(
    @Param('cartId') cartId: string,
    @Body() addItemToCartDto: AddItemToCartDto,
  ): Promise<ShoppingCartItem> {
    return this.shoppingCartService.addItemToCart(
      cartId,
      addItemToCartDto.item_id,
      addItemToCartDto.quantity,
      addItemToCartDto.price,
    );
  }

  @Put(':cartId/items/:itemId')
  async updateItemQuantity(
    @Param('cartId') cartId: string,
    @Param('itemId') itemId: string,
    @Body() updateItemQuantityDto: UpdateItemQuantityDto,
  ): Promise<ShoppingCartItem> {
    return this.shoppingCartService.updateItemQuantity(
      cartId,
      itemId,
      updateItemQuantityDto.quantity,
    );
  }

  @Delete(':cartId/items/:itemId')
  async removeItemFromCart(
    @Param('cartId') cartId: string,
    @Param('itemId') itemId: string,
  ): Promise<void> {
    return this.shoppingCartService.removeItemFromCart(cartId, itemId);
  }
}
