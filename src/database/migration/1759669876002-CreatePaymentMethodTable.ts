import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentMethodTable1759669876002
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS payment_method (
        id SERIAL PRIMARY KEY,
        payment_method_id VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create index for better performance
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_payment_method_payment_method_id 
      ON payment_method(payment_method_id);
    `);

    // Create trigger for updated_at
    await queryRunner.query(`
      CREATE TRIGGER update_payment_method_updated_at 
      BEFORE UPDATE ON payment_method 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop trigger
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_payment_method_updated_at ON payment_method;
    `);

    // Drop index
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_payment_method_payment_method_id;
    `);

    // Drop table
    await queryRunner.query(`
      DROP TABLE IF EXISTS payment_method;
    `);
  }
}

