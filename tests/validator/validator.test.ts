/**
 * 🪶 Validator Tests
 *
 * Validates entity and dimension validation logic
 */

import { describe, it, expect } from 'vitest';
import {
  validateEntity,
  validateEntities,
  validate3DLens,
  validateDrift,
  validateFetch,
  validateDataFile,
  isValidDimensionId,
  getDimensionName,
  formatValidationErrors
} from '../../src/validator/index.js';

describe('Validator - Entity Validation', () => {
  it('should validate a valid entity', () => {
    const entity = {
      id: 'test-1',
      name: 'Test Entity',
      type: 'test',
      sound: 5,
      space: 6,
      time: 7
    };

    const result = validateEntity(entity);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject entity without ID', () => {
    const entity = {
      name: 'Test Entity',
      type: 'test',
      sound: 5,
      space: 6,
      time: 7
    };

    const result = validateEntity(entity);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].field).toBe('id');
  });

  it('should reject entity without name', () => {
    const entity = {
      id: 'test-1',
      type: 'test',
      sound: 5,
      space: 6,
      time: 7
    };

    const result = validateEntity(entity);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'name')).toBe(true);
  });

  it('should reject entity without type', () => {
    const entity = {
      id: 'test-1',
      name: 'Test Entity',
      sound: 5,
      space: 6,
      time: 7
    };

    const result = validateEntity(entity);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'type')).toBe(true);
  });

  it('should reject invalid sound coordinate', () => {
    const entity = {
      id: 'test-1',
      name: 'Test Entity',
      type: 'test',
      sound: 15, // Invalid: > 10
      space: 6,
      time: 7
    };

    const result = validateEntity(entity);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'sound')).toBe(true);
  });

  it('should reject negative space coordinate', () => {
    const entity = {
      id: 'test-1',
      name: 'Test Entity',
      type: 'test',
      sound: 5,
      space: -1, // Invalid: < 0
      time: 7
    };

    const result = validateEntity(entity);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'space')).toBe(true);
  });

  it('should reject non-numeric time coordinate', () => {
    const entity = {
      id: 'test-1',
      name: 'Test Entity',
      type: 'test',
      sound: 5,
      space: 6,
      time: 'high' // Invalid: not a number
    };

    const result = validateEntity(entity as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'time')).toBe(true);
  });

  it('should validate entity with required dimensions', () => {
    const entity = {
      id: 'test-1',
      name: 'Test Entity',
      type: 'test',
      sound: 5,
      space: 6,
      time: 7,
      dimensions: {
        D1: { sound: 5, space: 5, time: 5 },
        D2: { sound: 6, space: 6, time: 6 }
      }
    };

    const result = validateEntity(entity, {
      requireId: true,
      requireName: true,
      requireType: true,
      requireDimensions: ['D1', 'D2']
    });

    expect(result.valid).toBe(true);
  });

  it('should reject entity missing required dimension', () => {
    const entity = {
      id: 'test-1',
      name: 'Test Entity',
      type: 'test',
      sound: 5,
      space: 6,
      time: 7,
      dimensions: {
        D1: { sound: 5, space: 5, time: 5 }
        // D2 missing
      }
    };

    const result = validateEntity(entity, {
      requireDimensions: ['D1', 'D2']
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field.includes('D2'))).toBe(true);
  });

  it('should reject dimension with invalid coordinates', () => {
    const entity = {
      id: 'test-1',
      name: 'Test Entity',
      type: 'test',
      sound: 5,
      space: 6,
      time: 7,
      dimensions: {
        D1: { sound: 15, space: 5, time: 5 } // Invalid sound
      }
    };

    const result = validateEntity(entity, {
      requireDimensions: ['D1']
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field.includes('D1.sound'))).toBe(true);
  });
});

describe('Validator - Multiple Entities', () => {
  it('should validate array of valid entities', () => {
    const entities = [
      { id: '1', name: 'Entity 1', type: 'test', sound: 5, space: 5, time: 5 },
      { id: '2', name: 'Entity 2', type: 'test', sound: 6, space: 6, time: 6 }
    ];

    const result = validateEntities(entities);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject non-array input', () => {
    const result = validateEntities({} as any);
    expect(result.valid).toBe(false);
    expect(result.errors[0].field).toBe('entities');
  });

  it('should collect errors from multiple entities', () => {
    const entities = [
      { id: '1', type: 'test', sound: 5, space: 5, time: 5 }, // Missing name
      { id: '2', name: 'Entity 2', sound: 15, space: 6, time: 6 } // Invalid sound, missing type
    ];

    const result = validateEntities(entities);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].field).toContain('entities[0]');
  });
});

describe('Validator - Formula Validation', () => {
  it('should validate valid 3D Lens inputs', () => {
    const result = validate3DLens(5, 6, 7);
    expect(result.valid).toBe(true);
  });

  it('should reject invalid 3D Lens inputs', () => {
    const result = validate3DLens(15, 6, 7);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'sound')).toBe(true);
  });

  it('should validate valid DRIFT inputs', () => {
    const result = validateDrift(85, 40);
    expect(result.valid).toBe(true);
  });

  it('should reject DRIFT with out-of-range values', () => {
    const result = validateDrift(150, 40);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'methodology')).toBe(true);
  });

  it('should reject DRIFT with negative performance', () => {
    const result = validateDrift(85, -10);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'performance')).toBe(true);
  });

  it('should validate valid FETCH inputs', () => {
    const result = validateFetch(10, 45, 0.9);
    expect(result.valid).toBe(true);
  });

  it('should reject FETCH with invalid confidence', () => {
    const result = validateFetch(10, 45, 1.5);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'confidence')).toBe(true);
  });

  it('should reject FETCH with negative chirp', () => {
    const result = validateFetch(-5, 45, 0.9);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'chirp')).toBe(true);
  });
});

describe('Validator - Data File Validation', () => {
  it('should validate valid data file', () => {
    const data = {
      entities: [
        { id: '1', name: 'Entity 1', type: 'test', sound: 5, space: 5, time: 5 }
      ]
    };

    const result = validateDataFile(data);
    expect(result.valid).toBe(true);
  });

  it('should reject data without entities field', () => {
    const data = { items: [] };

    const result = validateDataFile(data);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'entities')).toBe(true);
  });

  it('should reject data with non-array entities', () => {
    const data = { entities: {} };

    const result = validateDataFile(data);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'entities')).toBe(true);
  });

  it('should reject non-object data', () => {
    const result = validateDataFile([]);
    expect(result.valid).toBe(false);
  });
});

describe('Validator - Dimension Utilities', () => {
  it('should validate correct dimension IDs', () => {
    expect(isValidDimensionId('D1')).toBe(true);
    expect(isValidDimensionId('D2')).toBe(true);
    expect(isValidDimensionId('D3')).toBe(true);
    expect(isValidDimensionId('D4')).toBe(true);
    expect(isValidDimensionId('D5')).toBe(true);
    expect(isValidDimensionId('D6')).toBe(true);
  });

  it('should reject invalid dimension IDs', () => {
    expect(isValidDimensionId('D7')).toBe(false);
    expect(isValidDimensionId('D0')).toBe(false);
    expect(isValidDimensionId('X1')).toBe(false);
    expect(isValidDimensionId('d1')).toBe(false);
  });

  it('should return correct dimension names', () => {
    expect(getDimensionName('D1')).toBe('Customer');
    expect(getDimensionName('D2')).toBe('Employee');
    expect(getDimensionName('D3')).toBe('Revenue');
    expect(getDimensionName('D4')).toBe('Regulatory');
    expect(getDimensionName('D5')).toBe('Quality');
    expect(getDimensionName('D6')).toBe('Operational');
  });
});

describe('Validator - Error Formatting', () => {
  it('should format no errors', () => {
    const result = formatValidationErrors([]);
    expect(result).toBe('No errors');
  });

  it('should format single error', () => {
    const errors = [{
      field: 'sound',
      message: 'Invalid value',
      value: 15
    }];

    const result = formatValidationErrors(errors);
    expect(result).toContain('sound');
    expect(result).toContain('Invalid value');
    expect(result).toContain('15');
  });

  it('should format multiple errors', () => {
    const errors = [
      { field: 'sound', message: 'Too high', value: 15 },
      { field: 'space', message: 'Too low', value: -1 }
    ];

    const result = formatValidationErrors(errors);
    expect(result).toContain('1.');
    expect(result).toContain('2.');
    expect(result).toContain('sound');
    expect(result).toContain('space');
  });
});
