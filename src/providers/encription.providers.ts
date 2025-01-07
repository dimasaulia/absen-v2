// import { createCipheriv, createDecipheriv, CipherCCMTypes } from 'crypto';
import {
  createDecipheriv,
  createCipheriv,
  CipherCCMTypes,
  randomBytes,
} from 'node:crypto';

const ENC: string = process.env.ENC!;
const IV: string = '5183666c72eec9e4';
const ALGO: string = 'aes-256-gcm';

// Function to encrypt text
export function encryptText(text: string): string {
  let cipher = createCipheriv(
    ALGO,
    new TextEncoder().encode(ENC),
    new TextEncoder().encode(IV)
  );
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

// Function to decrypt text
export function decryptText(text: string): string {
  let decipher = createDecipheriv(
    ALGO,
    new TextEncoder().encode(ENC),
    new TextEncoder().encode(IV)
  );
  let decrypted = decipher.update(text, 'base64', 'utf8');
  return decrypted;
}
