import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../../database/database.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let databaseService: jest.Mocked<DatabaseService>;

  beforeEach(async () => {
    const mockDatabaseService = {
      query: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    databaseService = module.get(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call database query for findAll', async () => {
    databaseService.query.mockResolvedValue([]);
    await service.findAll();
    expect(databaseService.query).toHaveBeenCalledWith('SELECT * FROM "user"');
  });

  it('should call database query for findOne', async () => {
    databaseService.query.mockResolvedValue([{ id: 1 }]);
    await service.findOne(1);
    expect(databaseService.query).toHaveBeenCalledWith(
      'SELECT * FROM "user" WHERE id = $1',
      [1],
    );
  });

  it('should call database query for create', async () => {
    databaseService.query.mockResolvedValueOnce(undefined);
    databaseService.query.mockResolvedValueOnce([{ id: 1 }]);
    await service.create({
      fullname: 'Test',
      email: 'test@test.com',
      password: 'password',
    });
    expect(databaseService.query).toHaveBeenCalled();
  });

  it('should call database query for update', async () => {
    databaseService.query.mockResolvedValueOnce([{ id: 1 }]);
    databaseService.query.mockResolvedValueOnce(undefined);
    databaseService.query.mockResolvedValueOnce([{ id: 1 }]);
    await service.update(1, { fullname: 'Updated' });
    expect(databaseService.query).toHaveBeenCalled();
  });

  it('should call database query for remove', async () => {
    databaseService.query.mockResolvedValueOnce([{ id: 1 }]);
    databaseService.query.mockResolvedValueOnce(undefined);
    await service.remove(1);
    expect(databaseService.query).toHaveBeenCalled();
  });

  it('should call database query for findByUserId', async () => {
    databaseService.query.mockResolvedValue([{ id: 1 }]);
    await service.findByUserId('user123');
    expect(databaseService.query).toHaveBeenCalledWith(
      'SELECT * FROM "user" WHERE user_id = $1',
      ['user123'],
    );
  });

  it('should handle update with all fields', async () => {
    databaseService.query.mockResolvedValueOnce([{ id: 1 }]);
    databaseService.query.mockResolvedValueOnce(undefined);
    databaseService.query.mockResolvedValueOnce([{ id: 1 }]);
    await service.update(1, {
      fullname: 'Updated',
      email: 'updated@email.com',
      password: 'newpassword',
    });
    expect(databaseService.query).toHaveBeenCalled();
  });

  it('should handle update with partial fields', async () => {
    databaseService.query.mockResolvedValueOnce([{ id: 1 }]);
    databaseService.query.mockResolvedValueOnce(undefined);
    databaseService.query.mockResolvedValueOnce([{ id: 1 }]);
    await service.update(1, { fullname: 'Updated' });
    expect(databaseService.query).toHaveBeenCalled();
  });

  it('should handle update with email field', async () => {
    databaseService.query.mockResolvedValueOnce([{ id: 1 }]);
    databaseService.query.mockResolvedValueOnce(undefined);
    databaseService.query.mockResolvedValueOnce([{ id: 1 }]);
    await service.update(1, { email: 'new@email.com' });
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

  it('should throw NotFoundException when user not found', async () => {
    databaseService.query.mockResolvedValue([]);
    await expect(service.findOne(999)).rejects.toThrow(
      'User with ID 999 not found',
    );
  });

  it('should return original user when no updates provided', async () => {
    databaseService.query.mockResolvedValueOnce([{ id: 1 }]);
    const result = await service.update(1, {});
    expect(result).toEqual({ id: 1 });
    expect(databaseService.query).toHaveBeenCalledTimes(1);
  });

  it('should return null when findByUserId finds no user', async () => {
    databaseService.query.mockResolvedValue([]);
    const result = await service.findByUserId('non-existent');
    expect(result).toBeNull();
  });
});
