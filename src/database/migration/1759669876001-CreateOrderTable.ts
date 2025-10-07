import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderTable1759669876001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "order" (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) UNIQUE NOT NULL,
        cart_id VARCHAR(50) NOT NULL UNIQUE,
        customer_id VARCHAR(50) NOT NULL,
        address_id VARCHAR(50) NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        payment_method VARCHAR(30),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better performance
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_order_order_id ON "order"(order_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_order_cart_id ON "order"(cart_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_order_customer_id ON "order"(customer_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_order_address_id ON "order"(address_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_order_status ON "order"(status);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_order_created_at ON "order"(created_at);
    `);

    // Add check constraint for status values
    await queryRunner.query(`
      ALTER TABLE "order" ADD CONSTRAINT chk_order_status 
      CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'canceled'));
    `);

    // Add check constraint for total_amount
    await queryRunner.query(`
      ALTER TABLE "order" ADD CONSTRAINT chk_order_total_amount 
      CHECK (total_amount >= 0);
    `);

    // Create trigger for updated_at
    await queryRunner.query(`
      CREATE TRIGGER update_order_updated_at 
      BEFORE UPDATE ON "order" 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop trigger
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_order_updated_at ON "order";
    `);

    // Drop check constraints
    await queryRunner.query(`
      ALTER TABLE "order" DROP CONSTRAINT IF EXISTS chk_order_total_amount;
    `);

    await queryRunner.query(`
      ALTER TABLE "order" DROP CONSTRAINT IF EXISTS chk_order_status;
    `);

    // Drop indexes
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_order_created_at;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_order_status;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_order_address_id;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_order_customer_id;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_order_cart_id;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_order_order_id;
    `);

    // Drop table
    await queryRunner.query(`
      DROP TABLE IF EXISTS "order";
    `);
  }
}
