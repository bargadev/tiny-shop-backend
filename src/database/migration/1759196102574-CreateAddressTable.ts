import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to create the addresses table
 *
 * This migration creates the addresses table with:
 * - Foreign key relationship to customer table
 * - Address fields with appropriate constraints
 * - Primary address flag
 * - Automatic timestamps
 * - Performance indexes
 */
export class CreateAddressTable1759196102574 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the addresses table
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS addresses (
                id SERIAL PRIMARY KEY,
                customer_id VARCHAR(26) NOT NULL,
                street VARCHAR(255) NOT NULL,
                number VARCHAR(20) NOT NULL,
                complement VARCHAR(255),
                neighborhood VARCHAR(255) NOT NULL,
                city VARCHAR(255) NOT NULL,
                state VARCHAR(100) NOT NULL,
                postal_code VARCHAR(20) NOT NULL,
                country VARCHAR(100) DEFAULT 'Brasil',
                is_primary BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_address_customer FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE
            );
        `);

    // Create indexes for better performance
    await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_addresses_customer_id ON addresses(customer_id);
        `);

    await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_addresses_is_primary ON addresses(customer_id, is_primary) WHERE is_primary = TRUE;
        `);

    await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_addresses_postal_code ON addresses(postal_code);
        `);

    // Create trigger to automatically update updated_at
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql';
        `);

    await queryRunner.query(`
            CREATE TRIGGER update_addresses_updated_at 
                BEFORE UPDATE ON addresses 
                FOR EACH ROW 
                EXECUTE FUNCTION update_updated_at_column();
        `);

    // Create constraint to ensure only one primary address per customer
    await queryRunner.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS unique_primary_address_per_customer 
            ON addresses (customer_id) 
            WHERE is_primary = TRUE;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop trigger
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS update_addresses_updated_at ON addresses;`,
    );

    // Drop function
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS update_updated_at_column();`,
    );

    // Drop indexes
    await queryRunner.query(
      `DROP INDEX IF EXISTS unique_primary_address_per_customer;`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS idx_addresses_postal_code;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_addresses_is_primary;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_addresses_customer_id;`);

    // Drop table
    await queryRunner.query(`DROP TABLE IF EXISTS addresses;`);
  }
}
