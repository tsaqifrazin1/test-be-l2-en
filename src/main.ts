import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as compression from 'compression';
import { setupSwagger } from './utils';
import { HttpExceptionFilter } from './filter';
import { useContainer } from 'class-validator';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  initializeTransactionalContext()
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.setGlobalPrefix('api');
  app.enable('trust proxy');
  app.use(helmet.default());
  app.use(compression());
  app.use(morgan('tiny'));
  setupSwagger(app);

  app.useGlobalFilters(new HttpExceptionFilter());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);

  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'), '0.0.0.0');
}
bootstrap().then(() => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
