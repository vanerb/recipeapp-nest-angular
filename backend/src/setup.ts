import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { join } from 'path';
import * as express from 'express';

// Configuración compartida entre main.ts y los tests e2e
export function configureApp(app: INestApplication) {
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // Aplica los @Exclude de las entidades (contraseña y correo de los usuarios)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
}
