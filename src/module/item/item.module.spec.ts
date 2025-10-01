import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../../database/database.module';
import { ItemController } from './item.controller';
import { ItemModule } from './item.module';
import { ItemService } from './item.service';

describe('ItemModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ItemModule, DatabaseModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have ItemController', () => {
    const controller = module.get<ItemController>(ItemController);
    expect(controller).toBeDefined();
  });

  it('should have ItemService', () => {
    const service = module.get<ItemService>(ItemService);
    expect(service).toBeDefined();
  });
});
