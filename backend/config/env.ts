import crypto from 'node:crypto';
import dotenv from 'dotenv';

dotenv.config();

// Ephemeral dev-only runtime fallback keys (never written to repo or logged)
const devEphemeralSessionSecret = crypto.randomBytes(32).toString('hex');
const devEphemeralOtpHmacSecret = crypto.randomBytes(32).toString('hex');
const devEphemeralDataPepper = crypto.randomBytes(32).toString('hex');

export interface ServerConfig {
  nodeEnv: 'development' | 'test' | 'production';
  port: number;
  corsAllowedOrigins: string[];
  smsProvider: 'disabled_dev' | 'configured';
  emailProvider: 'disabled_dev' | 'configured';
  sessionSecret: string;
  otpHmacSecret: string;
  dataHashPepper: string;
}

export function getServerConfig(): ServerConfig {
  const rawEnv = process.env.NODE_ENV;
  const nodeEnv: ServerConfig['nodeEnv'] =
    rawEnv === 'production' ? 'production' : rawEnv === 'test' ? 'test' : 'development';

  const parsedPort = Number.parseInt(process.env.PORT ?? '3000', 10);
  const port = Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 3000;

  const corsAllowedOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const smsProvider =
    process.env.SMS_PROVIDER && process.env.SMS_PROVIDER !== 'disabled_dev'
      ? 'configured'
      : 'disabled_dev';

  const emailProvider =
    process.env.EMAIL_PROVIDER && process.env.EMAIL_PROVIDER !== 'disabled_dev'
      ? 'configured'
      : 'disabled_dev';

  const sessionSecret = process.env.SESSION_SECRET || devEphemeralSessionSecret;
  const otpHmacSecret = process.env.OTP_HMAC_SECRET || devEphemeralOtpHmacSecret;
  const dataHashPepper = process.env.DATA_HASH_PEPPER || devEphemeralDataPepper;

  if (
    nodeEnv === 'production' &&
    (!process.env.SESSION_SECRET || !process.env.OTP_HMAC_SECRET || !process.env.DATA_HASH_PEPPER)
  ) {
    throw new Error(
      'SESSION_SECRET, OTP_HMAC_SECRET, and DATA_HASH_PEPPER must be configured in production.'
    );
  }

  return {
    nodeEnv,
    port,
    corsAllowedOrigins,
    smsProvider,
    emailProvider,
    sessionSecret,
    otpHmacSecret,
    dataHashPepper,
  };
}
