import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Address, CreateAddressDto, UpdateAddressDto } from './address.dto';

const TABLE = 'address';
@Injectable()
export class AddressService {
  constructor(private databaseService: DatabaseService) {}

  async findAll(): Promise<Address[]> {
    return this.databaseService.query(
      `SELECT * FROM ${TABLE} ORDER BY "createdAt" DESC`,
    );
  }

  async findOne(id: number): Promise<Address> {
    const addresses = await this.databaseService.query(
      `SELECT * FROM ${TABLE} WHERE id = $1`,
      [id],
    );

    if (addresses.length === 0) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return addresses[0];
  }

  async findByCustomerId(customerId: string): Promise<Address[]> {
    const customers = await this.databaseService.query(
      `SELECT "customerId" FROM customer WHERE "customerId" = $1`,
      [customerId],
    );

    if (customers.length === 0) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    return this.databaseService.query(
      `SELECT * FROM ${TABLE} WHERE "customerId" = $1 ORDER BY "isPrimary" DESC, "createdAt" ASC`,
      [customerId],
    );
  }

  async findPrimaryByCustomerId(customerId: string): Promise<Address | null> {
    const customers = await this.databaseService.query(
      `SELECT "customerId" FROM customer WHERE "customerId" = $1`,
      [customerId],
    );

    if (customers.length === 0) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    const addresses = await this.databaseService.query(
      `SELECT * FROM ${TABLE} WHERE "customerId" = $1 AND "isPrimary" = TRUE`,
      [customerId],
    );

    return addresses.length > 0 ? addresses[0] : null;
  }

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const customers = await this.databaseService.query(
      `SELECT "customerId" FROM customer WHERE "customerId" = $1`,
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
        `UPDATE ${TABLE} SET "isPrimary" = FALSE WHERE "customerId" = $1 AND "isPrimary" = TRUE`,
        [createAddressDto.customerId],
      );
    }

    const newAddressUlid = this.generateUlid();

    const insertAddressQuery = `
      INSERT INTO ${TABLE} (
        "addressId", "customerId", street, number, complement, neighborhood, city, state, "postalCode", country, "isPrimary"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const result = await this.databaseService.query(insertAddressQuery, [
      newAddressUlid,
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

    if (updateAddressDto.isPrimary === true) {
      await this.databaseService.query(
        `UPDATE ${TABLE} SET "isPrimary" = FALSE WHERE "customerId" = $1 AND "isPrimary" = TRUE`,
        [address.customerId],
      );
    }

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
      updates.push(`"postalCode" = $${paramCount++}`);
      values.push(updateAddressDto.postalCode);
    }

    if (updateAddressDto.country) {
      updates.push(`country = $${paramCount++}`);
      values.push(updateAddressDto.country);
    }

    if (updateAddressDto.isPrimary !== undefined) {
      updates.push(`"isPrimary" = $${paramCount++}`);
      values.push(updateAddressDto.isPrimary);
    }

    if (updates.length === 0) {
      return address;
    }

    updates.push(`"updatedAt" = CURRENT_TIMESTAMP`);
    values.push(id);

    await this.databaseService.query(
      `UPDATE ${TABLE} SET ${updates.join(', ')} WHERE id = $${paramCount}`,
      values,
    );

    return this.findOne(id);
  }

  async remove(id: number): Promise<Address> {
    const address = await this.findOne(id);
    await this.databaseService.query(`DELETE FROM ${TABLE} WHERE id = $1`, [
      id,
    ]);
    return address;
  }

  async setAsPrimary(id: number): Promise<Address> {
    const address = await this.findOne(id);

    await this.databaseService.query(
      `UPDATE ${TABLE} SET "isPrimary" = FALSE WHERE "customerId" = $1 AND "isPrimary" = TRUE`,
      [address.customerId],
    );

    await this.databaseService.query(
      `UPDATE ${TABLE} SET "isPrimary" = TRUE, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $1`,
      [id],
    );

    return this.findOne(id);
  }

  private generateUlid(): string {
    // Implementação simples de ULID - em produção use uma biblioteca como 'ulid'
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
