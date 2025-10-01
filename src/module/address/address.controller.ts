import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  Address,
  AddressService,
  CreateAddressDto,
  UpdateAddressDto,
} from './address.service';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(@Body() createAddressDto: CreateAddressDto): Promise<Address> {
    return this.addressService.create(createAddressDto);
  }

  @Get()
  async findAll(): Promise<Address[]> {
    return this.addressService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Address> {
    return this.addressService.findOne(id);
  }

  @Get('customer/:customerId')
  async findByCustomerId(
    @Param('customerId') customerId: string,
  ): Promise<Address[]> {
    return this.addressService.findByCustomerId(customerId);
  }

  @Get('customer/:customerId/primary')
  async findPrimaryByCustomerId(
    @Param('customerId') customerId: string,
  ): Promise<Address | null> {
    return this.addressService.findPrimaryByCustomerId(customerId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    return this.addressService.update(id, updateAddressDto);
  }

  @Patch(':id/set-primary')
  @HttpCode(HttpStatus.OK)
  async setAsPrimary(@Param('id', ParseIntPipe) id: number): Promise<Address> {
    return this.addressService.setAsPrimary(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.addressService.remove(id);
  }
}
