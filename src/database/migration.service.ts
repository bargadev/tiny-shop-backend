import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { AppDataSource } from './data-source';

@Injectable()
export class MigrationService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MigrationService.name);

  async onApplicationBootstrap() {
    try {
      this.logger.log('Executando migrations...');

      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }

      await AppDataSource.runMigrations();

      this.logger.log('Migrations executadas com sucesso!');
    } catch (error) {
      this.logger.error('Erro ao executar migrations:', error);
      throw error;
    }
  }
}
