import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterOrderTableAddPaymentMethodId1759669876003
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add payment_method_id column
    await queryRunner.query(`
      ALTER TABLE "order" 
      ADD COLUMN payment_method_id INTEGER;
    `);

    // Migrate existing data from payment_method string to payment_method_id
    // Assumes payment_method table has been populated with seed data
    await queryRunner.query(`
      UPDATE "order" o
      SET payment_method_id = pm.id
      FROM payment_method pm
      WHERE 
        (o.payment_method = 'credit_card' AND pm.name = 'Credit Card') OR
        (o.payment_method = 'debit_card' AND pm.name = 'Debit Card') OR
        (o.payment_method = 'pix' AND pm.name = 'PIX') OR
        (o.payment_method = 'bank_slip' AND pm.name = 'Bank Slip') OR
        (o.payment_method = 'cash' AND pm.name = 'Cash');
    `);

    // Drop the old payment_method column
    await queryRunner.query(`
      ALTER TABLE "order" 
      DROP COLUMN payment_method;
    `);

    // Create index for payment_method_id
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_order_payment_method_id 
      ON "order"(payment_method_id);
    `);

    // Add foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "order" 
      ADD CONSTRAINT fk_order_payment_method 
      FOREIGN KEY (payment_method_id) 
      REFERENCES payment_method(id) 
      ON DELETE SET NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "order" 
      DROP CONSTRAINT IF EXISTS fk_order_payment_method;
    `);

    // Drop index
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_order_payment_method_id;
    `);

    // Add back the old payment_method column
    await queryRunner.query(`
      ALTER TABLE "order" 
      ADD COLUMN payment_method VARCHAR(30);
    `);

    // Migrate data back from payment_method_id to payment_method string
    await queryRunner.query(`
      UPDATE "order" o
      SET payment_method = 
        CASE 
          WHEN pm.name = 'Credit Card' THEN 'credit_card'
          WHEN pm.name = 'Debit Card' THEN 'debit_card'
          WHEN pm.name = 'PIX' THEN 'pix'
          WHEN pm.name = 'Bank Slip' THEN 'bank_slip'
          WHEN pm.name = 'Cash' THEN 'cash'
        END
      FROM payment_method pm
      WHERE o.payment_method_id = pm.id;
    `);

    // Drop payment_method_id column
    await queryRunner.query(`
      ALTER TABLE "order" 
      DROP COLUMN payment_method_id;
    `);
  }
}

