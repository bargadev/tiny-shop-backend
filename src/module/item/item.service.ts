import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

export interface Item {
  id: number;
  item_id: string;
  name: string;
  description?: string;
  sku: string;
  price: number;
  quantity_available: number;
  category: string;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class ItemService {
  constructor(private databaseService: DatabaseService) {}

  async findAll(): Promise<Item[]> {
    return this.databaseService.query('SELECT * FROM item');
  }

  async findOne(id: number): Promise<Item> {
    const items = await this.databaseService.query(
      'SELECT * FROM item WHERE id = $1',
      [id],
    );

    if (items.length === 0) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return items[0];
  }

  async findByItemId(itemId: string): Promise<Item | null> {
    const items = await this.databaseService.query(
      'SELECT * FROM item WHERE item_id = $1',
      [itemId],
    );

    return items.length > 0 ? items[0] : null;
  }

  async findBySku(sku: string): Promise<Item | null> {
    const items = await this.databaseService.query(
      'SELECT * FROM item WHERE sku = $1',
      [sku],
    );

    return items.length > 0 ? items[0] : null;
  }

  async findByCategory(category: string): Promise<Item[]> {
    return this.databaseService.query(
      'SELECT * FROM item WHERE category = $1',
      [category],
    );
  }

  async create(createItemDto: {
    name: string;
    description?: string;
    sku: string;
    price: number;
    quantity_available?: number;
    category: string;
  }): Promise<Item> {
    const newItemUlid = this.generateUlid();

    const insertItemQuery = `
      INSERT INTO item (
        item_id, name, description, sku, price, quantity_available, category
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    await this.databaseService.query(insertItemQuery, [
      newItemUlid,
      createItemDto.name,
      createItemDto.description || null,
      createItemDto.sku,
      createItemDto.price,
      createItemDto.quantity_available ?? 0,
      createItemDto.category,
    ]);

    return this.findByItemId(newItemUlid);
  }

  async update(
    id: number,
    updateItemDto: {
      name?: string;
      description?: string;
      sku?: string;
      price?: number;
      quantity_available?: number;
      category?: string;
    },
  ): Promise<Item> {
    const item = await this.findOne(id);

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (updateItemDto.name) {
      updates.push(`name = $${paramCount++}`);
      values.push(updateItemDto.name);
    }

    if (updateItemDto.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(updateItemDto.description);
    }

    if (updateItemDto.sku) {
      updates.push(`sku = $${paramCount++}`);
      values.push(updateItemDto.sku);
    }

    if (updateItemDto.price !== undefined) {
      updates.push(`price = $${paramCount++}`);
      values.push(updateItemDto.price);
    }

    if (updateItemDto.quantity_available !== undefined) {
      updates.push(`quantity_available = $${paramCount++}`);
      values.push(updateItemDto.quantity_available);
    }

    if (updateItemDto.category) {
      updates.push(`category = $${paramCount++}`);
      values.push(updateItemDto.category);
    }

    if (updates.length === 0) {
      return item;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    await this.databaseService.query(
      `UPDATE item SET ${updates.join(', ')} WHERE id = $${paramCount}`,
      values,
    );

    return this.findOne(id);
  }

  async remove(id: number): Promise<Item> {
    const item = await this.findOne(id);
    await this.databaseService.query('DELETE FROM item WHERE id = $1', [id]);
    return item;
  }

  private generateUlid(): string {
    // Implementação simples de ULID - em produção use uma biblioteca como 'ulid'
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
