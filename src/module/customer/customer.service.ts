import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

export interface Customer {
  id: number;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  createdAt: Date;
  updatedAt: Date;
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
      `SELECT * FROM ${TABLE} WHERE "customerId" = $1`,
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
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
  }): Promise<Customer> {
    const newCustomerUlid = this.generateUlid();

    const insertCustomerQuery = `
      INSERT INTO ${TABLE} (
        "customerId", "firstName", "lastName", email, "phoneNumber", "dateOfBirth"
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `;

    await this.databaseService.query(insertCustomerQuery, [
      newCustomerUlid,
      createCustomerDto.firstName,
      createCustomerDto.lastName,
      createCustomerDto.email,
      createCustomerDto.phoneNumber || null,
      createCustomerDto.dateOfBirth || null,
    ]);

    return this.findByCustomerId(newCustomerUlid);
  }

  async update(
    id: number,
    updateCustomerDto: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
      dateOfBirth?: Date;
    },
  ): Promise<Customer> {
    const customer = await this.findOne(id);

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (updateCustomerDto.firstName) {
      updates.push(`"firstName" = $${paramCount++}`);
      values.push(updateCustomerDto.firstName);
    }

    if (updateCustomerDto.lastName) {
      updates.push(`"lastName" = $${paramCount++}`);
      values.push(updateCustomerDto.lastName);
    }

    if (updateCustomerDto.email) {
      updates.push(`email = $${paramCount++}`);
      values.push(updateCustomerDto.email);
    }

    if (updateCustomerDto.phoneNumber !== undefined) {
      updates.push(`"phoneNumber" = $${paramCount++}`);
      values.push(updateCustomerDto.phoneNumber);
    }

    if (updateCustomerDto.dateOfBirth !== undefined) {
      updates.push(`"dateOfBirth" = $${paramCount++}`);
      values.push(updateCustomerDto.dateOfBirth);
    }

    if (updates.length === 0) {
      return customer;
    }

    updates.push(`"updatedAt" = CURRENT_TIMESTAMP`);
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
