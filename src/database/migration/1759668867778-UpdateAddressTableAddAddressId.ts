import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAddressTableAddAddressId1759668867778
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Add the column as nullable first
    await queryRunner.query(`
            ALTER TABLE addresses ADD COLUMN address_id VARCHAR(50);
        `);

    // Step 2: Generate unique address_id values for existing rows
    // Using a simple approach: generate ULID-like values for existing records
    await queryRunner.query(`
            UPDATE addresses 
            SET address_id = 'ADDR' || LPAD(CAST(id AS TEXT), 10, '0') || EXTRACT(EPOCH FROM NOW())::BIGINT::TEXT
            WHERE address_id IS NULL;
        `);

    // Step 3: Add unique constraint
    await queryRunner.query(`
            ALTER TABLE addresses ADD CONSTRAINT addresses_address_id_unique UNIQUE (address_id);
        `);

    // Step 4: Make the column NOT NULL
    await queryRunner.query(`
            ALTER TABLE addresses ALTER COLUMN address_id SET NOT NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the unique constraint first
    await queryRunner.query(`
            ALTER TABLE addresses DROP CONSTRAINT IF EXISTS addresses_address_id_unique;
        `);

    // Then drop the column
    await queryRunner.query(`
            ALTER TABLE addresses DROP COLUMN address_id;
        `);
  }
}
