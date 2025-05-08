/**
 * Backup Service
 * Handles encrypted export and import of revalidation data
 * Compliant with UK data protection standards (GDPR, DPA 2018)
 */

import { saveAs } from 'file-saver';
import { encryptData, decryptData } from './encryption-utils';
import * as storage from './storage';

// Metadata for the backup file
interface BackupMetadata {
  application: string;
  version: string;
  createdAt: string;
  encryptionMethod: string;
  userId: number | null;
  username: string | null;
}

// Structure of the backup file
interface BackupFile {
  metadata: BackupMetadata;
  data: Record<string, any>;
}

/**
 * Create and download an encrypted backup of user data
 * 
 * @param password - Password to encrypt the backup
 * @param userId - ID of the user creating the backup
 * @param username - Username of the user creating the backup
 */
export async function createEncryptedBackup(
  password: string,
  userId: number | null,
  username: string | null
): Promise<void> {
  try {
    // Export all user data
    const userData = await storage.exportAllData();
    
    // Create backup metadata
    const metadata: BackupMetadata = {
      application: 'RevalPro UK Nursing Revalidation',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      encryptionMethod: 'AES-256-CBC with PBKDF2',
      userId,
      username,
    };
    
    // Create backup file structure
    const backupFile: BackupFile = {
      metadata,
      data: userData,
    };
    
    // Encrypt the backup file
    const encryptedBackup = encryptData(backupFile, password);
    
    // Create a Blob with the encrypted data
    const blob = new Blob([encryptedBackup], { type: 'text/plain;charset=utf-8' });
    
    // Generate a filename with the current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `revalpro-backup-${date}.enc`;
    
    // Save the file
    saveAs(blob, filename);
    
    return;
  } catch (error) {
    console.error('Failed to create backup:', error);
    throw new Error('Failed to create backup. Please try again.');
  }
}

/**
 * Import an encrypted backup file
 * 
 * @param encryptedBackup - Content of the encrypted backup file
 * @param password - Password to decrypt the backup
 * @returns True if the import was successful
 */
export async function importEncryptedBackup(
  encryptedBackup: string,
  password: string
): Promise<boolean> {
  try {
    // Decrypt the backup
    const backup = decryptData<BackupFile>(encryptedBackup, password);
    
    // Validate the backup structure
    if (!backup || !backup.metadata || !backup.data) {
      throw new Error('Invalid backup file format');
    }
    
    // Check if the backup is compatible
    if (backup.metadata.application !== 'RevalPro UK Nursing Revalidation') {
      throw new Error('This backup is not compatible with RevalPro');
    }
    
    // Import the data
    await storage.importData(backup.data);
    
    return true;
  } catch (error) {
    console.error('Failed to import backup:', error);
    if (error instanceof Error) {
      throw new Error(`Import failed: ${error.message}`);
    }
    throw new Error('Failed to import backup. Please check your password and try again.');
  }
}

/**
 * Read the content of a file
 * 
 * @param file - The file to read
 * @returns Promise that resolves with the file content
 */
export function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
}