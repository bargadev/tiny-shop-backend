import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderStatusDto } from './order.dto';
import { Order, OrderWithDetails } from './order.model';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  async findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get(':orderId')
  async findOne(@Param('orderId') orderId: string): Promise<Order | null> {
    return this.orderService.findOne(orderId);
  }

  @Get(':orderId/details')
  async getOrderWithDetails(
    @Param('orderId') orderId: string,
  ): Promise<OrderWithDetails | null> {
    return this.orderService.getOrderWithDetails(orderId);
  }

  @Get('customer/:customerId')
  async findByCustomerId(
    @Param('customerId') customerId: string,
  ): Promise<Order[]> {
    return this.orderService.findByCustomerId(customerId);
  }

  @Patch(':orderId/status')
  async updateStatus(
    @Param('orderId') orderId: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    return this.orderService.updateStatus(orderId, updateOrderStatusDto.status);
  }

  @Put(':orderId/cancel')
  async cancelOrder(@Param('orderId') orderId: string): Promise<Order> {
    return this.orderService.cancelOrder(orderId);
  }
}
