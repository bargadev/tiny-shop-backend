import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ulid } from 'ulid';
import { DatabaseService } from '../../database/database.service';
import { CreateOrderDto } from './order.dto';
import { Order, OrderWithDetails } from './order.model';

const TABLE = '"order"';

@Injectable()
export class OrderService {
  constructor(private databaseService: DatabaseService) {}

  async findAll(): Promise<Order[]> {
    return this.databaseService.query(
      `SELECT * FROM ${TABLE} ORDER BY "createdAt" DESC`,
    );
  }

  async findOne(orderId: string): Promise<Order | null> {
    const orders = await this.databaseService.query(
      `SELECT * FROM ${TABLE} WHERE "orderId" = $1`,
      [orderId],
    );
    return orders.length > 0 ? orders[0] : null;
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    return this.databaseService.query(
      `SELECT * FROM ${TABLE} WHERE "customerId" = $1 ORDER BY "createdAt" DESC`,
      [customerId],
    );
  }

  async findByCartId(cartId: string): Promise<Order | null> {
    const orders = await this.databaseService.query(
      `SELECT * FROM ${TABLE} WHERE "cartId" = $1`,
      [cartId],
    );
    return orders.length > 0 ? orders[0] : null;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const newOrderUlid = ulid();

    // Validate cart exists and has items
    const cart = await this.databaseService.query(
      'SELECT * FROM shopping_cart WHERE "cartId" = $1',
      [createOrderDto.cartId],
    );

    if (cart.length === 0) {
      throw new NotFoundException(
        `Shopping cart with ID ${createOrderDto.cartId} not found`,
      );
    }

    // Check if order already exists for this cart
    const existingOrder = await this.findByCartId(createOrderDto.cartId);
    if (existingOrder) {
      throw new BadRequestException(
        `Order already exists for cart ${createOrderDto.cartId}`,
      );
    }

    // Get cart items and calculate total
    const cartItems = await this.databaseService.query(
      `SELECT sci."itemId", sci.quantity, sci.price, (sci.quantity * sci.price) as subtotal
       FROM shopping_cart_item sci
       WHERE sci."cartId" = $1`,
      [createOrderDto.cartId],
    );

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty. Cannot create order.');
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.subtotal),
      0,
    );

    // Validate customer exists
    const customer = await this.databaseService.query(
      'SELECT * FROM customer WHERE "customerId" = $1',
      [createOrderDto.customerId],
    );

    if (customer.length === 0) {
      throw new NotFoundException(
        `Customer with ID ${createOrderDto.customerId} not found`,
      );
    }

    // Validate address exists and belongs to customer
    const address = await this.databaseService.query(
      'SELECT * FROM address WHERE "addressId" = $1 AND "customerId" = $2',
      [createOrderDto.addressId, createOrderDto.customerId],
    );

    if (address.length === 0) {
      throw new NotFoundException(
        `Address with ID ${createOrderDto.addressId} not found or does not belong to customer`,
      );
    }

    // Validate payment method if provided
    if (createOrderDto.paymentMethodId) {
      const paymentMethod = await this.databaseService.query(
        'SELECT * FROM payment_method WHERE id = $1 AND "isActive" = true',
        [createOrderDto.paymentMethodId],
      );

      if (paymentMethod.length === 0) {
        throw new NotFoundException(
          `Payment method with ID ${createOrderDto.paymentMethodId} not found or is not active`,
        );
      }
    }

    // Create order
    const insertOrderQuery = `
      INSERT INTO ${TABLE} (
        "orderId", "cartId", "customerId", "addressId", 
        "totalAmount", "paymentMethodId", status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    await this.databaseService.query(insertOrderQuery, [
      newOrderUlid,
      createOrderDto.cartId,
      createOrderDto.customerId,
      createOrderDto.addressId,
      totalAmount.toFixed(2),
      createOrderDto.paymentMethodId || null,
      'pending',
    ]);

    return this.findOne(newOrderUlid);
  }

  async updateStatus(
    orderId: string,
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'canceled',
  ): Promise<Order> {
    const order = await this.findOne(orderId);

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    await this.databaseService.query(
      `UPDATE ${TABLE} SET status = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE "orderId" = $2`,
      [status, orderId],
    );

    return this.findOne(orderId);
  }

  async getOrderWithDetails(orderId: string): Promise<OrderWithDetails | null> {
    const order = await this.findOne(orderId);

    if (!order) {
      return null;
    }

    // Get order items from the cart
    const itemsQuery = `
      SELECT 
        sci."itemId",
        i.name as "itemName",
        sci.quantity,
        sci.price,
        (sci.quantity * sci.price) as subtotal
      FROM shopping_cart_item sci
      JOIN item i ON sci."itemId" = i."itemId"
      WHERE sci."cartId" = $1
      ORDER BY sci."addedAt" ASC
    `;

    const items = await this.databaseService.query(itemsQuery, [order.cartId]);

    return {
      ...order,
      items: items.map((item) => ({
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: item.quantity,
        price: parseFloat(item.price),
        subtotal: parseFloat(item.subtotal),
      })),
    };
  }

  async cancelOrder(orderId: string): Promise<Order> {
    return this.updateStatus(orderId, 'canceled');
  }
}
