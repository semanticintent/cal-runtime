/**
 * 🪶 CAL Configuration
 *
 * Semantic contract: Configuration establishes the observation territory -
 * defining where and how the cormorant will forage.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type { DimensionID } from '../types/index.js';

/**
 * CAL project configuration
 */
export interface CALConfig {
  /** Project name */
  name?: string;

  /** Project version */
  version?: string;

  /** Data sources configuration */
  data?: {
    /** Default data path */
    path?: string;
    /** Data file patterns */
    files?: string[];
    /** Default data adapter type */
    adapter?: 'json' | 'memory' | 'composite';
  };

  /** Alert configuration */
  alerts?: {
    /** Default alert type */
    type?: 'console' | 'file' | 'json' | 'multi';
    /** Alert log file path */
    file?: string;
    /** Webhook URLs for alerts */
    webhooks?: {
      url: string;
      format?: 'slack' | 'discord' | 'generic';
    }[];
  };

  /** Execution defaults */
  execution?: {
    /** Default cascade depth */
    cascadeDepth?: number;
    /** Default dimensions to analyze */
    dimensions?: DimensionID[];
    /** Timeout for execution (ms) */
    timeout?: number;
  };

  /** Formula thresholds */
  thresholds?: {
    /** 3D Lens threshold for urgency */
    lens?: number;
    /** DRIFT threshold for gap detection */
    drift?: number;
    /** FETCH threshold for action triggers */
    fetch?: number;
  };

  /** Validation rules */
  validation?: {
    /** Require all 6D dimensions */
    requireAllDimensions?: boolean;
    /** Require metadata fields */
    requireMetadata?: boolean;
    /** Custom validation rules */
    customRules?: Record<string, any>;
  };

  /** Output configuration */
  output?: {
    /** Default output format */
    format?: 'json' | 'yaml' | 'text';
    /** Output directory */
    directory?: string;
    /** Pretty print JSON */
    pretty?: boolean;
  };
}

/**
 * Default CAL configuration
 */
export const DEFAULT_CONFIG: CALConfig = {
  name: 'cal-project',
  version: '0.1.0',
  data: {
    path: './data',
    files: ['*.json'],
    adapter: 'json'
  },
  alerts: {
    type: 'console',
    file: './cal-alerts.log'
  },
  execution: {
    cascadeDepth: 3,
    dimensions: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'],
    timeout: 30000
  },
  thresholds: {
    lens: 6.0,
    drift: 30,
    fetch: 1000
  },
  validation: {
    requireAllDimensions: false,
    requireMetadata: false
  },
  output: {
    format: 'json',
    directory: './output',
    pretty: true
  }
};

/**
 * Configuration file names to search for
 */
const CONFIG_FILE_NAMES = [
  'cal.config.json',
  '.calrc.json',
  '.calrc',
  'package.json' // Look for "cal" field in package.json
];

/**
 * Load configuration from file
 */
export async function loadConfig(configPath?: string): Promise<CALConfig> {
  // If specific path provided, load from there
  if (configPath) {
    try {
      const content = await fs.readFile(configPath, 'utf-8');
      return parseConfig(content, path.extname(configPath));
    } catch (error: any) {
      throw new Error(`Failed to load config from ${configPath}: ${error.message}`);
    }
  }

  // Otherwise, search for config files
  for (const fileName of CONFIG_FILE_NAMES) {
    try {
      const content = await fs.readFile(fileName, 'utf-8');
      const config = parseConfig(content, path.extname(fileName));

      // Special handling for package.json
      if (fileName === 'package.json') {
        const pkg = JSON.parse(content);
        if (pkg.cal) {
          return mergeConfig(DEFAULT_CONFIG, pkg.cal);
        }
        continue; // No cal field, try next file
      }

      return mergeConfig(DEFAULT_CONFIG, config);
    } catch (error: any) {
      // File not found or parse error, continue to next
      continue;
    }
  }

  // No config file found, return defaults
  return DEFAULT_CONFIG;
}

/**
 * Parse configuration content
 */
function parseConfig(content: string, ext: string): CALConfig {
  if (ext === '.json' || ext === '') {
    return JSON.parse(content);
  }

  // For .calrc without extension, try JSON first
  try {
    return JSON.parse(content);
  } catch {
    throw new Error('Config file must be valid JSON');
  }
}

/**
 * Merge user config with defaults
 */
export function mergeConfig(defaults: CALConfig, user: Partial<CALConfig>): CALConfig {
  return {
    name: user.name ?? defaults.name,
    version: user.version ?? defaults.version,
    data: {
      ...defaults.data,
      ...user.data
    },
    alerts: {
      ...defaults.alerts,
      ...user.alerts
    },
    execution: {
      ...defaults.execution,
      ...user.execution
    },
    thresholds: {
      ...defaults.thresholds,
      ...user.thresholds
    },
    validation: {
      ...defaults.validation,
      ...user.validation
    },
    output: {
      ...defaults.output,
      ...user.output
    }
  };
}

/**
 * Save configuration to file
 */
export async function saveConfig(config: CALConfig, filePath: string = 'cal.config.json'): Promise<void> {
  const content = JSON.stringify(config, null, 2);
  await fs.writeFile(filePath, content, 'utf-8');
}

/**
 * Initialize a new CAL project
 */
export async function initProject(projectName?: string): Promise<CALConfig> {
  const config: CALConfig = {
    ...DEFAULT_CONFIG,
    name: projectName || 'cal-project',
    version: '0.1.0'
  };

  // Create directories
  await fs.mkdir(config.data!.path!, { recursive: true });
  await fs.mkdir(config.output!.directory!, { recursive: true });

  // Save config
  await saveConfig(config);

  return config;
}

/**
 * Validate configuration
 */
export function validateConfig(config: CALConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate data configuration
  if (config.data?.adapter && !['json', 'memory', 'composite'].includes(config.data.adapter)) {
    errors.push(`Invalid data adapter: ${config.data.adapter}`);
  }

  // Validate alert configuration
  if (config.alerts?.type && !['console', 'file', 'json', 'multi'].includes(config.alerts.type)) {
    errors.push(`Invalid alert type: ${config.alerts.type}`);
  }

  // Validate thresholds
  if (config.thresholds?.lens !== undefined) {
    if (config.thresholds.lens < 0 || config.thresholds.lens > 10) {
      errors.push('lens threshold must be between 0 and 10');
    }
  }

  if (config.thresholds?.drift !== undefined) {
    if (config.thresholds.drift < 0 || config.thresholds.drift > 100) {
      errors.push('drift threshold must be between 0 and 100');
    }
  }

  if (config.thresholds?.fetch !== undefined) {
    if (config.thresholds.fetch < 0) {
      errors.push('fetch threshold must be non-negative');
    }
  }

  // Validate dimensions
  if (config.execution?.dimensions) {
    const validDims: DimensionID[] = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];
    for (const dim of config.execution.dimensions) {
      if (!validDims.includes(dim)) {
        errors.push(`Invalid dimension: ${dim}`);
      }
    }
  }

  // Validate output format
  if (config.output?.format && !['json', 'yaml', 'text'].includes(config.output.format)) {
    errors.push(`Invalid output format: ${config.output.format}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get configuration value by path
 */
export function getConfigValue(config: CALConfig, path: string): any {
  const parts = path.split('.');
  let current: any = config;

  for (const part of parts) {
    if (current === undefined || current === null) {
      return undefined;
    }
    current = current[part];
  }

  return current;
}

/**
 * Set configuration value by path
 */
export function setConfigValue(config: CALConfig, path: string, value: any): CALConfig {
  const parts = path.split('.');
  const result = JSON.parse(JSON.stringify(config)); // Deep clone
  let current: any = result;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (current[part] === undefined) {
      current[part] = {};
    }
    current = current[part];
  }

  current[parts[parts.length - 1]] = value;
  return result;
}
