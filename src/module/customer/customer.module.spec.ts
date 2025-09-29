import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../../database/database.service';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

describe('CustomerModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    const mockDatabaseService = {
      query: jest.fn(),
    };

    module = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        CustomerService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
      exports: [CustomerService],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide CustomerService', () => {
    const service = module.get<CustomerService>(CustomerService);
    expect(service).toBeDefined();
  });

  it('should provide CustomerController', () => {
    const controller = module.get<CustomerController>(CustomerController);
    expect(controller).toBeDefined();
  });
});
