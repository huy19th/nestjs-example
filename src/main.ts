import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule } from '@nestjs/swagger';
import { documentConfig, documentOptions, setupOptions } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  );
  const configService = app.get(ConfigService);
  const port = configService.get('port');

  const document = SwaggerModule.createDocument(app, documentConfig, documentOptions);
  SwaggerModule.setup('api', app, document, setupOptions);

  app.enableCors();
  app.use(helmet());
  app.useBodyParser('application/json', { bodyLimit: 10 * 1000 * 1024 });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
}
bootstrap();