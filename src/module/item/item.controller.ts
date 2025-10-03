import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Item, ItemService } from './item.service';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async findAll(@Query('name') name?: string): Promise<Item[]> {
    if (name) {
      return this.itemService.findByName(name);
    }
    return this.itemService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Item> {
    return this.itemService.findOne(+id);
  }

  @Post()
  async create(
    @Body()
    createItemDto: {
      name: string;
      description?: string;
      sku: string;
      price: number;
      quantity_available?: number;
      category: string;
    },
  ): Promise<Item> {
    return this.itemService.create(createItemDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateItemDto: {
      name?: string;
      description?: string;
      sku?: string;
      price?: number;
      quantity_available?: number;
      category?: string;
    },
  ): Promise<Item> {
    return this.itemService.update(+id, updateItemDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Item> {
    return this.itemService.remove(+id);
  }
}
