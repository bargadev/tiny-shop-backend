import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../../database/database.service';
import { Address } from './address.dto';
import { AddressService } from './address.service';

describe('AddressService', () => {
  let service: AddressService;

  const mockAddress: Address = {
    id: 1,
    customer_id: '01JQZ8K9M2N3P4Q5R6S7T8U9V0',
    street: 'Rua das Flores',
    number: '123',
    complement: 'Apto 45',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    postal_code: '01234-567',
    country: 'Brasil',
    is_primary: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockCustomer = {
    id: 1,
    customer_id: '01JQZ8K9M2N3P4Q5R6S7T8U9V0',
    first_name: 'João',
    last_name: 'Silva',
    email: 'joao@example.com',
    phone_number: '11999999999',
    date_of_birth: new Date('1990-01-01'),
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockDatabaseService = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of addresses', async () => {
      const addresses = [mockAddress];
      mockDatabaseService.query.mockResolvedValue(addresses);

      const result = await service.findAll();
      expect(result).toEqual(addresses);
      expect(mockDatabaseService.query).toHaveBeenCalledWith(
        'SELECT * FROM addresses ORDER BY created_at DESC',
      );
    });
  });

  describe('findOne', () => {
    it('should return an address by id', async () => {
      mockDatabaseService.query.mockResolvedValue([mockAddress]);

      const result = await service.findOne(1);
      expect(result).toEqual(mockAddress);
      expect(mockDatabaseService.query).toHaveBeenCalledWith(
        'SELECT * FROM addresses WHERE id = $1',
        [1],
      );
    });

    it('should throw NotFoundException when address not found', async () => {
      mockDatabaseService.query.mockResolvedValue([]);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new address', async () => {
      const createAddressDto = {
        customerId: '01JQZ8K9M2N3P4Q5R6S7T8U9V0',
        street: 'Rua das Flores',
        number: '123',
        complement: 'Apto 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01234-567',
        country: 'Brasil',
        isPrimary: true,
      };

      mockDatabaseService.query
        .mockResolvedValueOnce([mockCustomer]) // Customer exists check
        .mockResolvedValueOnce({}) // Update other primary addresses
        .mockResolvedValueOnce([mockAddress]); // Insert new address

      const result = await service.create(createAddressDto);
      expect(result).toEqual(mockAddress);
      expect(mockDatabaseService.query).toHaveBeenCalledWith(
        'SELECT customer_id FROM customer WHERE customer_id = $1',
        ['01JQZ8K9M2N3P4Q5R6S7T8U9V0'],
      );
    });

    it('should throw NotFoundException when customer not found', async () => {
      const createAddressDto = {
        customerId: '01JQZ8K9M2N3P4Q5R6S7T8U9V9',
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01234-567',
      };

      mockDatabaseService.query.mockResolvedValue([]);

      await expect(service.create(createAddressDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an address', async () => {
      const updateDto = { street: 'Nova Rua' };

      mockDatabaseService.query
        .mockResolvedValueOnce([mockAddress]) // findOne call
        .mockResolvedValueOnce({}) // update call
        .mockResolvedValueOnce([{ ...mockAddress, ...updateDto }]); // findOne after update

      await service.update(1, updateDto);
      expect(mockDatabaseService.query).toHaveBeenCalledWith(
        'UPDATE addresses SET street = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        ['Nova Rua', 1],
      );
    });
  });

  describe('remove', () => {
    it('should remove an address', async () => {
      mockDatabaseService.query
        .mockResolvedValueOnce([mockAddress]) // findOne call
        .mockResolvedValueOnce({}); // delete call

      const result = await service.remove(1);
      expect(result).toEqual(mockAddress);
      expect(mockDatabaseService.query).toHaveBeenCalledWith(
        'DELETE FROM addresses WHERE id = $1',
        [1],
      );
    });
  });
});
