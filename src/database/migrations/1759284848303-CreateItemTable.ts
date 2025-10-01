import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to create the item table
 *
 * This migration creates the item table with:
 * - id field as auto-increment primary key
 * - item_id field as unique item identifier (ULID)
 * - Product information: name, description, sku
 * - Pricing and inventory: price, quantity_available
 * - Category classification
 * - Automatic timestamps
 * - Performance indexes
 * - Trigger for automatic updated_at update
 */
export class CreateItemTable1759284848303 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the item table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS item (
        id SERIAL PRIMARY KEY,
        item_id VARCHAR(26) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL CHECK (LENGTH(name) >= 2),
        description TEXT,
        sku VARCHAR(100) UNIQUE NOT NULL,
        price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
        quantity_available INTEGER NOT NULL DEFAULT 0 CHECK (quantity_available >= 0),
        category VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for performance
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_item_item_id ON item(item_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_item_sku ON item(sku);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_item_category ON item(category);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_item_name ON item(name);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_item_created_at ON item(created_at);
    `);

    // Create trigger to automatically update updated_at
    await queryRunner.query(`
      CREATE TRIGGER update_item_updated_at 
      BEFORE UPDATE ON item 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove trigger first
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_item_updated_at ON item;
    `);

    // Remove indexes
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_item_item_id;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_item_sku;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_item_category;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_item_name;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_item_created_at;
    `);

    // Remove table last
    await queryRunner.query(`
      DROP TABLE IF EXISTS item;
    `);
  }
}
