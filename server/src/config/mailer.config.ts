import { registerAs } from '@nestjs/config';

require('dotenv').config();

export default registerAs('mailer', () => ({
  gmail: process.env.GMAIL,
  clientId: process.env.GMAIL_CLIENT_ID,
  clientSecret: process.env.GMAIL_CLIENT_SECRET,
  refreshToken: process.env.GMAIL_REFRESH_TOKEN,
}));
