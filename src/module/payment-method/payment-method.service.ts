import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

export interface PaymentMethod {
  id: number;
  paymentMethodId: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TABLE = 'payment_method';

@Injectable()
export class PaymentMethodService {
  constructor(private databaseService: DatabaseService) {}

  async findAll(): Promise<PaymentMethod[]> {
    return this.databaseService.query(
      `SELECT * FROM ${TABLE} WHERE "isActive" = true ORDER BY id`,
    );
  }
}
