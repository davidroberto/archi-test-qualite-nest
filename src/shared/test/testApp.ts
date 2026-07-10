import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { CatalogModule } from '../../catalog/catalog.module';
import { OrderModule } from '../../order/order.module';

export class TestApp {
  private constructor(
    readonly app: INestApplication,
    private readonly pgContainer: StartedPostgreSqlContainer,
  ) {}

  static async start(): Promise<TestApp> {
    const pgContainer = await new PostgreSqlContainer('postgres:16-alpine')
      .withStartupTimeout(60_000)
      .start();

    const moduleFixture = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: pgContainer.getHost(),
          port: pgContainer.getPort(),
          username: pgContainer.getUsername(),
          password: pgContainer.getPassword(),
          database: pgContainer.getDatabase(),
          entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
          synchronize: true,
          autoLoadEntities: true,
        }),
        EventEmitterModule.forRoot(),
        CatalogModule,
        OrderModule,
      ],
    }).compile();

    const app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    return new TestApp(app, pgContainer);
  }

  get dataSource(): DataSource {
    return this.app.get(DataSource);
  }

  async resetDatabase(): Promise<void> {
    const entities = this.dataSource.entityMetadatas;
    for (const entity of entities) {
      await this.dataSource.query(
        `TRUNCATE TABLE "${entity.tableName}" CASCADE`,
      );
    }
  }

  async stop(): Promise<void> {
    await this.app.close();
    await this.pgContainer.stop();
  }
}
