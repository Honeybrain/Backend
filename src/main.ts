import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { grpcClientOptions } from './grpc-client.options';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './_utils/config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>(grpcClientOptions);

  app
    .setGlobalPrefix('api')
    .useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    .enableCors();

  const config = new DocumentBuilder()
    .setTitle('Honeybrain')
    .setDescription('The Honeybrain API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document);

  const configService = app.get(ConfigService<EnvironmentVariables, true>);

  await app.listen(configService.get('PORT'));
  await app.startAllMicroservices();
  console.log('Launch on port ', await app.getUrl());
}
void bootstrap();
