import { Controller, Get } from '@nestjs/common';
import { PaymentMethod, PaymentMethodService } from './payment-method.service';

@Controller('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Get()
  async findAll(): Promise<PaymentMethod[]> {
    return this.paymentMethodService.findAll();
  }
}
