/**
 * 🪶 Data Adapter Tests
 *
 * Validates data source foraging implementations
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  MemoryDataAdapter,
  JSONDataAdapter,
  CompositeDataAdapter,
  createDataAdapter,
  type FilterCondition
} from '../../src/adapters/data/index.js';
import type { Entity } from '../../src/types/index.js';

describe('MemoryDataAdapter', () => {
  let adapter: MemoryDataAdapter;

  const testEntities: Entity[] = [
    {
      id: 'tailwind-css',
      name: 'Tailwind CSS',
      type: 'technology',
      sound: 9,
      space: 8,
      time: 9,
      baseCost: 300000,
      currency: 'USD'
    },
    {
      id: 'stable-enterprise',
      name: 'Stable Enterprise',
      type: 'technology',
      sound: 3,
      space: 5,
      time: 2,
      baseCost: 100000,
      currency: 'USD'
    }
  ];

  beforeEach(() => {
    adapter = new MemoryDataAdapter({
      entities: testEntities
    });
  });

  it('should query all entities without filters', async () => {
    const results = await adapter.query('entities');
    expect(results).toHaveLength(2);
    expect(results[0].id).toBe('tailwind-css');
    expect(results[1].id).toBe('stable-enterprise');
  });

  it('should return empty array for non-existent collection', async () => {
    const results = await adapter.query('nonexistent');
    expect(results).toHaveLength(0);
  });

  it('should filter by equality', async () => {
    const filters: FilterCondition[] = [
      { field: 'type', operator: '=', value: 'technology' }
    ];
    const results = await adapter.query('entities', filters);
    expect(results).toHaveLength(2);
  });

  it('should filter by greater than', async () => {
    const filters: FilterCondition[] = [
      { field: 'sound', operator: '>', value: 5 }
    ];
    const results = await adapter.query('entities', filters);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('tailwind-css');
  });

  it('should filter by less than', async () => {
    const filters: FilterCondition[] = [
      { field: 'baseCost', operator: '<', value: 200000 }
    ];
    const results = await adapter.query('entities', filters);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('stable-enterprise');
  });

  it('should filter by multiple conditions', async () => {
    const filters: FilterCondition[] = [
      { field: 'sound', operator: '>=', value: 3 },
      { field: 'space', operator: '>=', value: 5 }
    ];
    const results = await adapter.query('entities', filters);
    expect(results).toHaveLength(2);
  });

  it('should filter by not equal', async () => {
    const filters: FilterCondition[] = [
      { field: 'id', operator: '!=', value: 'tailwind-css' }
    ];
    const results = await adapter.query('entities', filters);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('stable-enterprise');
  });

  it('should support nested field access', async () => {
    const complexEntities: any[] = [
      {
        id: 'entity-1',
        name: 'Entity 1',
        type: 'test',
        metadata: { score: 10 }
      },
      {
        id: 'entity-2',
        name: 'Entity 2',
        type: 'test',
        metadata: { score: 5 }
      }
    ];

    adapter.setCollection('complex', complexEntities as Entity[]);

    const filters: FilterCondition[] = [
      { field: 'metadata.score', operator: '>', value: 7 }
    ];
    const results = await adapter.query('complex', filters);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('entity-1');
  });

  it('should list collection names', () => {
    const names = adapter.getCollectionNames();
    expect(names).toContain('entities');
  });

  it('should set and query new collection', async () => {
    const newEntities: Entity[] = [
      {
        id: 'new-entity',
        name: 'New Entity',
        type: 'test',
        sound: 5,
        space: 5,
        time: 5
      }
    ];

    adapter.setCollection('new', newEntities);
    const results = await adapter.query('new');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('new-entity');
  });
});

describe('JSONDataAdapter', () => {
  it('should return empty array for non-existent file', async () => {
    const adapter = new JSONDataAdapter('./test-data');
    const results = await adapter.query('nonexistent');
    expect(results).toHaveLength(0);
  });

  it('should support cache clearing', async () => {
    const adapter = new JSONDataAdapter('./test-data');
    await adapter.query('entities');
    adapter.clearCache('entities');
    // Cache should be cleared, next query will reload
    const results = await adapter.query('entities');
    expect(Array.isArray(results)).toBe(true);
  });

  it('should clear all caches', async () => {
    const adapter = new JSONDataAdapter('./test-data');
    await adapter.query('entities');
    adapter.clearCache(); // Clear all
    const results = await adapter.query('entities');
    expect(Array.isArray(results)).toBe(true);
  });
});

describe('CompositeDataAdapter', () => {
  it('should query from multiple adapters', async () => {
    const adapter1 = new MemoryDataAdapter({
      entities: [
        {
          id: 'entity-1',
          name: 'Entity 1',
          type: 'test',
          sound: 5,
          space: 5,
          time: 5
        }
      ]
    });

    const adapter2 = new MemoryDataAdapter({
      entities: [
        {
          id: 'entity-2',
          name: 'Entity 2',
          type: 'test',
          sound: 7,
          space: 7,
          time: 7
        }
      ]
    });

    const composite = new CompositeDataAdapter([adapter1, adapter2]);
    const results = await composite.query('entities');

    expect(results).toHaveLength(2);
    expect(results.map(e => e.id).sort()).toEqual(['entity-1', 'entity-2']);
  });

  it('should deduplicate entities by ID', async () => {
    const sharedEntity: Entity = {
      id: 'shared',
      name: 'Shared Entity',
      type: 'test',
      sound: 5,
      space: 5,
      time: 5
    };

    const adapter1 = new MemoryDataAdapter({
      entities: [sharedEntity]
    });

    const adapter2 = new MemoryDataAdapter({
      entities: [sharedEntity]
    });

    const composite = new CompositeDataAdapter([adapter1, adapter2]);
    const results = await composite.query('entities');

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('shared');
  });

  it('should support adding adapters dynamically', async () => {
    const composite = new CompositeDataAdapter([]);

    const adapter = new MemoryDataAdapter({
      entities: [
        {
          id: 'entity-1',
          name: 'Entity 1',
          type: 'test',
          sound: 5,
          space: 5,
          time: 5
        }
      ]
    });

    composite.addAdapter(adapter);
    const results = await composite.query('entities');

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('entity-1');
  });

  it('should apply filters to all adapters', async () => {
    const adapter1 = new MemoryDataAdapter({
      entities: [
        {
          id: 'entity-1',
          name: 'Entity 1',
          type: 'test',
          sound: 3,
          space: 5,
          time: 5
        }
      ]
    });

    const adapter2 = new MemoryDataAdapter({
      entities: [
        {
          id: 'entity-2',
          name: 'Entity 2',
          type: 'test',
          sound: 8,
          space: 7,
          time: 7
        }
      ]
    });

    const composite = new CompositeDataAdapter([adapter1, adapter2]);
    const filters: FilterCondition[] = [
      { field: 'sound', operator: '>', value: 5 }
    ];

    const results = await composite.query('entities', filters);

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('entity-2');
  });
});

describe('createDataAdapter', () => {
  it('should create memory adapter', () => {
    const adapter = createDataAdapter({
      type: 'memory',
      initialData: {
        entities: []
      }
    });

    expect(adapter).toBeInstanceOf(MemoryDataAdapter);
  });

  it('should create JSON adapter', () => {
    const adapter = createDataAdapter({
      type: 'json',
      basePath: './data'
    });

    expect(adapter).toBeInstanceOf(JSONDataAdapter);
  });

  it('should create composite adapter', () => {
    const adapter = createDataAdapter({
      type: 'composite',
      adapters: []
    });

    expect(adapter).toBeInstanceOf(CompositeDataAdapter);
  });

  it('should throw on unknown adapter type', () => {
    expect(() => {
      createDataAdapter({ type: 'unknown' as any });
    }).toThrow('Unknown adapter type');
  });
});
