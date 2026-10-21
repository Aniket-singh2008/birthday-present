/**
 * IndexedDB storage utility for user photos
 */

const DB_NAME = 'romantic_birthday_surprise_db';
const DB_VERSION = 1;
const STORE_NAME = 'user_photos';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePhotosToStorage(key: string, data: any): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(data, key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    // Fallback to localStorage if possible
    try {
      if (typeof data === 'string') {
        localStorage.setItem(`rbs_${key}`, data);
      } else {
        localStorage.setItem(`rbs_${key}`, JSON.stringify(data));
      }
    } catch {
      console.warn('Storage quota exceeded in fallback');
    }
  }
}

export async function getPhotosFromStorage<T>(key: string): Promise<T | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => resolve((request.result as T) ?? null);
      request.onerror = () => reject(request.error);
    });
  } catch {
    try {
      const item = localStorage.getItem(`rbs_${key}`);
      if (!item) return null;
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as unknown as T;
      }
    } catch {
      return null;
    }
  }
}

export async function clearAllCustomPhotos(): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        try {
          localStorage.removeItem('rbs_heart_photos');
          localStorage.removeItem('rbs_page_photos');
        } catch {}
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    try {
      localStorage.removeItem('rbs_heart_photos');
      localStorage.removeItem('rbs_page_photos');
    } catch {}
  }
}
