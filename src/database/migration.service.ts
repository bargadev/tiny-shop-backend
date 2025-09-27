import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class MigrationService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MigrationService.name);

  constructor(private dataSource: DataSource) {}

  async onApplicationBootstrap() {
    try {
      this.logger.log('Aguardando banco de dados estar pronto...');

      // Aguardar um pouco para o banco estar pronto
      await this.sleep(5000);

      this.logger.log('Executando migrations...');

      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }

      await this.dataSource.runMigrations();

      this.logger.log('Migrations executadas com sucesso!');
    } catch (error) {
      this.logger.error('Erro ao executar migrations:', error);
      // Não falha a aplicação se migrations falharem
      this.logger.warn('Continuando sem executar migrations...');
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
