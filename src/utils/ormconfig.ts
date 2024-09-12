import * as dotenv from 'dotenv';
dotenv.config();
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from './strategies';

const configService = new ConfigService();
export const appDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST_MIGRATION'),
  port: +configService.get<number>('POSTGRES_PORT_MIGRATION'),
  username: configService.get('POSTGRES_USERNAME'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  schema: configService.get('POSTGRES_SCHEMA'),
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['src/modules/**/*{.entity,.index}{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
});
