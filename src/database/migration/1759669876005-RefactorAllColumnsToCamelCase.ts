import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorAllColumnsToCamelCase1759669876005
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // USER TABLE
    await queryRunner.query(`
      ALTER TABLE "user" 
      RENAME COLUMN user_id TO "userId";
    `);
    await queryRunner.query(`
      ALTER TABLE "user" 
      RENAME COLUMN created_at TO "createdAt";
    `);
    await queryRunner.query(`
      ALTER TABLE "user" 
      RENAME COLUMN updated_at TO "updatedAt";
    `);

    // CUSTOMER TABLE
    await queryRunner.query(`
      ALTER TABLE customer 
      RENAME COLUMN customer_id TO "customerId";
    `);
    await queryRunner.query(`
      ALTER TABLE customer 
      RENAME COLUMN first_name TO "firstName";
    `);
    await queryRunner.query(`
      ALTER TABLE customer 
      RENAME COLUMN last_name TO "lastName";
    `);
    await queryRunner.query(`
      ALTER TABLE customer 
      RENAME COLUMN phone_number TO "phoneNumber";
    `);
    await queryRunner.query(`
      ALTER TABLE customer 
      RENAME COLUMN date_of_birth TO "dateOfBirth";
    `);
    await queryRunner.query(`
      ALTER TABLE customer 
      RENAME COLUMN created_at TO "createdAt";
    `);
    await queryRunner.query(`
      ALTER TABLE customer 
      RENAME COLUMN updated_at TO "updatedAt";
    `);

    // ADDRESS TABLE
    await queryRunner.query(`
      ALTER TABLE address 
      RENAME COLUMN address_id TO "addressId";
    `);
    await queryRunner.query(`
      ALTER TABLE address 
      RENAME COLUMN customer_id TO "customerId";
    `);
    await queryRunner.query(`
      ALTER TABLE address 
      RENAME COLUMN postal_code TO "postalCode";
    `);
    await queryRunner.query(`
      ALTER TABLE address 
      RENAME COLUMN is_primary TO "isPrimary";
    `);
    await queryRunner.query(`
      ALTER TABLE address 
      RENAME COLUMN created_at TO "createdAt";
    `);
    await queryRunner.query(`
      ALTER TABLE address 
      RENAME COLUMN updated_at TO "updatedAt";
    `);

    // ITEM TABLE
    await queryRunner.query(`
      ALTER TABLE item 
      RENAME COLUMN item_id TO "itemId";
    `);
    await queryRunner.query(`
      ALTER TABLE item 
      RENAME COLUMN created_at TO "createdAt";
    `);
    await queryRunner.query(`
      ALTER TABLE item 
      RENAME COLUMN updated_at TO "updatedAt";
    `);

    // PAYMENT_METHOD TABLE
    await queryRunner.query(`
      ALTER TABLE payment_method 
      RENAME COLUMN payment_method_id TO "paymentMethodId";
    `);
    await queryRunner.query(`
      ALTER TABLE payment_method 
      RENAME COLUMN is_active TO "isActive";
    `);
    await queryRunner.query(`
      ALTER TABLE payment_method 
      RENAME COLUMN created_at TO "createdAt";
    `);
    await queryRunner.query(`
      ALTER TABLE payment_method 
      RENAME COLUMN updated_at TO "updatedAt";
    `);

    // SHOPPING_CART TABLE
    await queryRunner.query(`
      ALTER TABLE shopping_cart 
      RENAME COLUMN cart_id TO "cartId";
    `);
    await queryRunner.query(`
      ALTER TABLE shopping_cart 
      RENAME COLUMN customer_id TO "customerId";
    `);
    await queryRunner.query(`
      ALTER TABLE shopping_cart 
      RENAME COLUMN created_at TO "createdAt";
    `);
    await queryRunner.query(`
      ALTER TABLE shopping_cart 
      RENAME COLUMN updated_at TO "updatedAt";
    `);

    // SHOPPING_CART_ITEM TABLE
    await queryRunner.query(`
      ALTER TABLE shopping_cart_item 
      RENAME COLUMN cart_id TO "cartId";
    `);
    await queryRunner.query(`
      ALTER TABLE shopping_cart_item 
      RENAME COLUMN item_id TO "itemId";
    `);
    await queryRunner.query(`
      ALTER TABLE shopping_cart_item 
      RENAME COLUMN added_at TO "addedAt";
    `);

    // ORDER TABLE
    await queryRunner.query(`
      ALTER TABLE "order" 
      RENAME COLUMN order_id TO "orderId";
    `);
    await queryRunner.query(`
      ALTER TABLE "order" 
      RENAME COLUMN cart_id TO "cartId";
    `);
    await queryRunner.query(`
      ALTER TABLE "order" 
      RENAME COLUMN customer_id TO "customerId";
    `);
    await queryRunner.query(`
      ALTER TABLE "order" 
      RENAME COLUMN address_id TO "addressId";
    `);
    await queryRunner.query(`
      ALTER TABLE "order" 
      RENAME COLUMN total_amount TO "totalAmount";
    `);
    await queryRunner.query(`
      ALTER TABLE "order" 
      RENAME COLUMN payment_method_id TO "paymentMethodId";
    `);
    await queryRunner.query(`
      ALTER TABLE "order" 
      RENAME COLUMN created_at TO "createdAt";
    `);
    await queryRunner.query(`
      ALTER TABLE "order" 
      RENAME COLUMN updated_at TO "updatedAt";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ORDER TABLE
    await queryRunner.query(`
      ALTER TABLE "order" 
      RENAME COLUMN "updatedAt" TO updated_at;
    `);
    await queryRunner.query(`
      ALTER TABLE "order" 
      RENAME COLUMN "createdAt" TO created_at;
    `);
    await queryRunner.query(`
      ALTER TABLE "order" 
      RENAME COLUMN "paymentMethodId" TO payment_method_id;
    `);
    await queryRunner.query(`
      ALTER TABLE "order" 
      RENAME COLUMN "totalAmount" TO total_amount;
    `);
    await queryRunner.query(`
      ALTER TABLE "order" 
      RENAME COLUMN "addressId" TO address_id;
    `);
    await queryRunner.query(`
      ALTER TABLE "order" 
      RENAME COLUMN "customerId" TO customer_id;
    `);
    await queryRunner.query(`
      ALTER TABLE "order" 
      RENAME COLUMN "cartId" TO cart_id;
    `);
    await queryRunner.query(`
      ALTER TABLE "order" 
      RENAME COLUMN "orderId" TO order_id;
    `);

    // SHOPPING_CART_ITEM TABLE
    await queryRunner.query(`
      ALTER TABLE shopping_cart_item 
      RENAME COLUMN "addedAt" TO added_at;
    `);
    await queryRunner.query(`
      ALTER TABLE shopping_cart_item 
      RENAME COLUMN "itemId" TO item_id;
    `);
    await queryRunner.query(`
      ALTER TABLE shopping_cart_item 
      RENAME COLUMN "cartId" TO cart_id;
    `);

    // SHOPPING_CART TABLE
    await queryRunner.query(`
      ALTER TABLE shopping_cart 
      RENAME COLUMN "updatedAt" TO updated_at;
    `);
    await queryRunner.query(`
      ALTER TABLE shopping_cart 
      RENAME COLUMN "createdAt" TO created_at;
    `);
    await queryRunner.query(`
      ALTER TABLE shopping_cart 
      RENAME COLUMN "customerId" TO customer_id;
    `);
    await queryRunner.query(`
      ALTER TABLE shopping_cart 
      RENAME COLUMN "cartId" TO cart_id;
    `);

    // PAYMENT_METHOD TABLE
    await queryRunner.query(`
      ALTER TABLE payment_method 
      RENAME COLUMN "updatedAt" TO updated_at;
    `);
    await queryRunner.query(`
      ALTER TABLE payment_method 
      RENAME COLUMN "createdAt" TO created_at;
    `);
    await queryRunner.query(`
      ALTER TABLE payment_method 
      RENAME COLUMN "isActive" TO is_active;
    `);
    await queryRunner.query(`
      ALTER TABLE payment_method 
      RENAME COLUMN "paymentMethodId" TO payment_method_id;
    `);

    // ITEM TABLE
    await queryRunner.query(`
      ALTER TABLE item 
      RENAME COLUMN "updatedAt" TO updated_at;
    `);
    await queryRunner.query(`
      ALTER TABLE item 
      RENAME COLUMN "createdAt" TO created_at;
    `);
    await queryRunner.query(`
      ALTER TABLE item 
      RENAME COLUMN "itemId" TO item_id;
    `);

    // ADDRESS TABLE
    await queryRunner.query(`
      ALTER TABLE address 
      RENAME COLUMN "updatedAt" TO updated_at;
    `);
    await queryRunner.query(`
      ALTER TABLE address 
      RENAME COLUMN "createdAt" TO created_at;
    `);
    await queryRunner.query(`
      ALTER TABLE address 
      RENAME COLUMN "isPrimary" TO is_primary;
    `);
    await queryRunner.query(`
      ALTER TABLE address 
      RENAME COLUMN "postalCode" TO postal_code;
    `);
    await queryRunner.query(`
      ALTER TABLE address 
      RENAME COLUMN "customerId" TO customer_id;
    `);
    await queryRunner.query(`
      ALTER TABLE address 
      RENAME COLUMN "addressId" TO address_id;
    `);

    // CUSTOMER TABLE
    await queryRunner.query(`
      ALTER TABLE customer 
      RENAME COLUMN "updatedAt" TO updated_at;
    `);
    await queryRunner.query(`
      ALTER TABLE customer 
      RENAME COLUMN "createdAt" TO created_at;
    `);
    await queryRunner.query(`
      ALTER TABLE customer 
      RENAME COLUMN "dateOfBirth" TO date_of_birth;
    `);
    await queryRunner.query(`
      ALTER TABLE customer 
      RENAME COLUMN "phoneNumber" TO phone_number;
    `);
    await queryRunner.query(`
      ALTER TABLE customer 
      RENAME COLUMN "lastName" TO last_name;
    `);
    await queryRunner.query(`
      ALTER TABLE customer 
      RENAME COLUMN "firstName" TO first_name;
    `);
    await queryRunner.query(`
      ALTER TABLE customer 
      RENAME COLUMN "customerId" TO customer_id;
    `);

    // USER TABLE
    await queryRunner.query(`
      ALTER TABLE "user" 
      RENAME COLUMN "updatedAt" TO updated_at;
    `);
    await queryRunner.query(`
      ALTER TABLE "user" 
      RENAME COLUMN "createdAt" TO created_at;
    `);
    await queryRunner.query(`
      ALTER TABLE "user" 
      RENAME COLUMN "userId" TO user_id;
    `);
  }
}
