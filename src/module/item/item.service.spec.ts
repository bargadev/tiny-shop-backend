import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../../database/database.service';
import { Item, ItemService } from './item.service';

describe('ItemService', () => {
  let service: ItemService;
  let databaseService: jest.Mocked<DatabaseService>;

  const mockItem: Item = {
    id: 1,
    item_id: '01JQZ9K1M2N3P4Q5R6S7T8U9V0',
    name: 'Notebook Dell Inspiron 15',
    description: 'Notebook Dell Inspiron 15 com processador Intel Core i5',
    sku: 'NB-DELL-I15-001',
    price: 3499.99,
    quantity_available: 15,
    category: 'Eletrônicos',
    created_at: new Date('2024-01-01T00:00:00Z'),
    updated_at: new Date('2024-01-01T00:00:00Z'),
  };

  beforeEach(async () => {
    const mockDatabaseService = {
      query: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
    databaseService = module.get(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call database query for findAll', async () => {
    databaseService.query.mockResolvedValue([mockItem]);
    await service.findAll();
    expect(databaseService.query).toHaveBeenCalledWith('SELECT * FROM item');
  });

  it('should call database query for findOne', async () => {
    databaseService.query.mockResolvedValue([mockItem]);
    await service.findOne(1);
    expect(databaseService.query).toHaveBeenCalledWith(
      'SELECT * FROM item WHERE id = $1',
      [1],
    );
  });

  it('should throw NotFoundException when item not found', async () => {
    databaseService.query.mockResolvedValue([]);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should call database query for create', async () => {
    databaseService.query.mockResolvedValueOnce(undefined);
    databaseService.query.mockResolvedValueOnce([mockItem]);
    await service.create({
      name: 'Notebook Dell Inspiron 15',
      description: 'Notebook Dell Inspiron 15 com processador Intel Core i5',
      sku: 'NB-DELL-I15-001',
      price: 3499.99,
      quantity_available: 15,
      category: 'Eletrônicos',
    });
    expect(databaseService.query).toHaveBeenCalled();
  });

  it('should call database query for update', async () => {
    databaseService.query.mockResolvedValueOnce([mockItem]);
    databaseService.query.mockResolvedValueOnce(undefined);
    databaseService.query.mockResolvedValueOnce([mockItem]);
    await service.update(1, { name: 'Updated' });
    expect(databaseService.query).toHaveBeenCalled();
  });

  it('should call database query for remove', async () => {
    databaseService.query.mockResolvedValueOnce([mockItem]);
    databaseService.query.mockResolvedValueOnce(undefined);
    await service.remove(1);
    expect(databaseService.query).toHaveBeenCalled();
  });

  it('should handle update with null description', async () => {
    databaseService.query.mockResolvedValueOnce([mockItem]);
    databaseService.query.mockResolvedValueOnce(undefined);
    databaseService.query.mockResolvedValueOnce([mockItem]);
    await service.update(1, { description: null });
    expect(databaseService.query).toHaveBeenCalled();
  });

  it('should call database query for findByItemId', async () => {
    databaseService.query.mockResolvedValue([mockItem]);
    await service.findByItemId('01JQZ9K1M2N3P4Q5R6S7T8U9V0');
    expect(databaseService.query).toHaveBeenCalledWith(
      'SELECT * FROM item WHERE item_id = $1',
      ['01JQZ9K1M2N3P4Q5R6S7T8U9V0'],
    );
  });

  it('should call database query for findBySku', async () => {
    databaseService.query.mockResolvedValue([mockItem]);
    await service.findBySku('NB-DELL-I15-001');
    expect(databaseService.query).toHaveBeenCalledWith(
      'SELECT * FROM item WHERE sku = $1',
      ['NB-DELL-I15-001'],
    );
  });

  it('should call database query for findByCategory', async () => {
    databaseService.query.mockResolvedValue([mockItem]);
    await service.findByCategory('Eletrônicos');
    expect(databaseService.query).toHaveBeenCalledWith(
      'SELECT * FROM item WHERE category = $1',
      ['Eletrônicos'],
    );
  });

  it('should handle update with sku field', async () => {
    databaseService.query.mockResolvedValueOnce([mockItem]);
    databaseService.query.mockResolvedValueOnce(undefined);
    databaseService.query.mockResolvedValueOnce([mockItem]);
    await service.update(1, { sku: 'NEW-SKU-001' });
    expect(databaseService.query).toHaveBeenCalled();
  });

  it('should handle update with price field', async () => {
    databaseService.query.mockResolvedValueOnce([mockItem]);
    databaseService.query.mockResolvedValueOnce(undefined);
    databaseService.query.mockResolvedValueOnce([mockItem]);
    await service.update(1, { price: 3999.99 });
    expect(databaseService.query).toHaveBeenCalled();
  });

  it('should handle update with quantity_available field', async () => {
    databaseService.query.mockResolvedValueOnce([mockItem]);
    databaseService.query.mockResolvedValueOnce(undefined);
    databaseService.query.mockResolvedValueOnce([mockItem]);
    await service.update(1, { quantity_available: 20 });
    expect(databaseService.query).toHaveBeenCalled();
  });

  it('should handle update with category field', async () => {
    databaseService.query.mockResolvedValueOnce([mockItem]);
    databaseService.query.mockResolvedValueOnce(undefined);
    databaseService.query.mockResolvedValueOnce([mockItem]);
    await service.update(1, { category: 'Computadores' });
    expect(databaseService.query).toHaveBeenCalled();
  });

  it('should handle update with all fields', async () => {
    databaseService.query.mockResolvedValueOnce([mockItem]);
    databaseService.query.mockResolvedValueOnce(undefined);
    databaseService.query.mockResolvedValueOnce([mockItem]);
    await service.update(1, {
      name: 'Updated Name',
      description: 'Updated Description',
      sku: 'NEW-SKU-002',
      price: 4999.99,
      quantity_available: 25,
      category: 'Notebooks',
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

  it('should return original item when no updates provided', async () => {
    databaseService.query.mockResolvedValueOnce([mockItem]);
    const result = await service.update(1, {});
    expect(result).toEqual(mockItem);
    expect(databaseService.query).toHaveBeenCalledTimes(1);
  });

  it('should return null when findByItemId finds no item', async () => {
    databaseService.query.mockResolvedValue([]);
    const result = await service.findByItemId('non-existent');
    expect(result).toBeNull();
  });

  it('should return null when findBySku finds no item', async () => {
    databaseService.query.mockResolvedValue([]);
    const result = await service.findBySku('non-existent-sku');
    expect(result).toBeNull();
  });

  it('should create item with default quantity_available', async () => {
    databaseService.query.mockResolvedValueOnce(undefined);
    databaseService.query.mockResolvedValueOnce([mockItem]);
    await service.create({
      name: 'Test Item',
      sku: 'TEST-SKU-001',
      price: 100.0,
      category: 'Test',
    });
    expect(databaseService.query).toHaveBeenCalled();
  });
});
