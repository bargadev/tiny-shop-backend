import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AddressModule } from './module/address/address.module';
import { CustomerModule } from './module/customer/customer.module';
import { ItemModule } from './module/item/item.module';
import { PaymentMethodModule } from './module/payment-method/payment-method.module';
import { ShoppingCartModule } from './module/shopping-cart/shopping-cart.module';
import { UserModule } from './module/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'tiny_shop',
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
    }),
    DatabaseModule,
    UserModule,
    CustomerModule,
    AddressModule,
    ItemModule,
    PaymentMethodModule,
    ShoppingCartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
