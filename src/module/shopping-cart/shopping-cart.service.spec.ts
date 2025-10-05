import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../../database/database.service';
import { ShoppingCartService } from './shopping-cart.service';

describe('ShoppingCartService', () => {
  let service: ShoppingCartService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingCartService,
        {
          provide: DatabaseService,
          useValue: {
            query: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ShoppingCartService>(ShoppingCartService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a shopping cart', async () => {
    const mockCart = {
      id: 1,
      cart_id: 'test-cart-id',
      customer_id: 'test-customer-id',
      created_at: new Date(),
      updated_at: new Date(),
    };

    jest.spyOn(databaseService, 'query').mockResolvedValueOnce([]);
    jest.spyOn(databaseService, 'query').mockResolvedValueOnce([mockCart]);

    const result = await service.create({ customer_id: 'test-customer-id' });

    expect(result).toEqual(mockCart);
    expect(databaseService.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO shopping_cart'),
      expect.arrayContaining(['test-cart-id', 'test-customer-id']),
    );
  });

  it('should add item to cart', async () => {
    const mockItem = {
      id: 1,
      cart_id: 'test-cart-id',
      item_id: 'test-item-id',
      quantity: 2,
      price: 29.99,
      added_at: new Date(),
    };

    jest.spyOn(databaseService, 'query').mockResolvedValueOnce([]);
    jest.spyOn(databaseService, 'query').mockResolvedValueOnce([]);
    jest.spyOn(databaseService, 'query').mockResolvedValueOnce([mockItem]);

    const result = await service.addItemToCart(
      'test-cart-id',
      'test-item-id',
      2,
      29.99,
    );

    expect(result).toEqual(mockItem);
  });
});
