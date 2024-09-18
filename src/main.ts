import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: '*', // Allow all origins (for development only; be more restrictive in production)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Allow all standard HTTP methods
    // allowedHeaders: 'Content-Type, Authorization', // Allow specific headers
  });
  await app.listen(configService.get('PORT') | 3001);
}
bootstrap();
