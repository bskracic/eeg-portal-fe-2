export interface StorageService {
  get(key: string): string | null
  set(key: string, value: string): void
  remove(key: string): void
  clear(): void
}

export class LocalStorageService implements StorageService {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  }

  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  }

  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }
} 

export const storage = new LocalStorageService();