import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

export interface Address {
  id: number;
  customer_id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_primary: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateAddressDto {
  customerId: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  isPrimary?: boolean;
}

export interface UpdateAddressDto {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isPrimary?: boolean;
}

@Injectable()
export class AddressService {
  constructor(private databaseService: DatabaseService) {}

  async findAll(): Promise<Address[]> {
    return this.databaseService.query(
      'SELECT * FROM addresses ORDER BY created_at DESC',
    );
  }

  async findOne(id: number): Promise<Address> {
    const addresses = await this.databaseService.query(
      'SELECT * FROM addresses WHERE id = $1',
      [id],
    );

    if (addresses.length === 0) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return addresses[0];
  }

  async findByCustomerId(customerId: string): Promise<Address[]> {
    // First verify customer exists
    const customers = await this.databaseService.query(
      'SELECT customer_id FROM customer WHERE customer_id = $1',
      [customerId],
    );

    if (customers.length === 0) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    return this.databaseService.query(
      'SELECT * FROM addresses WHERE customer_id = $1 ORDER BY is_primary DESC, created_at ASC',
      [customerId],
    );
  }

  async findPrimaryByCustomerId(customerId: string): Promise<Address | null> {
    // First verify customer exists
    const customers = await this.databaseService.query(
      'SELECT customer_id FROM customer WHERE customer_id = $1',
      [customerId],
    );

    if (customers.length === 0) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    const addresses = await this.databaseService.query(
      'SELECT * FROM addresses WHERE customer_id = $1 AND is_primary = TRUE',
      [customerId],
    );

    return addresses.length > 0 ? addresses[0] : null;
  }

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    // Verify customer exists
    const customers = await this.databaseService.query(
      'SELECT customer_id FROM customer WHERE customer_id = $1',
      [createAddressDto.customerId],
    );

    if (customers.length === 0) {
      throw new NotFoundException(
        `Customer with ID ${createAddressDto.customerId} not found`,
      );
    }

    // If this address is marked as primary, unset other primary addresses
    if (createAddressDto.isPrimary) {
      await this.databaseService.query(
        'UPDATE addresses SET is_primary = FALSE WHERE customer_id = $1 AND is_primary = TRUE',
        [createAddressDto.customerId],
      );
    }

    const insertAddressQuery = `
      INSERT INTO addresses (
        customer_id, street, number, complement, neighborhood, city, state, postal_code, country, is_primary
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const result = await this.databaseService.query(insertAddressQuery, [
      createAddressDto.customerId,
      createAddressDto.street,
      createAddressDto.number,
      createAddressDto.complement || null,
      createAddressDto.neighborhood,
      createAddressDto.city,
      createAddressDto.state,
      createAddressDto.postalCode,
      createAddressDto.country || 'Brasil',
      createAddressDto.isPrimary || false,
    ]);

    return result[0];
  }

  async update(
    id: number,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const address = await this.findOne(id);

    // If setting this address as primary, unset other primary addresses for this customer
    if (updateAddressDto.isPrimary === true) {
      await this.databaseService.query(
        'UPDATE addresses SET is_primary = FALSE WHERE customer_id = $1 AND is_primary = TRUE',
        [address.customer_id],
      );
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (updateAddressDto.street) {
      updates.push(`street = $${paramCount++}`);
      values.push(updateAddressDto.street);
    }

    if (updateAddressDto.number) {
      updates.push(`number = $${paramCount++}`);
      values.push(updateAddressDto.number);
    }

    if (updateAddressDto.complement !== undefined) {
      updates.push(`complement = $${paramCount++}`);
      values.push(updateAddressDto.complement);
    }

    if (updateAddressDto.neighborhood) {
      updates.push(`neighborhood = $${paramCount++}`);
      values.push(updateAddressDto.neighborhood);
    }

    if (updateAddressDto.city) {
      updates.push(`city = $${paramCount++}`);
      values.push(updateAddressDto.city);
    }

    if (updateAddressDto.state) {
      updates.push(`state = $${paramCount++}`);
      values.push(updateAddressDto.state);
    }

    if (updateAddressDto.postalCode) {
      updates.push(`postal_code = $${paramCount++}`);
      values.push(updateAddressDto.postalCode);
    }

    if (updateAddressDto.country) {
      updates.push(`country = $${paramCount++}`);
      values.push(updateAddressDto.country);
    }

    if (updateAddressDto.isPrimary !== undefined) {
      updates.push(`is_primary = $${paramCount++}`);
      values.push(updateAddressDto.isPrimary);
    }

    if (updates.length === 0) {
      return address;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    await this.databaseService.query(
      `UPDATE addresses SET ${updates.join(', ')} WHERE id = $${paramCount}`,
      values,
    );

    return this.findOne(id);
  }

  async remove(id: number): Promise<Address> {
    const address = await this.findOne(id);
    await this.databaseService.query('DELETE FROM addresses WHERE id = $1', [
      id,
    ]);
    return address;
  }

  async setAsPrimary(id: number): Promise<Address> {
    const address = await this.findOne(id);

    // Unset other primary addresses for this customer
    await this.databaseService.query(
      'UPDATE addresses SET is_primary = FALSE WHERE customer_id = $1 AND is_primary = TRUE',
      [address.customer_id],
    );

    // Set this address as primary
    await this.databaseService.query(
      'UPDATE addresses SET is_primary = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id],
    );

    return this.findOne(id);
  }
}
