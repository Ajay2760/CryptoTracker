// Storage interface for crypto dashboard - currently using client-side localStorage for watchlist
export interface IStorage {
  // Future storage methods can be added here if needed
}

export class MemStorage implements IStorage {
  constructor() {
    // In-memory storage placeholder
  }
}

export const storage = new MemStorage();
