import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Customer, CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async findAll(): Promise<Customer[]> {
    return this.customerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Customer> {
    return this.customerService.findOne(+id);
  }

  @Post()
  async create(
    @Body()
    createCustomerDto: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber?: string;
      dateOfBirth?: Date;
    },
  ): Promise<Customer> {
    return this.customerService.create(createCustomerDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateCustomerDto: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
      dateOfBirth?: Date;
    },
  ): Promise<Customer> {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Customer> {
    return this.customerService.remove(+id);
  }
}
