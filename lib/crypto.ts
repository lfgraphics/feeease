import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ''; // Must be 32 characters
const IV_LENGTH = 16; // For AES, this is always 16

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
  // In production, throw error if key is missing or invalid length
  if (process.env.NODE_ENV === 'production') {
    throw new Error('ENCRYPTION_KEY is missing or invalid length (must be 32 chars). Encryption will fail.');
  } else {
    console.warn('ENCRYPTION_KEY is missing or invalid length (must be 32 chars). Encryption will fail.');
  }
}

export function encrypt(text: string): string {
  if (!text) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
  if (!text) return '';
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// RSA Key Pair Generation for License Signing
// In a real scenario, you'd generate these once and store them securely (e.g., env vars or file)
// For this implementation, we assume PRIVATE_KEY and PUBLIC_KEY are in env vars.

export const PRIVATE_KEY = process.env.LICENSE_PRIVATE_KEY 
    ? `-----BEGIN RSA PRIVATE KEY-----\n${process.env.LICENSE_PRIVATE_KEY.replace(/\\n/g, '\n').trim()}\n-----END RSA PRIVATE KEY-----`
    : '';

export const PUBLIC_KEY = process.env.LICENSE_PUBLIC_KEY 
    ? `-----BEGIN PUBLIC KEY-----\n${process.env.LICENSE_PUBLIC_KEY.replace(/\\n/g, '\n').trim()}\n-----END PUBLIC KEY-----`
    : '';

if (!PRIVATE_KEY || !PUBLIC_KEY) {
    console.warn('LICENSE_PRIVATE_KEY or LICENSE_PUBLIC_KEY is missing. License signing/verification will fail.');
}
