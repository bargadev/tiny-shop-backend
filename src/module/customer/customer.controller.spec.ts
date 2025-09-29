import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { Customer, CustomerService } from './customer.service';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: jest.Mocked<CustomerService>;

  const mockCustomer: Customer = {
    id: 1,
    customer_id: '01JQZ8K9M2N3P4Q5R6S7T8U9V0',
    first_name: 'João',
    last_name: 'Silva',
    email: 'joao.silva@email.com',
    phone_number: '+55 11 99999-9999',
    date_of_birth: new Date('1990-05-15'),
    created_at: new Date('2024-01-01T00:00:00Z'),
    updated_at: new Date('2024-01-01T00:00:00Z'),
  };

  beforeEach(async () => {
    const mockCustomerService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: mockCustomerService,
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get(CustomerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service findAll', async () => {
    service.findAll.mockResolvedValue([mockCustomer]);
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call service findOne', async () => {
    service.findOne.mockResolvedValue(mockCustomer);
    await controller.findOne('1');
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should call service create', async () => {
    service.create.mockResolvedValue(mockCustomer);
    await controller.create({
      first_name: 'João',
      last_name: 'Silva',
      email: 'joao.silva@email.com',
    });
    expect(service.create).toHaveBeenCalled();
  });

  it('should call service update', async () => {
    service.update.mockResolvedValue(mockCustomer);
    await controller.update('1', { first_name: 'Updated' });
    expect(service.update).toHaveBeenCalledWith(1, { first_name: 'Updated' });
  });

  it('should call service remove', async () => {
    service.remove.mockResolvedValue(mockCustomer);
    await controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
