import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Customer, CustomersService } from './customers.service';

@Controller('customer')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async findAll(): Promise<Customer[]> {
    return this.customersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Customer> {
    return this.customersService.findOne(+id);
  }

  @Post()
  async create(
    @Body()
    createCustomerDto: {
      first_name: string;
      last_name: string;
      email: string;
      phone_number?: string;
      date_of_birth?: Date;
    },
  ): Promise<Customer> {
    return this.customersService.create(createCustomerDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateCustomerDto: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone_number?: string;
      date_of_birth?: Date;
    },
  ): Promise<Customer> {
    return this.customersService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Customer> {
    return this.customersService.remove(+id);
  }
}
