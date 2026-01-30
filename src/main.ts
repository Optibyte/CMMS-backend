import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express';
import { Server } from 'http';
import * as bodyParser from 'body-parser';
import { urlencoded, json } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import Config from './config/app';
let cachedServer: Server;

async function setupSwagger(app: INestApplication & NestExpressApplication) {
  const options = new DocumentBuilder()
    .setTitle('cmms-apis')
    .setDescription('cmms-apis')
    .setVersion('1.0')
    .addTag('cmms-apis')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
}


async function bootstrap() {
  try {
    console.time('main.app.init')
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);
    const nestApp = await NestFactory.create<NestExpressApplication>(AppModule, adapter,
      {
        logger: ['debug', 'error', 'warn', 'log', 'verbose'],
      });
    nestApp.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }));
    nestApp.use(bodyParser.json({ limit: '50mb' }));
    nestApp.use(json({ limit: '50mb' }));
    nestApp.use(urlencoded({ limit: '50mb', extended: true }));
    nestApp.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
    setupSwagger(nestApp);
    await nestApp.init();

    await nestApp.listen(Config().port, () => console.log(`Server listing on port=${Config().port}`));
    console.timeEnd('main.app.init')

  } catch (error) {
    console.log("bootstrap error", error)
  }
  return Promise.resolve(cachedServer);
}
bootstrap();
