import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: jest.Mocked<UserService>;

  beforeEach(async () => {
    const mockUserService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service findAll', async () => {
    service.findAll.mockResolvedValue([]);
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call service findOne', async () => {
    service.findOne.mockResolvedValue({ id: 1 } as any);
    await controller.findOne('1');
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should call service create', async () => {
    service.create.mockResolvedValue({ id: 1 } as any);
    await controller.create({
      fullname: 'Test',
      email: 'test@test.com',
      password: 'password',
    });
    expect(service.create).toHaveBeenCalled();
  });

  it('should call service update', async () => {
    service.update.mockResolvedValue({ id: 1 } as any);
    await controller.update('1', { fullname: 'Updated' });
    expect(service.update).toHaveBeenCalledWith(1, { fullname: 'Updated' });
  });

  it('should call service remove', async () => {
    service.remove.mockResolvedValue({ id: 1 } as any);
    await controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
