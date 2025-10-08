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
      `SELECT * FROM ${TABLE} WHERE cart_id = $1`,
      [cartId],
    );

    return carts.length > 0 ? carts[0] : null;
  }

  async create(createCartDto: { customer_id?: string }): Promise<ShoppingCart> {
    const newCartUlid = ulid();

    const insertCartQuery = `
      INSERT INTO ${TABLE} (cart_id, customer_id)
      VALUES ($1, $2)
    `;

    await this.databaseService.query(insertCartQuery, [
      newCartUlid,
      createCartDto.customer_id || null,
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
      'SELECT * FROM shopping_cart_item WHERE cart_id = $1 AND item_id = $2',
      [cartId, itemId],
    );

    if (existingItems.length > 0) {
      // Update quantity if item already exists
      const newQuantity = existingItems[0].quantity + quantity;
      await this.databaseService.query(
        'UPDATE shopping_cart_item SET quantity = $1 WHERE cart_id = $2 AND item_id = $3',
        [newQuantity, cartId, itemId],
      );
      return this.databaseService
        .query(
          'SELECT * FROM shopping_cart_item WHERE cart_id = $1 AND item_id = $2',
          [cartId, itemId],
        )
        .then((result) => result[0]);
    } else {
      // Add new item to cart
      const insertItemQuery = `
        INSERT INTO shopping_cart_item (cart_id, item_id, quantity, price)
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
          'SELECT * FROM shopping_cart_item WHERE cart_id = $1 AND item_id = $2',
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
        'DELETE FROM shopping_cart_item WHERE cart_id = $1 AND item_id = $2',
        [cartId, itemId],
      );
      return null;
    }

    await this.databaseService.query(
      'UPDATE shopping_cart_item SET quantity = $1 WHERE cart_id = $2 AND item_id = $3',
      [quantity, cartId, itemId],
    );

    return this.databaseService
      .query(
        'SELECT * FROM shopping_cart_item WHERE cart_id = $1 AND item_id = $2',
        [cartId, itemId],
      )
      .then((result) => result[0]);
  }

  async removeItemFromCart(cartId: string, itemId: string): Promise<void> {
    await this.databaseService.query(
      'DELETE FROM shopping_cart_item WHERE cart_id = $1 AND item_id = $2',
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
        sci.id,
        sci.cart_id,
        sci.item_id,
        sci.quantity,
        sci.price,
        sci.added_at,
        i.name as item_name,
        i.description as item_description,
        i.sku as item_sku,
        i.category as item_category,
        (sci.quantity * sci.price) as subtotal
      FROM shopping_cart_item sci
      JOIN item i ON sci.item_id = i.item_id
      WHERE sci.cart_id = $1
      ORDER BY sci.added_at ASC
    `;

    const items = await this.databaseService.query(itemsQuery, [cartId]);

    console.log(items);

    // Calculate totals
    const totalAmount = items.reduce(
      (sum, item) => sum + parseFloat(item.subtotal),
      0,
    );
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      cart_id: cart.cart_id,
      customer_id: cart.customer_id,
      created_at: cart.created_at,
      updated_at: cart.updated_at,
      items: items as CartItemWithDetails[],
      total_amount: parseFloat(totalAmount.toFixed(2)),
      total_items: totalItems,
    };
  }
}
