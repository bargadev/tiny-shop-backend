import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ShoppingCartController } from './shopping-cart.controller';
import { ShoppingCartService } from './shopping-cart.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService],
  exports: [ShoppingCartService],
})
export class ShoppingCartModule {}
