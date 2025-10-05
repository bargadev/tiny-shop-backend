import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to alter ULID fields to VARCHAR(50)
 *
 * This migration alters the following fields from VARCHAR(26) to VARCHAR(50):
 * - user_id in users table
 * - customer_id in customer table
 * - item_id in item table
 *
 * This change allows for longer identifiers while maintaining compatibility.
 */
export class AlterUlidFieldsToVarchar501759284848305
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Alter user_id in user table
    await queryRunner.query(`
      ALTER TABLE "user"
      ALTER COLUMN user_id TYPE VARCHAR(50);
    `);

    await queryRunner.query(`
      ALTER TABLE "user"
      ALTER COLUMN user_id SET NOT NULL;
    `);

    // Alter customer_id in customer table
    await queryRunner.query(`
      ALTER TABLE customer 
      ALTER COLUMN customer_id TYPE VARCHAR(50);
    `);

    await queryRunner.query(`
      ALTER TABLE customer 
      ALTER COLUMN customer_id SET NOT NULL;
    `);

    // Alter item_id in item table
    await queryRunner.query(`
      ALTER TABLE item 
      ALTER COLUMN item_id TYPE VARCHAR(50);
    `);

    await queryRunner.query(`
      ALTER TABLE item 
      ALTER COLUMN item_id SET NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert user_id in user table back to VARCHAR(26)
    await queryRunner.query(`
      ALTER TABLE "user"
      ALTER COLUMN user_id TYPE VARCHAR(26);
    `);

    await queryRunner.query(`
      ALTER TABLE "user"
      ALTER COLUMN user_id SET NOT NULL;
    `);

    // Revert customer_id in customer table back to VARCHAR(26)
    await queryRunner.query(`
      ALTER TABLE customer 
      ALTER COLUMN customer_id TYPE VARCHAR(26);
    `);

    await queryRunner.query(`
      ALTER TABLE customer 
      ALTER COLUMN customer_id SET NOT NULL;
    `);

    // Revert item_id in item table back to VARCHAR(26)
    await queryRunner.query(`
      ALTER TABLE item 
      ALTER COLUMN item_id TYPE VARCHAR(26);
    `);

    await queryRunner.query(`
      ALTER TABLE item 
      ALTER COLUMN item_id SET NOT NULL;
    `);
  }
}
