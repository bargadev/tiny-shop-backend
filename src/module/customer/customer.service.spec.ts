import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../../database/database.service';
import { Customer, CustomerService } from './customer.service';

describe('CustomerService', () => {
  let service: CustomerService;
  let databaseService: jest.Mocked<DatabaseService>;

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
    const mockDatabaseService = {
      query: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    databaseService = module.get(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call database query for findAll', async () => {
    databaseService.query.mockResolvedValue([mockCustomer]);
    await service.findAll();
    expect(databaseService.query).toHaveBeenCalledWith(
      'SELECT * FROM customer',
    );
  });

  it('should call database query for findOne', async () => {
    databaseService.query.mockResolvedValue([mockCustomer]);
    await service.findOne(1);
    expect(databaseService.query).toHaveBeenCalledWith(
      'SELECT * FROM customer WHERE id = $1',
      [1],
    );
  });

  it('should throw NotFoundException when customer not found', async () => {
    databaseService.query.mockResolvedValue([]);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should call database query for create', async () => {
    databaseService.query.mockResolvedValueOnce(undefined);
    databaseService.query.mockResolvedValueOnce([mockCustomer]);
    await service.create({
      first_name: 'João',
      last_name: 'Silva',
      email: 'joao.silva@email.com',
    });
    expect(databaseService.query).toHaveBeenCalled();
  });

  it('should call database query for update', async () => {
    databaseService.query.mockResolvedValueOnce([mockCustomer]);
    databaseService.query.mockResolvedValueOnce(undefined);
    databaseService.query.mockResolvedValueOnce([mockCustomer]);
    await service.update(1, { first_name: 'Updated' });
    expect(databaseService.query).toHaveBeenCalled();
  });

  it('should call database query for remove', async () => {
    databaseService.query.mockResolvedValueOnce([mockCustomer]);
    databaseService.query.mockResolvedValueOnce(undefined);
    await service.remove(1);
    expect(databaseService.query).toHaveBeenCalled();
  });

  it('should handle update with null values', async () => {
    databaseService.query.mockResolvedValueOnce([mockCustomer]);
    databaseService.query.mockResolvedValueOnce(undefined);
    databaseService.query.mockResolvedValueOnce([mockCustomer]);
    await service.update(1, { phone_number: null, date_of_birth: null });
    expect(databaseService.query).toHaveBeenCalled();
  });

  it('should call database query for findByCustomerId', async () => {
    databaseService.query.mockResolvedValue([mockCustomer]);
    await service.findByCustomerId('01JQZ8K9M2N3P4Q5R6S7T8U9V0');
    expect(databaseService.query).toHaveBeenCalledWith(
      'SELECT * FROM customer WHERE customer_id = $1',
      ['01JQZ8K9M2N3P4Q5R6S7T8U9V0'],
    );
  });

  it('should call database query for findByEmail', async () => {
    databaseService.query.mockResolvedValue([mockCustomer]);
    await service.findByEmail('joao.silva@email.com');
    expect(databaseService.query).toHaveBeenCalledWith(
      'SELECT * FROM customer WHERE email = $1',
      ['joao.silva@email.com'],
    );
  });

  it('should handle update with last_name field', async () => {
    databaseService.query.mockResolvedValueOnce([mockCustomer]);
    databaseService.query.mockResolvedValueOnce(undefined);
    databaseService.query.mockResolvedValueOnce([mockCustomer]);
    await service.update(1, { last_name: 'Updated' });
    expect(databaseService.query).toHaveBeenCalled();
  });

  it('should handle update with email field', async () => {
    databaseService.query.mockResolvedValueOnce([mockCustomer]);
    databaseService.query.mockResolvedValueOnce(undefined);
    databaseService.query.mockResolvedValueOnce([mockCustomer]);
    await service.update(1, { email: 'new@email.com' });
    expect(databaseService.query).toHaveBeenCalled();
  });

  it('should handle update with all fields', async () => {
    databaseService.query.mockResolvedValueOnce([mockCustomer]);
    databaseService.query.mockResolvedValueOnce(undefined);
    databaseService.query.mockResolvedValueOnce([mockCustomer]);
    await service.update(1, {
      first_name: 'Updated',
      last_name: 'Updated',
      email: 'updated@email.com',
      phone_number: '+55 11 88888-8888',
      date_of_birth: new Date('1995-01-01'),
    });
    expect(databaseService.query).toHaveBeenCalled();
  });

  it('should generate ULID', () => {
    const ulid1 = (service as any).generateUlid();
    const ulid2 = (service as any).generateUlid();
    expect(ulid1).toBeDefined();
    expect(ulid2).toBeDefined();
    expect(ulid1).not.toBe(ulid2);
    expect(typeof ulid1).toBe('string');
  });

  it('should return original customer when no updates provided', async () => {
    databaseService.query.mockResolvedValueOnce([mockCustomer]);
    const result = await service.update(1, {});
    expect(result).toEqual(mockCustomer);
    expect(databaseService.query).toHaveBeenCalledTimes(1);
  });

  it('should return null when findByCustomerId finds no customer', async () => {
    databaseService.query.mockResolvedValue([]);
    const result = await service.findByCustomerId('non-existent');
    expect(result).toBeNull();
  });

  it('should return null when findByEmail finds no customer', async () => {
    databaseService.query.mockResolvedValue([]);
    const result = await service.findByEmail('non-existent@email.com');
    expect(result).toBeNull();
  });
});
