import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export interface User {
  id: number;
  user_id: string;
  fullname: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async findAll(): Promise<User[]> {
    return this.databaseService.query(
      'SELECT * FROM users ORDER BY created_at DESC',
    );
  }

  async findOne(id: number): Promise<User> {
    const users = await this.databaseService.query(
      'SELECT * FROM users WHERE id = $1',
      [id],
    );

    if (users.length === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return users[0];
  }

  async findByUserId(userId: string): Promise<User | null> {
    const users = await this.databaseService.query(
      'SELECT * FROM users WHERE user_id = $1',
      [userId],
    );

    return users.length > 0 ? users[0] : null;
  }

  async create(createUserDto: {
    fullname: string;
    email: string;
    password: string;
  }): Promise<User> {
    const newUserUlid = this.generateUlid();

    await this.databaseService.query(
      'INSERT INTO users (user_id, fullname, email, password) VALUES ($1, $2, $3, $4)',
      [
        newUserUlid,
        createUserDto.fullname,
        createUserDto.email,
        createUserDto.password,
      ],
    );

    return this.findByUserId(newUserUlid);
  }

  async update(
    id: number,
    updateUserDto: { fullname?: string; email?: string; password?: string },
  ): Promise<User> {
    const user = await this.findOne(id);

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (updateUserDto.fullname) {
      updates.push(`fullname = $${paramCount++}`);
      values.push(updateUserDto.fullname);
    }

    if (updateUserDto.email) {
      updates.push(`email = $${paramCount++}`);
      values.push(updateUserDto.email);
    }

    if (updateUserDto.password) {
      updates.push(`password = $${paramCount++}`);
      values.push(updateUserDto.password);
    }

    if (updates.length === 0) {
      return user;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    await this.databaseService.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount}`,
      values,
    );

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.databaseService.query('DELETE FROM users WHERE id = $1', [id]);
  }

  private generateUlid(): string {
    // Implementação simples de ULID - em produção use uma biblioteca como 'ulid'
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
