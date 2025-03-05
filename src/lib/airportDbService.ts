// /lib/airportDbService.ts
import { Airport } from '@/lib/googleSheets';

const DB_NAME = 'AirportsDatabase';
const STORE_NAME = 'airports';
const DB_VERSION = 1;
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

class AirportDbService {
  private db: IDBDatabase | null = null;

  /**
   * Open and initialize the IndexedDB database
   */
  async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open IndexedDB');
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create the object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'icao' });
          // Create indexes for faster searches
          store.createIndex('iata', 'iata', { unique: false });
          store.createIndex('airportName', 'airportName', { unique: false });
        }
      };
    });
  }

  /**
   * Check if the cached data is stale and needs to be refreshed
   */
  async isCacheStale(): Promise<boolean> {
    const timestamp = localStorage.getItem('airportDataTimestamp');
    if (!timestamp) return true;
    
    const lastUpdate = parseInt(timestamp, 10);
    const now = Date.now();
    
    return (now - lastUpdate) > CACHE_DURATION;
  }

  /**
   * Get all airports from IndexedDB
   */
  async getAllAirports(): Promise<Airport[]> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('Failed to get airports from IndexedDB');
        reject(new Error('Failed to get airports from IndexedDB'));
      };
    });
  }

  /**
   * Store airports in IndexedDB in chunks to avoid transaction limits
   */
  async storeAirports(airports: Airport[]): Promise<void> {
    await this.init();
    
    // Store in chunks to avoid transaction limits
    const chunkSize = 5000;
    
    for (let i = 0; i < airports.length; i += chunkSize) {
      const chunk = airports.slice(i, i + chunkSize);
      await this.storeAirportChunk(chunk);
    }
    
    // Update the timestamp in localStorage
    localStorage.setItem('airportDataTimestamp', Date.now().toString());
    console.log(`Stored ${airports.length} airports in IndexedDB`);
  }

  /**
   * Store a chunk of airports in a single transaction
   */
  private async storeAirportChunk(airports: Airport[]): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = (event) => {
        console.error('Transaction error:', event);
        reject(new Error('Failed to store airports chunk'));
      };

      // Add each airport to the store
      airports.forEach(airport => {
        store.put(airport);
      });
    });
  }

  /**
   * Search for airports by name, IATA, or ICAO
   */
  async searchAirports(searchTerm: string, limit = 50): Promise<Airport[]> {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    try {
      await this.init();
      const airports = await this.getAllAirports();
      
      const term = searchTerm.toLowerCase();
      const filtered = airports.filter(airport => 
        airport.icao.toLowerCase().includes(term) ||
        (airport.iata?.toLowerCase().includes(term)) ||
        airport.airportName.toLowerCase().includes(term)
      );
      
      return filtered.slice(0, limit);
    } catch (error) {
      console.error('Error searching airports:', error);
      return [];
    }
  }
}

// Export a singleton instance
export const airportDbService = new AirportDbService();