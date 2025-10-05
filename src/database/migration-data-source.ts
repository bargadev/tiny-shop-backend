import { DataSource } from 'typeorm';

export const MigrationDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'tiny_shop',
  migrations: ['src/database/migration/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
