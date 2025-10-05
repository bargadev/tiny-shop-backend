import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to rename tables and sequences from plural to singular
 *
 * This migration renames:
 * - addresses table to address
 * - addresses_id_seq sequence to address_id_seq
 * - users_id_seq sequence to user_id_seq
 */
export class RenameTablesToSingular1759669876000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename addresses table to address
    await queryRunner.query(`
      ALTER TABLE addresses RENAME TO address;
    `);

    // Rename addresses_id_seq sequence to address_id_seq
    await queryRunner.query(`
      ALTER SEQUENCE addresses_id_seq RENAME TO address_id_seq;
    `);

    // Rename users_id_seq sequence to user_id_seq
    await queryRunner.query(`
      ALTER SEQUENCE users_id_seq RENAME TO user_id_seq;
    `);

    // Update the sequence ownership for address table
    await queryRunner.query(`
      ALTER SEQUENCE address_id_seq OWNED BY address.id;
    `);

    // Update the sequence ownership for user table
    await queryRunner.query(`
      ALTER SEQUENCE user_id_seq OWNED BY "user".id;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert sequence ownership
    await queryRunner.query(`
      ALTER SEQUENCE address_id_seq OWNED BY address.id;
    `);

    await queryRunner.query(`
      ALTER SEQUENCE user_id_seq OWNED BY "user".id;
    `);

    // Rename sequences back to plural
    await queryRunner.query(`
      ALTER SEQUENCE user_id_seq RENAME TO users_id_seq;
    `);

    await queryRunner.query(`
      ALTER SEQUENCE address_id_seq RENAME TO addresses_id_seq;
    `);

    // Rename address table back to addresses
    await queryRunner.query(`
      ALTER TABLE address RENAME TO addresses;
    `);
  }
}
