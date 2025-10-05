import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateShoppingCartTables1759284848304
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS shopping_cart (
        id SERIAL PRIMARY KEY,
        cart_id VARCHAR(50) UNIQUE NOT NULL,
        customer_id VARCHAR(26),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS shopping_cart_item (
        id SERIAL PRIMARY KEY,
        cart_id VARCHAR(50) NOT NULL,
        item_id VARCHAR(50) NOT NULL,
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
        added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_shopping_cart_cart_id ON shopping_cart(cart_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_shopping_cart_customer_id ON shopping_cart(customer_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_shopping_cart_created_at ON shopping_cart(created_at);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_shopping_cart_item_item_id ON shopping_cart_item(item_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_shopping_cart_item_cart_id ON shopping_cart_item(cart_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_shopping_cart_item_added_at ON shopping_cart_item(added_at);
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_shopping_cart_updated_at 
      BEFORE UPDATE ON shopping_cart 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_shopping_cart_updated_at ON shopping_cart;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_shopping_cart_item_item_id;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_shopping_cart_item_cart_id;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_shopping_cart_item_added_at;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_shopping_cart_cart_id;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_shopping_cart_customer_id;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_shopping_cart_created_at;
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS shopping_cart_item;
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS shopping_cart;
    `);
  }
}
