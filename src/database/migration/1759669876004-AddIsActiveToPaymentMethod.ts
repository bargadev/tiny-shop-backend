import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsActiveToPaymentMethod1759669876004
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add is_active column with default value true
    await queryRunner.query(`
      ALTER TABLE payment_method 
      ADD COLUMN is_active BOOLEAN DEFAULT true NOT NULL;
    `);

    // Create index for better performance on active payment methods queries
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_payment_method_is_active 
      ON payment_method(is_active);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_payment_method_is_active;
    `);

    // Drop is_active column
    await queryRunner.query(`
      ALTER TABLE payment_method 
      DROP COLUMN is_active;
    `);
  }
}
