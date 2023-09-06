import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_URL,
  entities: [path.join(__dirname, '/../**/*.entity{.js, .ts}')],
};

export default registerAs('typeorm-pg', () => ({
  ...databaseConfig,
  synchronize: true,
}));
