/**
 * 🪶 Configuration Tests
 *
 * Validates configuration system functionality
 */

import { describe, it, expect } from 'vitest';
import {
  DEFAULT_CONFIG,
  mergeConfig,
  validateConfig,
  getConfigValue,
  setConfigValue
} from '../../src/config/index.js';

describe('Config - Default Configuration', () => {
  it('should have valid default config', () => {
    expect(DEFAULT_CONFIG.name).toBeDefined();
    expect(DEFAULT_CONFIG.version).toBeDefined();
    expect(DEFAULT_CONFIG.data).toBeDefined();
    expect(DEFAULT_CONFIG.alerts).toBeDefined();
    expect(DEFAULT_CONFIG.execution).toBeDefined();
    expect(DEFAULT_CONFIG.thresholds).toBeDefined();
  });

  it('should have valid default data configuration', () => {
    expect(DEFAULT_CONFIG.data?.path).toBe('./data');
    expect(DEFAULT_CONFIG.data?.adapter).toBe('json');
    expect(Array.isArray(DEFAULT_CONFIG.data?.files)).toBe(true);
  });

  it('should have valid default alert configuration', () => {
    expect(DEFAULT_CONFIG.alerts?.type).toBe('console');
    expect(DEFAULT_CONFIG.alerts?.file).toBeDefined();
  });

  it('should have valid default execution configuration', () => {
    expect(DEFAULT_CONFIG.execution?.cascadeDepth).toBe(3);
    expect(Array.isArray(DEFAULT_CONFIG.execution?.dimensions)).toBe(true);
    expect(DEFAULT_CONFIG.execution?.dimensions).toHaveLength(6);
  });

  it('should have valid default thresholds', () => {
    expect(DEFAULT_CONFIG.thresholds?.lens).toBe(6.0);
    expect(DEFAULT_CONFIG.thresholds?.drift).toBe(30);
    expect(DEFAULT_CONFIG.thresholds?.fetch).toBe(1000);
  });
});

describe('Config - Merging', () => {
  it('should merge user config with defaults', () => {
    const userConfig = {
      name: 'my-project',
      data: {
        path: './my-data'
      }
    };

    const merged = mergeConfig(DEFAULT_CONFIG, userConfig);

    expect(merged.name).toBe('my-project');
    expect(merged.data?.path).toBe('./my-data');
    expect(merged.data?.adapter).toBe('json'); // From defaults
    expect(merged.alerts?.type).toBe('console'); // From defaults
  });

  it('should override nested properties', () => {
    const userConfig = {
      thresholds: {
        lens: 8.0,
        drift: 50
      }
    };

    const merged = mergeConfig(DEFAULT_CONFIG, userConfig);

    expect(merged.thresholds?.lens).toBe(8.0);
    expect(merged.thresholds?.drift).toBe(50);
    expect(merged.thresholds?.fetch).toBe(1000); // From defaults
  });

  it('should handle empty user config', () => {
    const merged = mergeConfig(DEFAULT_CONFIG, {});

    expect(merged.name).toBe(DEFAULT_CONFIG.name);
    expect(merged.version).toBe(DEFAULT_CONFIG.version);
  });

  it('should merge array properties', () => {
    const userConfig = {
      execution: {
        dimensions: ['D1', 'D2', 'D3']
      }
    };

    const merged = mergeConfig(DEFAULT_CONFIG, userConfig);

    expect(merged.execution?.dimensions).toEqual(['D1', 'D2', 'D3']);
    expect(merged.execution?.cascadeDepth).toBe(3); // From defaults
  });
});

describe('Config - Validation', () => {
  it('should validate valid config', () => {
    const result = validateConfig(DEFAULT_CONFIG);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject invalid data adapter', () => {
    const config = {
      ...DEFAULT_CONFIG,
      data: {
        adapter: 'invalid' as any
      }
    };

    const result = validateConfig(config);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('adapter'))).toBe(true);
  });

  it('should reject invalid alert type', () => {
    const config = {
      ...DEFAULT_CONFIG,
      alerts: {
        type: 'invalid' as any
      }
    };

    const result = validateConfig(config);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('alert type'))).toBe(true);
  });

  it('should reject lens threshold out of range', () => {
    const config = {
      ...DEFAULT_CONFIG,
      thresholds: {
        lens: 15 // Invalid: > 10
      }
    };

    const result = validateConfig(config);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('lens'))).toBe(true);
  });

  it('should reject negative lens threshold', () => {
    const config = {
      ...DEFAULT_CONFIG,
      thresholds: {
        lens: -1
      }
    };

    const result = validateConfig(config);
    expect(result.valid).toBe(false);
  });

  it('should reject drift threshold out of range', () => {
    const config = {
      ...DEFAULT_CONFIG,
      thresholds: {
        drift: 150 // Invalid: > 100
      }
    };

    const result = validateConfig(config);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('drift'))).toBe(true);
  });

  it('should reject negative fetch threshold', () => {
    const config = {
      ...DEFAULT_CONFIG,
      thresholds: {
        fetch: -100
      }
    };

    const result = validateConfig(config);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('fetch'))).toBe(true);
  });

  it('should reject invalid dimension ID', () => {
    const config = {
      ...DEFAULT_CONFIG,
      execution: {
        dimensions: ['D1', 'D7'] as any // D7 is invalid
      }
    };

    const result = validateConfig(config);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('dimension'))).toBe(true);
  });

  it('should reject invalid output format', () => {
    const config = {
      ...DEFAULT_CONFIG,
      output: {
        format: 'xml' as any // Invalid format
      }
    };

    const result = validateConfig(config);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('output format'))).toBe(true);
  });

  it('should allow valid custom dimensions', () => {
    const config = {
      ...DEFAULT_CONFIG,
      execution: {
        dimensions: ['D1', 'D3', 'D5']
      }
    };

    const result = validateConfig(config);
    expect(result.valid).toBe(true);
  });
});

describe('Config - Get/Set Values', () => {
  it('should get top-level value', () => {
    const value = getConfigValue(DEFAULT_CONFIG, 'name');
    expect(value).toBe(DEFAULT_CONFIG.name);
  });

  it('should get nested value', () => {
    const value = getConfigValue(DEFAULT_CONFIG, 'data.path');
    expect(value).toBe('./data');
  });

  it('should get deeply nested value', () => {
    const value = getConfigValue(DEFAULT_CONFIG, 'thresholds.lens');
    expect(value).toBe(6.0);
  });

  it('should return undefined for non-existent path', () => {
    const value = getConfigValue(DEFAULT_CONFIG, 'nonexistent.path');
    expect(value).toBeUndefined();
  });

  it('should set top-level value', () => {
    const updated = setConfigValue(DEFAULT_CONFIG, 'name', 'new-project');
    expect(updated.name).toBe('new-project');
    expect(DEFAULT_CONFIG.name).toBe('cal-project'); // Original unchanged
  });

  it('should set nested value', () => {
    const updated = setConfigValue(DEFAULT_CONFIG, 'data.path', './new-data');
    expect(updated.data?.path).toBe('./new-data');
    expect(DEFAULT_CONFIG.data?.path).toBe('./data'); // Original unchanged
  });

  it('should set deeply nested value', () => {
    const updated = setConfigValue(DEFAULT_CONFIG, 'thresholds.lens', 8.0);
    expect(updated.thresholds?.lens).toBe(8.0);
    expect(DEFAULT_CONFIG.thresholds?.lens).toBe(6.0); // Original unchanged
  });

  it('should create missing intermediate objects', () => {
    const config = { name: 'test' };
    const updated = setConfigValue(config as any, 'new.nested.value', 42);
    expect(updated.new.nested.value).toBe(42);
  });
});

describe('Config - Real-World Scenarios', () => {
  it('should support minimal config override', () => {
    const userConfig = {
      name: 'ai-cascade-analysis'
    };

    const merged = mergeConfig(DEFAULT_CONFIG, userConfig);
    const validation = validateConfig(merged);

    expect(validation.valid).toBe(true);
    expect(merged.name).toBe('ai-cascade-analysis');
    expect(merged.data?.adapter).toBe('json');
  });

  it('should support complete custom config', () => {
    const userConfig = {
      name: 'custom-project',
      version: '1.0.0',
      data: {
        path: './custom-data',
        adapter: 'composite' as const
      },
      alerts: {
        type: 'file' as const,
        file: './custom-alerts.log'
      },
      thresholds: {
        lens: 7.5,
        drift: 40,
        fetch: 2000
      },
      execution: {
        dimensions: ['D1', 'D2', 'D3']
      }
    };

    const merged = mergeConfig(DEFAULT_CONFIG, userConfig);
    const validation = validateConfig(merged);

    expect(validation.valid).toBe(true);
    expect(merged.name).toBe('custom-project');
    expect(merged.data?.adapter).toBe('composite');
    expect(merged.thresholds?.fetch).toBe(2000);
  });

  it('should detect and reject invalid custom config', () => {
    const userConfig = {
      thresholds: {
        lens: 15, // Invalid
        drift: 40
      },
      alerts: {
        type: 'invalid' as any
      }
    };

    const merged = mergeConfig(DEFAULT_CONFIG, userConfig);
    const validation = validateConfig(merged);

    expect(validation.valid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });
});
