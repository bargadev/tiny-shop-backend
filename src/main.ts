import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: false, // Don't throw errors for extra properties
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  await app.listen(3000);
}
bootstrap();
