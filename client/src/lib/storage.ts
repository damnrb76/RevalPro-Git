import {
  UserProfile,
  InsertUserProfile,
  PracticeHours,
  InsertPracticeHours,
  CpdRecord,
  InsertCpdRecord,
  FeedbackRecord,
  InsertFeedbackRecord,
  ReflectiveAccount,
  InsertReflectiveAccount,
  ReflectiveDiscussion,
  InsertReflectiveDiscussion,
  HealthDeclaration,
  InsertHealthDeclaration,
  Confirmation,
  InsertConfirmation,
} from '@shared/schema';

// Database name and version
const DB_NAME = 'nursevalidate-uk';
const DB_VERSION = 1;

// Store names
const STORES = {
  USER_PROFILE: 'userProfile',
  PRACTICE_HOURS: 'practiceHours',
  CPD_RECORDS: 'cpdRecords',
  FEEDBACK_RECORDS: 'feedbackRecords',
  REFLECTIVE_ACCOUNTS: 'reflectiveAccounts',
  REFLECTIVE_DISCUSSION: 'reflectiveDiscussion',
  HEALTH_DECLARATION: 'healthDeclaration',
  CONFIRMATION: 'confirmation',
  SETTINGS: 'settings',
};

// Initialize and open IndexedDB
export function initializeStorage(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      reject(new Error('Error opening database'));
    };

    request.onsuccess = (event) => {
      console.log('Database initialized successfully');
      resolve();
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores with auto-incrementing keys
      if (!db.objectStoreNames.contains(STORES.USER_PROFILE)) {
        db.createObjectStore(STORES.USER_PROFILE, { keyPath: 'id', autoIncrement: true });
      }

      if (!db.objectStoreNames.contains(STORES.PRACTICE_HOURS)) {
        const practiceHoursStore = db.createObjectStore(STORES.PRACTICE_HOURS, { keyPath: 'id', autoIncrement: true });
        practiceHoursStore.createIndex('startDate', 'startDate', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.CPD_RECORDS)) {
        const cpdStore = db.createObjectStore(STORES.CPD_RECORDS, { keyPath: 'id', autoIncrement: true });
        cpdStore.createIndex('date', 'date', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.FEEDBACK_RECORDS)) {
        const feedbackStore = db.createObjectStore(STORES.FEEDBACK_RECORDS, { keyPath: 'id', autoIncrement: true });
        feedbackStore.createIndex('date', 'date', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.REFLECTIVE_ACCOUNTS)) {
        const reflectiveStore = db.createObjectStore(STORES.REFLECTIVE_ACCOUNTS, { keyPath: 'id', autoIncrement: true });
        reflectiveStore.createIndex('date', 'date', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.REFLECTIVE_DISCUSSION)) {
        db.createObjectStore(STORES.REFLECTIVE_DISCUSSION, { keyPath: 'id', autoIncrement: true });
      }

      if (!db.objectStoreNames.contains(STORES.HEALTH_DECLARATION)) {
        db.createObjectStore(STORES.HEALTH_DECLARATION, { keyPath: 'id', autoIncrement: true });
      }

      if (!db.objectStoreNames.contains(STORES.CONFIRMATION)) {
        db.createObjectStore(STORES.CONFIRMATION, { keyPath: 'id', autoIncrement: true });
      }

      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
      }
    };
  });
}

// Generic function to open a transaction
function openTransaction(storeName: string, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    
    request.onerror = () => reject(new Error(`Error opening transaction for ${storeName}`));
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      resolve(store);
    };
  });
}

// Generic add function
export async function add<T>(storeName: string, data: T): Promise<number> {
  const store = await openTransaction(storeName, 'readwrite');
  
  return new Promise((resolve, reject) => {
    const request = store.add({ ...data, created: new Date() });
    
    request.onerror = () => reject(new Error(`Error adding to ${storeName}`));
    request.onsuccess = (event) => resolve((event.target as IDBRequest<number>).result);
  });
}

// Generic update function
export async function update<T>(storeName: string, id: number, data: Partial<T>): Promise<void> {
  const store = await openTransaction(storeName, 'readwrite');
  
  return new Promise((resolve, reject) => {
    const getRequest = store.get(id);
    
    getRequest.onerror = () => reject(new Error(`Error retrieving item from ${storeName}`));
    
    getRequest.onsuccess = () => {
      const existingData = getRequest.result;
      if (!existingData) {
        reject(new Error(`Item not found in ${storeName}`));
        return;
      }
      
      const updatedData = { ...existingData, ...data };
      const updateRequest = store.put(updatedData);
      
      updateRequest.onerror = () => reject(new Error(`Error updating in ${storeName}`));
      updateRequest.onsuccess = () => resolve();
    };
  });
}

// Generic get by ID function
export async function getById<T>(storeName: string, id: number): Promise<T | null> {
  const store = await openTransaction(storeName);
  
  return new Promise((resolve, reject) => {
    const request = store.get(id);
    
    request.onerror = () => reject(new Error(`Error getting from ${storeName}`));
    request.onsuccess = () => {
      resolve(request.result || null);
    };
  });
}

// Generic get all function
export async function getAll<T>(storeName: string): Promise<T[]> {
  const store = await openTransaction(storeName);
  
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    
    request.onerror = () => reject(new Error(`Error getting all from ${storeName}`));
    request.onsuccess = () => resolve(request.result);
  });
}

// Generic delete function
export async function remove(storeName: string, id: number): Promise<void> {
  const store = await openTransaction(storeName, 'readwrite');
  
  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    
    request.onerror = () => reject(new Error(`Error deleting from ${storeName}`));
    request.onsuccess = () => resolve();
  });
}

// Get data with date range filter
export async function getWithDateRange<T>(
  storeName: string,
  indexName: string,
  startDate: Date,
  endDate: Date
): Promise<T[]> {
  const store = await openTransaction(storeName);
  const index = store.index(indexName);
  
  return new Promise((resolve, reject) => {
    const range = IDBKeyRange.bound(startDate, endDate);
    const request = index.openCursor(range);
    const results: T[] = [];
    
    request.onerror = () => reject(new Error(`Error getting range from ${storeName}`));
    
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
      
      if (cursor) {
        results.push(cursor.value);
        cursor.continue();
      } else {
        resolve(results);
      }
    };
  });
}

// Specific functions for each store
export const userProfileStorage = {
  add: (data: InsertUserProfile) => add<InsertUserProfile>(STORES.USER_PROFILE, data),
  update: (id: number, data: Partial<UserProfile>) => update<UserProfile>(STORES.USER_PROFILE, id, data),
  getById: (id: number) => getById<UserProfile>(STORES.USER_PROFILE, id),
  getAll: () => getAll<UserProfile>(STORES.USER_PROFILE),
  getCurrent: async () => {
    const profiles = await getAll<UserProfile>(STORES.USER_PROFILE);
    return profiles.length > 0 ? profiles[0] : null;
  },
  updateProfileImage: async (imageDataUrl: string): Promise<void> => {
    const profile = await userProfileStorage.getCurrent();
    if (profile) {
      await update<UserProfile>(STORES.USER_PROFILE, profile.id, {
        profileImage: imageDataUrl
      });
    } else {
      throw new Error('No profile found to update image');
    }
  },
  removeProfileImage: async (): Promise<void> => {
    const profile = await userProfileStorage.getCurrent();
    if (profile) {
      await update<UserProfile>(STORES.USER_PROFILE, profile.id, {
        profileImage: null
      });
    } else {
      throw new Error('No profile found to remove image');
    }
  }
};

export const practiceHoursStorage = {
  add: (data: InsertPracticeHours) => add<InsertPracticeHours>(STORES.PRACTICE_HOURS, data),
  update: (id: number, data: Partial<PracticeHours>) => update<PracticeHours>(STORES.PRACTICE_HOURS, id, data),
  getById: (id: number) => getById<PracticeHours>(STORES.PRACTICE_HOURS, id),
  getAll: () => getAll<PracticeHours>(STORES.PRACTICE_HOURS),
  remove: (id: number) => remove(STORES.PRACTICE_HOURS, id),
  getAllInDateRange: (startDate: Date, endDate: Date) => 
    getWithDateRange<PracticeHours>(STORES.PRACTICE_HOURS, 'startDate', startDate, endDate),
  getTotalHours: async () => {
    const records = await getAll<PracticeHours>(STORES.PRACTICE_HOURS);
    return records.reduce((sum, record) => sum + record.hours, 0);
  }
};

export const cpdRecordsStorage = {
  add: (data: InsertCpdRecord) => add<InsertCpdRecord>(STORES.CPD_RECORDS, data),
  update: (id: number, data: Partial<CpdRecord>) => update<CpdRecord>(STORES.CPD_RECORDS, id, data),
  getById: (id: number) => getById<CpdRecord>(STORES.CPD_RECORDS, id),
  getAll: () => getAll<CpdRecord>(STORES.CPD_RECORDS),
  remove: (id: number) => remove(STORES.CPD_RECORDS, id),
  getTotalHours: async () => {
    const records = await getAll<CpdRecord>(STORES.CPD_RECORDS);
    return records.reduce((sum, record) => sum + record.hours, 0);
  },
  getParticipatoryHours: async () => {
    const records = await getAll<CpdRecord>(STORES.CPD_RECORDS);
    return records
      .filter(record => record.participatory)
      .reduce((sum, record) => sum + record.hours, 0);
  }
};

export const feedbackRecordsStorage = {
  add: (data: InsertFeedbackRecord) => add<InsertFeedbackRecord>(STORES.FEEDBACK_RECORDS, data),
  update: (id: number, data: Partial<FeedbackRecord>) => update<FeedbackRecord>(STORES.FEEDBACK_RECORDS, id, data),
  getById: (id: number) => getById<FeedbackRecord>(STORES.FEEDBACK_RECORDS, id),
  getAll: () => getAll<FeedbackRecord>(STORES.FEEDBACK_RECORDS),
  remove: (id: number) => remove(STORES.FEEDBACK_RECORDS, id),
  getCount: async () => {
    const records = await getAll<FeedbackRecord>(STORES.FEEDBACK_RECORDS);
    return records.length;
  }
};

export const reflectiveAccountsStorage = {
  add: (data: InsertReflectiveAccount) => add<InsertReflectiveAccount>(STORES.REFLECTIVE_ACCOUNTS, data),
  update: (id: number, data: Partial<ReflectiveAccount>) => update<ReflectiveAccount>(STORES.REFLECTIVE_ACCOUNTS, id, data),
  getById: (id: number) => getById<ReflectiveAccount>(STORES.REFLECTIVE_ACCOUNTS, id),
  getAll: () => getAll<ReflectiveAccount>(STORES.REFLECTIVE_ACCOUNTS),
  remove: (id: number) => remove(STORES.REFLECTIVE_ACCOUNTS, id),
  getCount: async () => {
    const records = await getAll<ReflectiveAccount>(STORES.REFLECTIVE_ACCOUNTS);
    return records.length;
  }
};

export const reflectiveDiscussionStorage = {
  add: (data: InsertReflectiveDiscussion) => add<InsertReflectiveDiscussion>(STORES.REFLECTIVE_DISCUSSION, data),
  update: (id: number, data: Partial<ReflectiveDiscussion>) => update<ReflectiveDiscussion>(STORES.REFLECTIVE_DISCUSSION, id, data),
  getById: (id: number) => getById<ReflectiveDiscussion>(STORES.REFLECTIVE_DISCUSSION, id),
  getAll: () => getAll<ReflectiveDiscussion>(STORES.REFLECTIVE_DISCUSSION),
  remove: (id: number) => remove(STORES.REFLECTIVE_DISCUSSION, id),
  getCurrent: async () => {
    const discussions = await getAll<ReflectiveDiscussion>(STORES.REFLECTIVE_DISCUSSION);
    return discussions.length > 0 ? discussions[0] : null;
  }
};

export const healthDeclarationStorage = {
  add: (data: InsertHealthDeclaration) => add<InsertHealthDeclaration>(STORES.HEALTH_DECLARATION, data),
  update: (id: number, data: Partial<HealthDeclaration>) => update<HealthDeclaration>(STORES.HEALTH_DECLARATION, id, data),
  getById: (id: number) => getById<HealthDeclaration>(STORES.HEALTH_DECLARATION, id),
  getAll: () => getAll<HealthDeclaration>(STORES.HEALTH_DECLARATION),
  getCurrent: async () => {
    const declarations = await getAll<HealthDeclaration>(STORES.HEALTH_DECLARATION);
    return declarations.length > 0 ? declarations[0] : null;
  }
};

export const confirmationStorage = {
  add: (data: InsertConfirmation) => add<InsertConfirmation>(STORES.CONFIRMATION, data),
  update: (id: number, data: Partial<Confirmation>) => update<Confirmation>(STORES.CONFIRMATION, id, data),
  getById: (id: number) => getById<Confirmation>(STORES.CONFIRMATION, id),
  getAll: () => getAll<Confirmation>(STORES.CONFIRMATION),
  getCurrent: async () => {
    const confirmations = await getAll<Confirmation>(STORES.CONFIRMATION);
    return confirmations.length > 0 ? confirmations[0] : null;
  }
};

// Settings storage
export async function setSetting<T>(key: string, value: T): Promise<void> {
  const store = await openTransaction(STORES.SETTINGS, 'readwrite');
  
  return new Promise((resolve, reject) => {
    const request = store.put({ key, value });
    
    request.onerror = () => reject(new Error('Error saving setting'));
    request.onsuccess = () => resolve();
  });
}

export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  const store = await openTransaction(STORES.SETTINGS);
  
  return new Promise((resolve, reject) => {
    const request = store.get(key);
    
    request.onerror = () => reject(new Error('Error getting setting'));
    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result.value);
      } else {
        resolve(defaultValue);
      }
    };
  });
}

// Data export function
export async function exportAllData(): Promise<Record<string, any>> {
  const data: Record<string, any> = {};
  
  data.userProfile = await getAll(STORES.USER_PROFILE);
  data.practiceHours = await getAll(STORES.PRACTICE_HOURS);
  data.cpdRecords = await getAll(STORES.CPD_RECORDS);
  data.feedbackRecords = await getAll(STORES.FEEDBACK_RECORDS);
  data.reflectiveAccounts = await getAll(STORES.REFLECTIVE_ACCOUNTS);
  data.reflectiveDiscussion = await getAll(STORES.REFLECTIVE_DISCUSSION);
  data.healthDeclaration = await getAll(STORES.HEALTH_DECLARATION);
  data.confirmation = await getAll(STORES.CONFIRMATION);
  
  return data;
}

// Data import function
export async function importData(data: Record<string, any>): Promise<void> {
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    request.onerror = () => reject(new Error('Error opening database for import'));
    request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result);
  });

  const tx = db.transaction(Object.values(STORES), 'readwrite');
  
  // Clear all stores first
  for (const storeName of Object.values(STORES)) {
    const store = tx.objectStore(storeName);
    await new Promise<void>((resolve, reject) => {
      const clearRequest = store.clear();
      clearRequest.onerror = () => reject(new Error(`Error clearing ${storeName}`));
      clearRequest.onsuccess = () => resolve();
    });
  }
  
  // Import data
  for (const [key, items] of Object.entries(data)) {
    if (Array.isArray(items)) {
      const storeName = Object.values(STORES).find(store => 
        store.toLowerCase() === key.toLowerCase()
      );
      
      if (storeName) {
        const store = tx.objectStore(storeName);
        for (const item of items) {
          await new Promise<void>((resolve, reject) => {
            const addRequest = store.add(item);
            addRequest.onerror = () => reject(new Error(`Error importing to ${storeName}`));
            addRequest.onsuccess = () => resolve();
          });
        }
      }
    }
  }
  
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(new Error('Error during import transaction'));
  });
}

// Function to clear all data (for testing/resetting)
export async function clearAllData(): Promise<void> {
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    request.onerror = () => reject(new Error('Error opening database for clearing'));
    request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result);
  });

  const tx = db.transaction(Object.values(STORES), 'readwrite');
  
  for (const storeName of Object.values(STORES)) {
    const store = tx.objectStore(storeName);
    await new Promise<void>((resolve, reject) => {
      const clearRequest = store.clear();
      clearRequest.onerror = () => reject(new Error(`Error clearing ${storeName}`));
      clearRequest.onsuccess = () => resolve();
    });
  }
  
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(new Error('Error during clear transaction'));
  });
}
