import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

export interface PaymentMethod {
  id: number;
  payment_method_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const TABLE = 'payment_method';

@Injectable()
export class PaymentMethodService {
  constructor(private databaseService: DatabaseService) {}

  async findAll(): Promise<PaymentMethod[]> {
    return this.databaseService.query(
      `SELECT * FROM ${TABLE} WHERE is_active = true ORDER BY id`,
    );
  }
}
