import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

export interface Customer {
  id: number;
  customer_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  date_of_birth?: Date;
  created_at: Date;
  updated_at: Date;
}

const TABLE = 'customer';

@Injectable()
export class CustomerService {
  constructor(private databaseService: DatabaseService) {}

  async findAll(): Promise<Customer[]> {
    return this.databaseService.query(`SELECT * FROM ${TABLE}`);
  }

  async findOne(id: number): Promise<Customer> {
    const customers = await this.databaseService.query(
      `SELECT * FROM ${TABLE} WHERE id = $1`,
      [id],
    );

    if (customers.length === 0) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customers[0];
  }

  async findByCustomerId(customerId: string): Promise<Customer | null> {
    const customers = await this.databaseService.query(
      `SELECT * FROM ${TABLE} WHERE customer_id = $1`,
      [customerId],
    );

    return customers.length > 0 ? customers[0] : null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customers = await this.databaseService.query(
      `SELECT * FROM ${TABLE} WHERE email = $1`,
      [email],
    );

    return customers.length > 0 ? customers[0] : null;
  }

  async create(createCustomerDto: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    date_of_birth?: Date;
  }): Promise<Customer> {
    const newCustomerUlid = this.generateUlid();

    const insertCustomerQuery = `
      INSERT INTO ${TABLE} (
        customer_id, first_name, last_name, email, phone_number, date_of_birth
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `;

    await this.databaseService.query(insertCustomerQuery, [
      newCustomerUlid,
      createCustomerDto.first_name,
      createCustomerDto.last_name,
      createCustomerDto.email,
      createCustomerDto.phone_number || null,
      createCustomerDto.date_of_birth || null,
    ]);

    return this.findByCustomerId(newCustomerUlid);
  }

  async update(
    id: number,
    updateCustomerDto: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone_number?: string;
      date_of_birth?: Date;
    },
  ): Promise<Customer> {
    const customer = await this.findOne(id);

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (updateCustomerDto.first_name) {
      updates.push(`first_name = $${paramCount++}`);
      values.push(updateCustomerDto.first_name);
    }

    if (updateCustomerDto.last_name) {
      updates.push(`last_name = $${paramCount++}`);
      values.push(updateCustomerDto.last_name);
    }

    if (updateCustomerDto.email) {
      updates.push(`email = $${paramCount++}`);
      values.push(updateCustomerDto.email);
    }

    if (updateCustomerDto.phone_number !== undefined) {
      updates.push(`phone_number = $${paramCount++}`);
      values.push(updateCustomerDto.phone_number);
    }

    if (updateCustomerDto.date_of_birth !== undefined) {
      updates.push(`date_of_birth = $${paramCount++}`);
      values.push(updateCustomerDto.date_of_birth);
    }

    if (updates.length === 0) {
      return customer;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    await this.databaseService.query(
      `UPDATE ${TABLE} SET ${updates.join(', ')} WHERE id = $${paramCount}`,
      values,
    );

    return this.findOne(id);
  }

  async remove(id: number): Promise<Customer> {
    const customer = await this.findOne(id);
    await this.databaseService.query(`DELETE FROM ${TABLE} WHERE id = $1`, [
      id,
    ]);
    return customer;
  }

  private generateUlid(): string {
    // Implementação simples de ULID - em produção use uma biblioteca como 'ulid'
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
