/**
 * CAL Runtime - Main export file
 *
 * Cascade Analysis Language Runtime
 */

// Parser
export { compile } from './parser/index.js';

// Executor
export { Executor } from './executor/index.js';

// Analyzer — the formulas themselves, for callers that need to compute
// DRIFT/FETCH from raw inputs without running a full CAL script through
// the executor (e.g. validating or generating a pre-authored score).
export { calculateDrift, calculateFetch } from './analyzer/index.js';

// Adapters
export { createDataAdapter } from './adapters/data/index.js';
export { createAlertAdapter } from './adapters/alerts/index.js';

// Types
export type {
  Entity,
  Dimension,
  DimensionID,
  ActionPlan,
  DriftResult,
  FetchResult,
  ExecutionResult,
} from './types/index.js';

// Config
export { loadConfig, saveConfig, validateConfig, mergeConfig, DEFAULT_CONFIG } from './config/index.js';
export type { CALConfig } from './config/index.js';

// Validator
export { validateEntity } from './validator/index.js';
