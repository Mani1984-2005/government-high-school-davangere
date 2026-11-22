import crypto from 'node:crypto';

export function generateSaltHex(bytes = 16): string {
  return crypto.randomBytes(bytes).toString('hex');
}

export function generateNumericOtp(digits = 6): string {
  const max = 10 ** digits;
  return crypto.randomInt(0, max).toString().padStart(digits, '0');
}

export function generateOpaqueToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('base64url');
}

export function hmacSha256Hex(value: string, secret: string, salt = ''): string {
  return crypto
    .createHmac('sha256', secret)
    .update(salt ? `${salt}:${value}` : value)
    .digest('hex');
}

export function timingSafeHexEqual(a: string, b: string): boolean {
  if (a.length !== b.length || a.length === 0) return false;
  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function normalizeIndianMobileE164(input: string): string | null {
  const cleaned = input.replace(/[\s()-]/g, '');
  if (/^\+91[6-9]\d{9}$/.test(cleaned)) {
    return cleaned;
  }
  if (/^[6-9]\d{9}$/.test(cleaned)) {
    return `+91${cleaned}`;
  }
  if (/^91[6-9]\d{9}$/.test(cleaned)) {
    return `+${cleaned}`;
  }
  return null;
}

export function generateRegistrationReferenceCode(): string {
  const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
  const year = new Date().getUTCFullYear();
  return `GHS-REG-${year}-${randomPart}`;
}
