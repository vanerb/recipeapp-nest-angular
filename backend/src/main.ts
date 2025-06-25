import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para que el frontend pueda hacer peticiones
  app.enableCors({
    origin: 'http://localhost:4200', // URL de tu frontend (puedes usar '*' para todos pero no es recomendable)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // si usas cookies o auth por sesión
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(3002);
}
bootstrap();
