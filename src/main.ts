import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Allow all origins (for development only; be more restrictive in production)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Allow all standard HTTP methods
    // allowedHeaders: 'Content-Type, Authorization', // Allow specific headers
  });
  await app.listen(3001);
}
bootstrap();
