/**
 * 🪶 CAL Validator
 *
 * Semantic contract: Validation ensures observability - we verify that
 * entities exhibit the required cormorant foraging properties.
 */

import type { DimensionID } from '../types/index.js';

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validation error
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

/**
 * Entity schema requirements
 */
export interface EntitySchema {
  requireId?: boolean;
  requireName?: boolean;
  requireType?: boolean;
  requireDimensions?: DimensionID[];
  requireSound?: boolean;
  requireSpace?: boolean;
  requireTime?: boolean;
  allowAdditionalFields?: boolean;
}

/**
 * Default entity schema
 */
const DEFAULT_ENTITY_SCHEMA: EntitySchema = {
  requireId: true,
  requireName: true,
  requireType: true,
  requireSound: true,
  requireSpace: true,
  requireTime: true,
  allowAdditionalFields: true
};

/**
 * Validate an entity against schema
 */
export function validateEntity(
  entity: any,
  schema: EntitySchema = DEFAULT_ENTITY_SCHEMA
): ValidationResult {
  const errors: ValidationError[] = [];

  // Check required fields
  if (schema.requireId && !entity.id) {
    errors.push({
      field: 'id',
      message: 'Entity ID is required',
      value: entity.id
    });
  }

  if (schema.requireName && !entity.name) {
    errors.push({
      field: 'name',
      message: 'Entity name is required',
      value: entity.name
    });
  }

  if (schema.requireType && !entity.type) {
    errors.push({
      field: 'type',
      message: 'Entity type is required',
      value: entity.type
    });
  }

  // Validate 3D coordinates (Sound, Space, Time)
  if (schema.requireSound) {
    const soundError = validateCoordinate(entity.sound, 'sound');
    if (soundError) errors.push(soundError);
  }

  if (schema.requireSpace) {
    const spaceError = validateCoordinate(entity.space, 'space');
    if (spaceError) errors.push(spaceError);
  }

  if (schema.requireTime) {
    const timeError = validateCoordinate(entity.time, 'time');
    if (timeError) errors.push(timeError);
  }

  // Validate dimensions if required
  if (schema.requireDimensions && schema.requireDimensions.length > 0) {
    if (!entity.dimensions || typeof entity.dimensions !== 'object') {
      errors.push({
        field: 'dimensions',
        message: 'Dimensions object is required',
        value: entity.dimensions
      });
    } else {
      for (const dimId of schema.requireDimensions) {
        if (!entity.dimensions[dimId]) {
          errors.push({
            field: `dimensions.${dimId}`,
            message: `Dimension ${dimId} is required`,
            value: undefined
          });
        } else {
          const dimErrors = validateDimension(entity.dimensions[dimId], dimId);
          errors.push(...dimErrors);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate a coordinate value (0-10 scale)
 */
function validateCoordinate(value: any, name: string): ValidationError | null {
  if (value === undefined || value === null) {
    return {
      field: name,
      message: `${name} coordinate is required`,
      value
    };
  }

  if (typeof value !== 'number') {
    return {
      field: name,
      message: `${name} must be a number`,
      value
    };
  }

  if (value < 0 || value > 10) {
    return {
      field: name,
      message: `${name} must be between 0 and 10`,
      value
    };
  }

  return null;
}

/**
 * Validate a dimension
 */
function validateDimension(dimension: any, dimId: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (typeof dimension !== 'object' || dimension === null) {
    errors.push({
      field: `dimensions.${dimId}`,
      message: `Dimension ${dimId} must be an object`,
      value: dimension
    });
    return errors;
  }

  // Validate dimension coordinates
  const soundError = validateCoordinate(dimension.sound, `dimensions.${dimId}.sound`);
  if (soundError) errors.push(soundError);

  const spaceError = validateCoordinate(dimension.space, `dimensions.${dimId}.space`);
  if (spaceError) errors.push(spaceError);

  const timeError = validateCoordinate(dimension.time, `dimensions.${dimId}.time`);
  if (timeError) errors.push(timeError);

  return errors;
}

/**
 * Validate multiple entities
 */
export function validateEntities(
  entities: any[],
  schema: EntitySchema = DEFAULT_ENTITY_SCHEMA
): ValidationResult {
  const allErrors: ValidationError[] = [];

  if (!Array.isArray(entities)) {
    return {
      valid: false,
      errors: [{
        field: 'entities',
        message: 'Entities must be an array',
        value: entities
      }]
    };
  }

  entities.forEach((entity, index) => {
    const result = validateEntity(entity, schema);
    if (!result.valid) {
      result.errors.forEach(error => {
        allErrors.push({
          ...error,
          field: `entities[${index}].${error.field}`
        });
      });
    }
  });

  return {
    valid: allErrors.length === 0,
    errors: allErrors
  };
}

/**
 * Validate 3D Lens calculation inputs
 */
export function validate3DLens(sound: number, space: number, time: number): ValidationResult {
  const errors: ValidationError[] = [];

  const soundError = validateCoordinate(sound, 'sound');
  if (soundError) errors.push(soundError);

  const spaceError = validateCoordinate(space, 'space');
  if (spaceError) errors.push(spaceError);

  const timeError = validateCoordinate(time, 'time');
  if (timeError) errors.push(timeError);

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate DRIFT calculation inputs
 */
export function validateDrift(methodology: number, performance: number): ValidationResult {
  const errors: ValidationError[] = [];

  if (typeof methodology !== 'number') {
    errors.push({
      field: 'methodology',
      message: 'Methodology must be a number',
      value: methodology
    });
  } else if (methodology < 0 || methodology > 100) {
    errors.push({
      field: 'methodology',
      message: 'Methodology must be between 0 and 100',
      value: methodology
    });
  }

  if (typeof performance !== 'number') {
    errors.push({
      field: 'performance',
      message: 'Performance must be a number',
      value: performance
    });
  } else if (performance < 0 || performance > 100) {
    errors.push({
      field: 'performance',
      message: 'Performance must be between 0 and 100',
      value: performance
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate FETCH calculation inputs
 */
export function validateFetch(
  chirp: number,
  drift: number,
  confidence: number
): ValidationResult {
  const errors: ValidationError[] = [];

  if (typeof chirp !== 'number') {
    errors.push({
      field: 'chirp',
      message: 'Chirp must be a number',
      value: chirp
    });
  } else if (chirp < 0) {
    errors.push({
      field: 'chirp',
      message: 'Chirp must be non-negative',
      value: chirp
    });
  }

  if (typeof drift !== 'number') {
    errors.push({
      field: 'drift',
      message: 'DRIFT must be a number',
      value: drift
    });
  }

  if (typeof confidence !== 'number') {
    errors.push({
      field: 'confidence',
      message: 'Confidence must be a number',
      value: confidence
    });
  } else if (confidence < 0 || confidence > 1) {
    errors.push({
      field: 'confidence',
      message: 'Confidence must be between 0 and 1',
      value: confidence
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate data file structure
 */
export function validateDataFile(data: any): ValidationResult {
  const errors: ValidationError[] = [];

  if (typeof data !== 'object' || data === null) {
    return {
      valid: false,
      errors: [{
        field: 'root',
        message: 'Data must be an object',
        value: data
      }]
    };
  }

  if (!data.entities) {
    errors.push({
      field: 'entities',
      message: 'Data file must contain an "entities" array',
      value: undefined
    });
    return { valid: false, errors };
  }

  if (!Array.isArray(data.entities)) {
    errors.push({
      field: 'entities',
      message: '"entities" must be an array',
      value: data.entities
    });
    return { valid: false, errors };
  }

  // Validate all entities
  const entitiesResult = validateEntities(data.entities);
  if (!entitiesResult.valid) {
    errors.push(...entitiesResult.errors);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Check if dimension ID is valid
 */
export function isValidDimensionId(dimId: string): dimId is DimensionID {
  const validDimensions: DimensionID[] = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'ALL'];
  return validDimensions.includes(dimId as DimensionID);
}

/**
 * Get dimension name from ID
 */
export function getDimensionName(dimId: DimensionID): string {
  const names: Record<DimensionID, string> = {
    D1: 'Customer',
    D2: 'Employee',
    D3: 'Revenue',
    D4: 'Regulatory',
    D5: 'Quality',
    D6: 'Operational',
    ALL: 'All Dimensions'
  };
  return names[dimId];
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) {
    return 'No errors';
  }

  return errors.map((error, index) => {
    let msg = `${index + 1}. ${error.field}: ${error.message}`;
    if (error.value !== undefined) {
      msg += ` (got: ${JSON.stringify(error.value)})`;
    }
    return msg;
  }).join('\n');
}
