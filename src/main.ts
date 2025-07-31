// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common'; // <--- ¡AÑADE Logger AQUÍ!

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // --- ¡AÑADE ESTA LÍNEA PARA MÁS LOGS! ---
    logger: ['error', 'warn', 'log', 'verbose', 'debug'],
  });

  app.enableCors({
    origin: '*', // Permite solicitudes desde cualquier origen. Ajusta en producción.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no están en el DTO
      forbidNonWhitelisted: true, // Lanza un error si hay propiedades no permitidas
      transform: true, // Transforma los payloads a instancias de DTO
    }),
  );

  await app.listen(3000);
  // --- ¡CAMBIA console.log por Logger.log para usar el logger de NestJS! ---
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
