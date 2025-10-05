import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to create the customer table
 *
 * This migration creates the customer table with:
 * - id field as auto-increment primary key
 * - customer_id field as unique customer identifier (ULID)
 * - Personal data fields: first_name, last_name
 * - Contact information: email, phone_number
 * - Date of birth field
 * - Automatic timestamps
 * - Performance indexes
 * - Trigger for automatic updated_at update
 */
export class CreateCustomerTable1759070386762 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the customer table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS customer (
        id SERIAL PRIMARY KEY,
        customer_id VARCHAR(26) UNIQUE NOT NULL,
        first_name VARCHAR(255) NOT NULL CHECK (LENGTH(first_name) >= 2),
        last_name VARCHAR(255) NOT NULL CHECK (LENGTH(last_name) >= 2),
        email VARCHAR(255) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
        phone_number VARCHAR(20) CHECK (phone_number ~* '^[+]?[0-9\\s\\-\\(\\)]+$'),
        date_of_birth DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for performance
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_customer_customer_id ON customer(customer_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_customer_email ON customer(email);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_customer_phone_number ON customer(phone_number);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_customer_created_at ON customer(created_at);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_customer_date_of_birth ON customer(date_of_birth);
    `);

    // Create trigger to automatically update updated_at
    await queryRunner.query(`
      CREATE TRIGGER update_customer_updated_at 
      BEFORE UPDATE ON customer 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove trigger first
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_customer_updated_at ON customer;
    `);

    // Remove indexes
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_customer_customer_id;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_customer_email;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_customer_phone_number;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_customer_created_at;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_customer_date_of_birth;
    `);

    // Remove table last
    await queryRunner.query(`
      DROP TABLE IF EXISTS customer;
    `);
  }
}
