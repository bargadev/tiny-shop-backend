import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppDataSource } from './data-source';

@Injectable()
export class DatabaseService {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = AppDataSource;
  }

  async getDataSource(): Promise<DataSource> {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
    return this.dataSource;
  }

  async query(sql: string, parameters?: any[]): Promise<any> {
    const dataSource = await this.getDataSource();
    return dataSource.query(sql, parameters);
  }
}
