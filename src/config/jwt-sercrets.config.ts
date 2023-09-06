import { registerAs } from '@nestjs/config';

export default registerAs('jwt-secrets', () => ({
  accessSecret: process.env.ACCESS_SECRET_KEY,
  refreshSecret: process.env.REFRESH_SECRET_KEY,
}));
