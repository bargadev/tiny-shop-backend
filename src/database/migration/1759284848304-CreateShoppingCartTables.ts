import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to create the shopping cart tables
 *
 * This migration creates the shopping cart and shopping cart item tables with:
 * - shopping_cart table with cart_id as unique identifier (ULID)
 * - shopping_cart_item table for cart items with foreign key to cart
 * - Proper foreign key constraints
 * - Automatic timestamps
 * - Performance indexes
 * - Trigger for automatic updated_at update
 */
export class CreateShoppingCartTables1759284848304
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the shopping_cart table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS shopping_cart (
        id SERIAL PRIMARY KEY,
        cart_id VARCHAR(50) UNIQUE NOT NULL,
        customer_id VARCHAR(26) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create the shopping_cart_item table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS shopping_cart_item (
        id SERIAL PRIMARY KEY,
        item_id VARCHAR(50) NOT NULL,
        cart_id VARCHAR(50) UNIQUE NOT NULL,
        product_id VARCHAR(26) NOT NULL,
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
        added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add foreign key constraint for cart_id in shopping_cart_item
    await queryRunner.query(`
      ALTER TABLE shopping_cart_item 
      ADD CONSTRAINT fk_shopping_cart_item_cart_id 
      FOREIGN KEY (cart_id) REFERENCES shopping_cart(cart_id) 
      ON DELETE CASCADE;
    `);

    // Add foreign key constraint for customer_id in shopping_cart
    await queryRunner.query(`
      ALTER TABLE shopping_cart 
      ADD CONSTRAINT fk_shopping_cart_customer_id 
      FOREIGN KEY (customer_id) REFERENCES customer(customer_id) 
      ON DELETE CASCADE;
    `);

    // Add foreign key constraint for product_id in shopping_cart_item
    await queryRunner.query(`
      ALTER TABLE shopping_cart_item 
      ADD CONSTRAINT fk_shopping_cart_item_product_id 
      FOREIGN KEY (product_id) REFERENCES item(item_id) 
      ON DELETE CASCADE;
    `);

    // Create indexes for performance on shopping_cart table
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_shopping_cart_cart_id ON shopping_cart(cart_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_shopping_cart_customer_id ON shopping_cart(customer_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_shopping_cart_created_at ON shopping_cart(created_at);
    `);

    // Create indexes for performance on shopping_cart_item table
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_shopping_cart_item_item_id ON shopping_cart_item(item_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_shopping_cart_item_cart_id ON shopping_cart_item(cart_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_shopping_cart_item_product_id ON shopping_cart_item(product_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_shopping_cart_item_added_at ON shopping_cart_item(added_at);
    `);

    // Create trigger to automatically update updated_at for shopping_cart
    await queryRunner.query(`
      CREATE TRIGGER update_shopping_cart_updated_at 
      BEFORE UPDATE ON shopping_cart 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove trigger first
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_shopping_cart_updated_at ON shopping_cart;
    `);

    // Remove indexes for shopping_cart_item
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_shopping_cart_item_item_id;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_shopping_cart_item_cart_id;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_shopping_cart_item_product_id;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_shopping_cart_item_added_at;
    `);

    // Remove indexes for shopping_cart
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_shopping_cart_cart_id;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_shopping_cart_customer_id;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_shopping_cart_created_at;
    `);

    // Remove foreign key constraints
    await queryRunner.query(`
      ALTER TABLE shopping_cart_item 
      DROP CONSTRAINT IF EXISTS fk_shopping_cart_item_cart_id;
    `);

    await queryRunner.query(`
      ALTER TABLE shopping_cart 
      DROP CONSTRAINT IF EXISTS fk_shopping_cart_customer_id;
    `);

    await queryRunner.query(`
      ALTER TABLE shopping_cart_item 
      DROP CONSTRAINT IF EXISTS fk_shopping_cart_item_product_id;
    `);

    // Remove tables (order matters due to foreign keys)
    await queryRunner.query(`
      DROP TABLE IF EXISTS shopping_cart_item;
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS shopping_cart;
    `);
  }
}
