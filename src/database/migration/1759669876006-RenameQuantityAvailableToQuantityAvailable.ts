import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameQuantityAvailableToQuantityAvailable1759669876006
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ITEM TABLE
    await queryRunner.query(`
      ALTER TABLE item 
      RENAME COLUMN quantity_available TO "quantityAvailable";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE item 
      RENAME COLUMN "quantityAvailable" TO quantity_available;
    `);
  }
}
