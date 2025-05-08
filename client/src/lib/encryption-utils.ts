/**
 * Encryption utilities for secure data storage and backup
 * Implements AES-256 encryption in compliance with UK data protection standards
 */

import CryptoJS from 'crypto-js';

/**
 * Encrypt data with a password using AES-256 encryption
 * 
 * @param data - The data to encrypt (object will be JSON.stringified)
 * @param password - The password used for encryption
 * @returns Encrypted string with salt and IV (initialization vector)
 */
export function encryptData(data: any, password: string): string {
  if (!password) {
    throw new Error('Password is required for encryption');
  }

  // Convert data to JSON string if it's an object
  const dataString = typeof data === 'string' ? data : JSON.stringify(data);
  
  // Generate a random salt (128 bits)
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  
  // Generate a random IV (initialization vector)
  const iv = CryptoJS.lib.WordArray.random(128 / 8);
  
  // Generate a key from the password and salt using PBKDF2
  // 10000 iterations is recommended for UK security standards
  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32, // AES-256
    iterations: 10000,
    hasher: CryptoJS.algo.SHA256
  });
  
  // Encrypt the data using AES in CBC mode with the key and IV
  const encrypted = CryptoJS.AES.encrypt(dataString, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  // Combine the salt, IV, and encrypted data into a single string
  // Format: <salt>:<iv>:<encrypted>
  const result = salt.toString() + ':' + iv.toString() + ':' + encrypted.toString();
  
  return result;
}

/**
 * Decrypt data that was encrypted with encryptData
 * 
 * @param encryptedData - The encrypted data string
 * @param password - The password used for decryption
 * @returns Decrypted data (parsed from JSON if it's an object)
 */
export function decryptData<T = any>(encryptedData: string, password: string): T {
  if (!password) {
    throw new Error('Password is required for decryption');
  }

  try {
    // Split the encrypted string to extract salt, IV, and encrypted data
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }
    
    const salt = CryptoJS.enc.Hex.parse(parts[0]);
    const iv = CryptoJS.enc.Hex.parse(parts[1]);
    const encrypted = parts[2];
    
    // Generate the same key using the password and salt
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations: 10000,
      hasher: CryptoJS.algo.SHA256
    });
    
    // Decrypt the data
    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    // Convert the decrypted data to a string
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    
    // Parse the string as JSON if possible
    try {
      return JSON.parse(decryptedString) as T;
    } catch {
      // If it's not valid JSON, return it as a string
      return decryptedString as unknown as T;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
    throw new Error('Decryption failed');
  }
}

/**
 * Check if a password meets UK security standards
 * 
 * @param password - The password to validate
 * @returns Object containing validity and message
 */
export function validateBackupPassword(password: string): { isValid: boolean; message: string } {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < 12) {
    return { isValid: false, message: 'Password must be at least 12 characters long' };
  }

  // Check for complexity requirements
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const complexity = [hasUppercase, hasLowercase, hasNumbers, hasSpecialChars].filter(Boolean).length;

  if (complexity < 3) {
    return {
      isValid: false,
      message:
        'Password must contain at least 3 of the following: uppercase letters, lowercase letters, numbers, and special characters',
    };
  }

  return { isValid: true, message: 'Password is valid' };
}