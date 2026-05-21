import crypto from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const PBKDF2_ITERATIONS = 100000;
const KEY_LENGTH = 32;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;

export function encryptData(dataString: string, masterPassword: string) {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = crypto.pbkdf2Sync(masterPassword, salt, PBKDF2_ITERATIONS, KEY_LENGTH, 'sha256');

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(dataString, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    salt: salt.toString('hex'),
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    ciphertext: encrypted,
  };
}

export function decryptData(encryptedPackage: any, masterPassword: string) {
  if (
    !encryptedPackage ||
    !encryptedPackage.salt ||
    !encryptedPackage.iv ||
    !encryptedPackage.authTag ||
    !encryptedPackage.ciphertext
  ) {
    throw new Error('Invalid format, the file is corrupted or not crypted.');
  }

  const { salt, iv, authTag, ciphertext } = encryptedPackage;

  const saltBuffer = Buffer.from(salt, 'hex');
  const ivBuffer = Buffer.from(iv, 'hex');
  const authTagBuffer = Buffer.from(authTag, 'hex');

  const key = crypto.pbkdf2Sync(
    masterPassword,
    saltBuffer,
    PBKDF2_ITERATIONS,
    KEY_LENGTH,
    'sha256',
  );

  const decipher = crypto.createDecipheriv(ALGORITHM, key, ivBuffer);
  decipher.setAuthTag(authTagBuffer);

  let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
