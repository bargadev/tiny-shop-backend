import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameUsersToUser1759002502183 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename table 'users' to 'user'
    await queryRunner.query(`
      ALTER TABLE users RENAME TO "user";
    `);

    // Rename indexes to match new table name
    await queryRunner.query(`
      ALTER INDEX IF EXISTS idx_users_email RENAME TO idx_user_email;
    `);
    await queryRunner.query(`
      ALTER INDEX IF EXISTS idx_users_user_id RENAME TO idx_user_user_id;
    `);
    await queryRunner.query(`
      ALTER INDEX IF EXISTS idx_users_created_at RENAME TO idx_user_created_at;
    `);

    // Drop and recreate trigger for updated_at, since triggers are bound to table name
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON "user";
    `);
    await queryRunner.query(`
      CREATE TRIGGER update_user_updated_at 
      BEFORE UPDATE ON "user" 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop trigger for 'user' table
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_user_updated_at ON "user";
    `);

    // Rename indexes back to original names
    await queryRunner.query(`
      ALTER INDEX IF EXISTS idx_user_email RENAME TO idx_users_email;
    `);
    await queryRunner.query(`
      ALTER INDEX IF EXISTS idx_user_user_id RENAME TO idx_users_user_id;
    `);
    await queryRunner.query(`
      ALTER INDEX IF EXISTS idx_user_created_at RENAME TO idx_users_created_at;
    `);

    // Rename table 'user' back to 'users'
    await queryRunner.query(`
      ALTER TABLE "user" RENAME TO users;
    `);

    // Recreate trigger for 'users' table
    await queryRunner.query(`
      CREATE TRIGGER update_users_updated_at 
      BEFORE UPDATE ON users 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
    `);
  }
}
