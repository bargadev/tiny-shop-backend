import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to create the users table
 *
 * This migration creates the main users table of the system with:
 * - id field as auto-increment primary key
 * - user_id field as unique user identifier (ULID)
 * - Personal data fields with validations
 * - Automatic timestamps
 * - Performance indexes
 * - Trigger for automatic updated_at update
 */
export class CreateUsersTable1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the users table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(26) UNIQUE NOT NULL,
        fullname VARCHAR(255) NOT NULL CHECK (LENGTH(fullname) >= 2),
        email VARCHAR(255) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
        password VARCHAR(255) NOT NULL CHECK (LENGTH(password) >= 8),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for performance
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
    `);

    // Create function to automatically update updated_at
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create trigger to automatically update updated_at
    await queryRunner.query(`
      CREATE TRIGGER update_users_updated_at 
      BEFORE UPDATE ON users 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove trigger first
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
    `);

    // Remove function
    await queryRunner.query(`
      DROP FUNCTION IF EXISTS update_updated_at_column();
    `);

    // Remove indexes
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_users_email;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_users_user_id;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_users_created_at;
    `);

    // Remove table last
    await queryRunner.query(`
      DROP TABLE IF EXISTS users;
    `);
  }
}
