import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configs from 'src/common/configs';
import { SnakeNamingStrategy } from 'src/utils/strategies';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { AuthModule } from './auth';
import { ProductCategoryModule } from './product_category';
import { UserModule } from './user';
import { ProductModule } from './product';
import { OrderModule } from './order';
import { AuditLogModule } from './audit_log';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: configs }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get<number>('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USERNAME'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        schema: configService.get('POSTGRES_SCHEMA'),
        entities: [__dirname + '/../modules/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/../migrations/*{.ts,.js}'],
        namingStrategy: new SnakeNamingStrategy(),
        logging: configService.get('POSTGRES_LOGGING') === 'true',
        logger: 'file',
      }),
      inject: [ConfigService],
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    UserModule,
    AuthModule,
    ProductCategoryModule,
    ProductModule,
    OrderModule,
    AuditLogModule
  ],
  controllers: [],
})
export class AppModule {}
