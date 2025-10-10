import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';
import { DatabaseService } from '../../database/database.service';
import {
  CartItemWithDetails,
  CartWithItemsAndTotal,
} from './shopping-cart.dto';
import { ShoppingCart, ShoppingCartItem } from './shopping-cart.model';

const TABLE = 'shopping_cart';

@Injectable()
export class ShoppingCartService {
  constructor(private databaseService: DatabaseService) {}

  async findByCartId(cartId: string): Promise<ShoppingCart | null> {
    const carts = await this.databaseService.query(
      `SELECT * FROM ${TABLE} WHERE "cartId" = $1`,
      [cartId],
    );

    return carts.length > 0 ? carts[0] : null;
  }

  async create(createCartDto: { customerId?: string }): Promise<ShoppingCart> {
    const newCartUlid = ulid();

    const insertCartQuery = `
      INSERT INTO ${TABLE} ("cartId", "customerId")
      VALUES ($1, $2)
    `;

    await this.databaseService.query(insertCartQuery, [
      newCartUlid,
      createCartDto.customerId || null,
    ]);

    return this.findByCartId(newCartUlid);
  }

  async addItemToCart(
    cartId: string,
    itemId: string,
    quantity: number,
    price: number,
  ): Promise<ShoppingCartItem> {
    // Check if item already exists in cart
    const existingItems = await this.databaseService.query(
      'SELECT * FROM shopping_cart_item WHERE "cartId" = $1 AND "itemId" = $2',
      [cartId, itemId],
    );

    if (existingItems.length > 0) {
      // Update quantity if item already exists
      const newQuantity = existingItems[0].quantity + quantity;
      await this.databaseService.query(
        'UPDATE shopping_cart_item SET quantity = $1 WHERE "cartId" = $2 AND "itemId" = $3',
        [newQuantity, cartId, itemId],
      );
      return this.databaseService
        .query(
          'SELECT * FROM shopping_cart_item WHERE "cartId" = $1 AND "itemId" = $2',
          [cartId, itemId],
        )
        .then((result) => result[0]);
    } else {
      // Add new item to cart
      const insertItemQuery = `
        INSERT INTO shopping_cart_item ("cartId", "itemId", quantity, price)
        VALUES ($1, $2, $3, $4)
      `;

      await this.databaseService.query(insertItemQuery, [
        cartId,
        itemId,
        quantity,
        price,
      ]);

      return this.databaseService
        .query(
          'SELECT * FROM shopping_cart_item WHERE "cartId" = $1 AND "itemId" = $2',
          [cartId, itemId],
        )
        .then((result) => result[0]);
    }
  }

  async updateItemQuantity(
    cartId: string,
    itemId: string,
    quantity: number,
  ): Promise<ShoppingCartItem> {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await this.databaseService.query(
        'DELETE FROM shopping_cart_item WHERE "cartId" = $1 AND "itemId" = $2',
        [cartId, itemId],
      );
      return null;
    }

    await this.databaseService.query(
      'UPDATE shopping_cart_item SET quantity = $1 WHERE "cartId" = $2 AND "itemId" = $3',
      [quantity, cartId, itemId],
    );

    return this.databaseService
      .query(
        'SELECT * FROM shopping_cart_item WHERE "cartId" = $1 AND "itemId" = $2',
        [cartId, itemId],
      )
      .then((result) => result[0]);
  }

  async removeItemFromCart(cartId: string, itemId: string): Promise<void> {
    await this.databaseService.query(
      'DELETE FROM shopping_cart_item WHERE "cartId" = $1 AND "itemId" = $2',
      [cartId, itemId],
    );
  }

  async getCartWithItemsAndTotal(
    cartId: string,
  ): Promise<CartWithItemsAndTotal | null> {
    // First, get the cart information
    const cart = await this.findByCartId(cartId);
    if (!cart) {
      return null;
    }

    // Get cart items with item details
    const itemsQuery = `
      SELECT 
        sci."itemId",
        sci.quantity,
        sci.price,
        sci."addedAt",
        i.name as "itemName",
        i.description as "itemDescription",
        i.sku as "itemSku",
        i.category as "itemCategory",
        (sci.quantity * sci.price) as subtotal
      FROM shopping_cart_item sci
      JOIN item i ON sci."itemId" = i."itemId"
      WHERE sci."cartId" = $1
      ORDER BY sci."addedAt" ASC
    `;

    const items = await this.databaseService.query(itemsQuery, [cartId]);

    // Calculate totals
    const totalAmount = items.reduce(
      (sum, item) => sum + parseFloat(item.subtotal),
      0,
    );
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      cartId: cart.cartId,
      customerId: cart.customerId,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      items: items as CartItemWithDetails[],
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      totalItems: totalItems,
    };
  }
}
