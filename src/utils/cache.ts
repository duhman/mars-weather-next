interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export class Cache {
  private static CACHE_DURATION = 60 * 60 * 1000; // 1 hour

  static set<T>(key: string, data: T): void {
    if (typeof window === 'undefined') return;
    
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  }

  static get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;
      
      const item: CacheItem<T> = JSON.parse(itemStr);
      const now = Date.now();
      
      if (now - item.timestamp > this.CACHE_DURATION) {
        localStorage.removeItem(key);
        return null;
      }
      
      return item.data;
    } catch (error) {
      console.error('Failed to retrieve cached data:', error);
      return null;
    }
  }

  static clear(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
}