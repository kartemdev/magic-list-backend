import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [path.join(__dirname, '/../**/*.entity{.js, .ts}')],
};

export default registerAs('typeorm-pg', () => ({
  ...databaseConfig,
  synchronize: true,
}));
