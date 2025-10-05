import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingCartController } from './shopping-cart.controller';
import { ShoppingCartModule } from './shopping-cart.module';
import { ShoppingCartService } from './shopping-cart.service';

describe('ShoppingCartModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ShoppingCartModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide ShoppingCartService', () => {
    const service = module.get<ShoppingCartService>(ShoppingCartService);
    expect(service).toBeDefined();
  });

  it('should provide ShoppingCartController', () => {
    const controller = module.get<ShoppingCartController>(
      ShoppingCartController,
    );
    expect(controller).toBeDefined();
  });
});
