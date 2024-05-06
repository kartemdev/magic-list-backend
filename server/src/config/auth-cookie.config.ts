import { registerAs } from '@nestjs/config';

export default registerAs('auth-cookie', () => ({
  httpOnly: true,
  maxAge: 360 * 60 * 60 * 1000,
  sameSite: 'none',
  secure: true,
}));
