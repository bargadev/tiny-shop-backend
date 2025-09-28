import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(private readonly dataSource: DataSource) {}

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
