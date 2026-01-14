/**
 * 🪶 Data Adapters
 *
 * Semantic contract: Data adapters forage across different sources,
 * just as cormorants hunt in varied waters (rivers, lakes, oceans).
 */

import type { Entity } from '../../types/index.js';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Filter condition for querying entities
 */
export interface FilterCondition {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=';
  value: any;
}

/**
 * Base data adapter interface
 */
export interface DataAdapter {
  /**
   * Query entities from the data source
   * @param target - Target collection/table name
   * @param filters - Optional filter conditions
   */
  query(target: string, filters?: FilterCondition[]): Promise<Entity[]>;
}

/**
 * Memory-based data adapter for in-memory collections
 * Semantic: Quick access foraging in immediate territory
 */
export class MemoryDataAdapter implements DataAdapter {
  private collections: Map<string, Entity[]>;

  constructor(initialData?: Record<string, Entity[]>) {
    this.collections = new Map();
    if (initialData) {
      Object.entries(initialData).forEach(([key, entities]) => {
        this.collections.set(key, entities);
      });
    }
  }

  async query(target: string, filters?: FilterCondition[]): Promise<Entity[]> {
    const collection = this.collections.get(target);
    if (!collection) {
      return [];
    }

    if (!filters || filters.length === 0) {
      return [...collection];
    }

    return collection.filter(entity => this.matchesFilters(entity, filters));
  }

  /**
   * Add or update a collection
   */
  setCollection(name: string, entities: Entity[]): void {
    this.collections.set(name, entities);
  }

  /**
   * Get all collection names
   */
  getCollectionNames(): string[] {
    return Array.from(this.collections.keys());
  }

  private matchesFilters(entity: Entity, filters: FilterCondition[]): boolean {
    return filters.every(filter => {
      const value = this.getNestedValue(entity, filter.field);
      return this.evaluateCondition(value, filter.operator, filter.value);
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private evaluateCondition(value: any, operator: string, expected: any): boolean {
    switch (operator) {
      case '=':
        return value === expected;
      case '!=':
        return value !== expected;
      case '>':
        return value > expected;
      case '<':
        return value < expected;
      case '>=':
        return value >= expected;
      case '<=':
        return value <= expected;
      default:
        return false;
    }
  }
}

/**
 * JSON file-based data adapter
 * Semantic: Foraging from stored caches (like cormorants returning to known fishing spots)
 */
export class JSONDataAdapter implements DataAdapter {
  private basePath: string;
  private cache: Map<string, Entity[]>;
  private loaded: Set<string>;

  constructor(basePath: string = '.') {
    this.basePath = basePath;
    this.cache = new Map();
    this.loaded = new Set();
  }

  async query(target: string, filters?: FilterCondition[]): Promise<Entity[]> {
    await this.ensureLoaded(target);

    const collection = this.cache.get(target);
    if (!collection) {
      return [];
    }

    if (!filters || filters.length === 0) {
      return [...collection];
    }

    return collection.filter(entity => this.matchesFilters(entity, filters));
  }

  private async ensureLoaded(target: string): Promise<void> {
    if (this.loaded.has(target)) {
      return;
    }

    const filePath = path.join(this.basePath, `${target}.json`);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);

      // Support both array format and object with entities array
      const entities = Array.isArray(data) ? data : data.entities || [];
      this.cache.set(target, entities);
      this.loaded.add(target);
    } catch (error: any) {
      // If file doesn't exist, cache empty array
      if (error.code === 'ENOENT') {
        this.cache.set(target, []);
        this.loaded.add(target);
      } else {
        throw new Error(`Failed to load ${target}: ${error.message}`);
      }
    }
  }

  /**
   * Clear the cache for a specific target
   */
  clearCache(target?: string): void {
    if (target) {
      this.cache.delete(target);
      this.loaded.delete(target);
    } else {
      this.cache.clear();
      this.loaded.clear();
    }
  }

  private matchesFilters(entity: Entity, filters: FilterCondition[]): boolean {
    return filters.every(filter => {
      const value = this.getNestedValue(entity, filter.field);
      return this.evaluateCondition(value, filter.operator, filter.value);
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private evaluateCondition(value: any, operator: string, expected: any): boolean {
    switch (operator) {
      case '=':
        return value === expected;
      case '!=':
        return value !== expected;
      case '>':
        return value > expected;
      case '<':
        return value < expected;
      case '>=':
        return value >= expected;
      case '<=':
        return value <= expected;
      default:
        return false;
    }
  }
}

/**
 * Composite data adapter that queries multiple sources
 * Semantic: Foraging across multiple territories (like cormorants that hunt in different waters)
 */
export class CompositeDataAdapter implements DataAdapter {
  private adapters: DataAdapter[];

  constructor(adapters: DataAdapter[]) {
    this.adapters = adapters;
  }

  async query(target: string, filters?: FilterCondition[]): Promise<Entity[]> {
    const results = await Promise.all(
      this.adapters.map(adapter => adapter.query(target, filters))
    );

    // Merge results and deduplicate by ID
    const merged = new Map<string, Entity>();
    for (const entities of results) {
      for (const entity of entities) {
        if (!merged.has(entity.id)) {
          merged.set(entity.id, entity);
        }
      }
    }

    return Array.from(merged.values());
  }

  /**
   * Add an adapter to the composite
   */
  addAdapter(adapter: DataAdapter): void {
    this.adapters.push(adapter);
  }
}

/**
 * Factory function to create data adapters
 */
export function createDataAdapter(config: {
  type: 'memory' | 'json' | 'composite';
  basePath?: string;
  initialData?: Record<string, Entity[]>;
  adapters?: DataAdapter[];
}): DataAdapter {
  switch (config.type) {
    case 'memory':
      return new MemoryDataAdapter(config.initialData);

    case 'json':
      return new JSONDataAdapter(config.basePath || '.');

    case 'composite':
      return new CompositeDataAdapter(config.adapters || []);

    default:
      throw new Error(`Unknown adapter type: ${(config as any).type}`);
  }
}
