#!/usr/bin/env node
/**
 * 🪶 CAL CLI - Cormorant Agentic Language Command-Line Interface
 *
 * Semantic contract: The CLI is the perch from which we observe
 * and initiate cascade analysis - a stable vantage point for the cormorant.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { compile } from '../parser/index.js';
import { Executor } from '../executor/index.js';
import { createDataAdapter } from '../adapters/data/index.js';
import { createAlertAdapter } from '../adapters/alerts/index.js';
import type { ActionPlan } from '../types/index.js';
import { initCommand } from './init.js';
import { scaffoldCommand } from './scaffold.js';

const VERSION = '0.1.0';

const BANNER = `
🪶 ═══════════════════════════════════════════════════════════════════
   Cormorant Agentic Language (CAL) v${VERSION}
   Sound × Space × Time → 6D Analysis → Action
🪶 ═══════════════════════════════════════════════════════════════════
`;

/**
 * CLI options parsed from command-line arguments
 */
interface CLIOptions {
  command: 'run' | 'analyze' | 'validate' | 'init' | 'scaffold' | 'help' | 'version';
  script?: string;
  inline?: string;
  name?: string;
  subcommand?: string;
  dataFile?: string;
  dataPath?: string;
  outputFile?: string;
  alertType: 'console' | 'file' | 'json';
  alertFile?: string;
  verbose: boolean;
  quiet: boolean;
}

/**
 * Parse command-line arguments
 */
export function parseArgs(args: string[]): CLIOptions {
  const options: CLIOptions = {
    command: 'run',
    alertType: 'console',
    verbose: false,
    quiet: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case 'run':
      case 'analyze':
      case 'validate':
      case 'help':
      case 'version':
        options.command = arg;
        break;

      case 'init':
        options.command = 'init';
        // Next positional arg is the project name
        if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
          options.name = args[++i];
        }
        break;

      case 'scaffold':
        options.command = 'scaffold';
        // Next positional arg is the subcommand (e.g., "entity")
        if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
          options.subcommand = args[++i];
        }
        break;

      case '--inline':
      case '-i':
        options.inline = args[++i];
        break;

      case '--data':
      case '-d':
        options.dataFile = args[++i];
        break;

      case '--data-path':
        options.dataPath = args[++i];
        break;

      case '--output':
      case '-o':
        options.outputFile = args[++i];
        break;

      case '--alert':
      case '-a':
        const alertType = args[++i];
        if (alertType === 'console' || alertType === 'file' || alertType === 'json') {
          options.alertType = alertType;
        }
        break;

      case '--alert-file':
        options.alertFile = args[++i];
        break;

      case '--verbose':
      case '-v':
        options.verbose = true;
        break;

      case '--quiet':
      case '-q':
        options.quiet = true;
        break;

      default:
        if (!arg.startsWith('-') && !options.script) {
          options.script = arg;
        }
    }
  }

  return options;
}

/**
 * Show help information
 */
export function showHelp(): void {
  console.log(`
${BANNER}

USAGE:
  cal run <script.cal> [options]           Execute a CAL script
  cal analyze <script.cal> [options]       Analyze without execution
  cal validate <script.cal>                Validate script syntax
  cal init [name]                          Scaffold a new CAL project
  cal scaffold entity                      Interactive entity JSON generator
  cal help                                 Show this help
  cal version                              Show version

OPTIONS:
  --inline, -i <code>       Inline CAL code instead of file
  --data, -d <file>         Single data file (JSON)
  --data-path <dir>         Directory with data files
  --output, -o <file>       Output file (JSON results)
  --alert, -a <type>        Alert type: console, file, json
  --alert-file <file>       Alert log file (for file alerts)
  --verbose, -v             Verbose output
  --quiet, -q               Minimal output

EXAMPLES:
  cal run analysis.cal --data entities.json
  cal run --inline "FORAGE entities WHERE sound > 5" --data-path ./data
  cal analyze script.cal --verbose
  cal validate script.cal

CAL KEYWORDS:
  FORAGE    Query/search data
  DIVE      Deep cascade analysis with 6D dimensions
  PERCH     Set up observation (Space)
  LISTEN    Monitor signals (Sound)
  WAKE      Time-based trigger (Time)
  CHIRP     Send alert/notification
  TRACE     Follow cascade pathways
  SURFACE   Output results

6D DIMENSIONS:
  D1 = Customer      D2 = Employee      D3 = Revenue
  D4 = Regulatory    D5 = Quality       D6 = Operational

FORMULAS:
  3D Lens = (Sound × Space × Time) / 10
  DRIFT = Methodology - Performance
  FETCH = Chirp × |DRIFT| × Confidence
`);
}

/**
 * Show version information
 */
export function showVersion(): void {
  console.log(`CAL (Cormorant Agentic Language) v${VERSION}`);
  console.log(`Runtime: Node.js ${process.version}`);
}

/**
 * Run command - execute a CAL script
 */
export async function runCommand(options: CLIOptions): Promise<void> {
  if (!options.quiet) {
    console.log(BANNER);
  }

  // Get CAL source
  let source: string;
  if (options.inline) {
    source = options.inline;
    if (!options.quiet) {
      console.log('📝 Inline CAL code\n');
    }
  } else if (options.script) {
    try {
      source = await fs.readFile(options.script, 'utf-8');
      if (!options.quiet) {
        console.log(`📄 Script: ${options.script}\n`);
      }
    } catch (error: any) {
      console.error(`❌ Error reading script: ${error.message}`);
      process.exit(1);
    }
  } else {
    console.error('❌ No script provided. Use --inline or specify a file.');
    process.exit(1);
  }

  // Show source if verbose
  if (options.verbose) {
    console.log('─── SOURCE ───');
    console.log(source);
    console.log('');
  }

  // Parse CAL
  if (!options.quiet) {
    console.log('🔧 Parsing CAL...');
  }

  let actionPlan: ActionPlan;
  try {
    const compileResult = compile(source);
    if (!compileResult.success) {
      throw compileResult.error;
    }
    actionPlan = compileResult.actionPlan;
    if (!options.quiet) {
      console.log('✅ Parsing successful\n');
    }
  } catch (error: any) {
    console.error('\n❌ Parse Error:');
    console.error(`   ${error.message}`);
    if (error.location) {
      console.error(`   at line ${error.location.start.line}, column ${error.location.start.column}`);
    }
    process.exit(1);
  }

  if (options.verbose) {
    console.log('─── ACTION PLAN ───');
    console.log(JSON.stringify(actionPlan, null, 2));
    console.log('');
  }

  // Set up data adapter
  let dataAdapter;
  if (options.dataFile) {
    if (!options.quiet) {
      console.log(`📊 Loading data: ${options.dataFile}`);
    }
    dataAdapter = createDataAdapter({
      type: 'json',
      basePath: path.dirname(options.dataFile)
    });
  } else if (options.dataPath) {
    if (!options.quiet) {
      console.log(`📊 Data path: ${options.dataPath}`);
    }
    dataAdapter = createDataAdapter({
      type: 'json',
      basePath: options.dataPath
    });
  } else {
    if (!options.quiet) {
      console.log('📊 Using memory adapter (no data source specified)\n');
    }
    dataAdapter = createDataAdapter({
      type: 'memory',
      initialData: {}
    });
  }

  // Set up alert adapter (need to wrap to match executor interface)
  const baseAlertAdapter = createAlertAdapter({
    type: options.alertType,
    filePath: options.alertFile || './cal-alerts.log'
  });

  // Wrap to match executor Alert interface
  const alertAdapter = {
    async send(alert: any) {
      await baseAlertAdapter.send(alert);
      return { success: true, message: '' };
    }
  };

  // Create executor
  const executor = new Executor({ dataAdapter, alertAdapter });

  // Execute
  if (!options.quiet) {
    console.log('🚀 Executing action plan...\n');
  }

  try {
    const result = await executor.execute(actionPlan);

    // Show results
    if (!options.quiet) {
      console.log('─── EXECUTION RESULTS ───\n');
      console.log(`✅ Execution completed\n`);
      console.log(`Actions executed: ${result.actions.length}`);
      console.log(`Outputs: ${Object.keys(result.outputs).length}`);
      console.log(`Watchers: ${result.watchers.length}\n`);

      // Show outputs
      if (Object.keys(result.outputs).length > 0) {
        console.log('─── OUTPUTS ───\n');
        for (const [name, value] of Object.entries(result.outputs)) {
          console.log(`📦 ${name}:`);
          if (Array.isArray(value)) {
            console.log(`   Type: Array`);
            console.log(`   Count: ${value.length}`);
            if (options.verbose && value.length > 0) {
              console.log(`   Sample: ${JSON.stringify(value[0], null, 2)}`);
            }
          } else if (typeof value === 'object' && value !== null) {
            console.log(`   Type: Object`);
            console.log(`   Keys: ${Object.keys(value).length}`);
          } else {
            console.log(`   Value: ${value}`);
          }
          console.log('');
        }
      }
    }

    // Write output file if specified
    if (options.outputFile) {
      if (!options.quiet) {
        console.log(`💾 Writing results to: ${options.outputFile}`);
      }
      await fs.writeFile(options.outputFile, JSON.stringify(result, null, 2));
      if (!options.quiet) {
        console.log('✅ Results saved\n');
      }
    }

    // Show full JSON if verbose
    if (options.verbose) {
      console.log('─── FULL RESULT JSON ───');
      console.log(JSON.stringify(result, null, 2));
    }

    if (!options.quiet) {
      console.log('🪶 Done.\n');
    }
  } catch (error: any) {
    console.error('\n❌ Execution Error:');
    console.error(`   ${error.message}`);
    if (options.verbose && error.stack) {
      console.error('\n─── STACK TRACE ───');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

/**
 * Analyze command - parse and analyze without execution
 */
export async function analyzeCommand(options: CLIOptions): Promise<void> {
  if (!options.quiet) {
    console.log(BANNER);
  }

  // Get CAL source
  let source: string;
  if (options.inline) {
    source = options.inline;
  } else if (options.script) {
    try {
      source = await fs.readFile(options.script, 'utf-8');
      if (!options.quiet) {
        console.log(`📄 Analyzing: ${options.script}\n`);
      }
    } catch (error: any) {
      console.error(`❌ Error reading script: ${error.message}`);
      process.exit(1);
    }
  } else {
    console.error('❌ No script provided.');
    process.exit(1);
  }

  // Parse
  if (!options.quiet) {
    console.log('🔧 Parsing CAL...');
  }

  try {
    const compileResult = compile(source);
    if (!compileResult.success) {
      throw compileResult.error;
    }
    const actionPlan = compileResult.actionPlan;
    if (!options.quiet) {
      console.log('✅ Parsing successful\n');
    }

    // Analyze structure
    console.log('─── ANALYSIS ───\n');
    console.log(`Actions: ${actionPlan.actions.length}`);

    const actionTypes = new Map<string, number>();
    for (const action of actionPlan.actions) {
      const count = actionTypes.get(action.action) || 0;
      actionTypes.set(action.action, count + 1);
    }

    console.log('\nAction breakdown:');
    for (const [type, count] of actionTypes.entries()) {
      console.log(`  ${type}: ${count}`);
    }

    console.log('');

    // Show detailed plan if verbose
    if (options.verbose) {
      console.log('─── ACTION PLAN ───');
      console.log(JSON.stringify(actionPlan, null, 2));
      console.log('');
    }

    // Write output if specified
    if (options.outputFile) {
      await fs.writeFile(options.outputFile, JSON.stringify(actionPlan, null, 2));
      console.log(`💾 Analysis saved to: ${options.outputFile}\n`);
    }

    console.log('🪶 Analysis complete.\n');
  } catch (error: any) {
    console.error('\n❌ Parse Error:');
    console.error(`   ${error.message}`);
    if (error.location) {
      console.error(`   at line ${error.location.start.line}, column ${error.location.start.column}`);
    }
    process.exit(1);
  }
}

/**
 * Validate command - check syntax only
 */
export async function validateCommand(options: CLIOptions): Promise<void> {
  // Get CAL source
  let source: string;
  if (options.inline) {
    source = options.inline;
  } else if (options.script) {
    try {
      source = await fs.readFile(options.script, 'utf-8');
    } catch (error: any) {
      console.error(`❌ Error reading script: ${error.message}`);
      process.exit(1);
    }
  } else {
    console.error('❌ No script provided.');
    process.exit(1);
  }

  // Parse
  try {
    const compileResult = compile(source);
    if (!compileResult.success) {
      throw compileResult.error;
    }
    console.log(`✅ ${options.script || 'Script'} is valid`);
  } catch (error: any) {
    console.error(`❌ Validation failed: ${error.message}`);
    if (error.location) {
      console.error(`   at line ${error.location.start.line}, column ${error.location.start.column}`);
    }
    process.exit(1);
  }
}

/**
 * Main CLI entry point
 */
export async function main(argv: string[] = process.argv): Promise<void> {
  const args = argv.slice(2);

  // Handle no arguments
  if (args.length === 0) {
    showHelp();
    return;
  }

  // Parse arguments
  const options = parseArgs(args);

  // Execute command
  switch (options.command) {
    case 'help':
      showHelp();
      break;

    case 'version':
      showVersion();
      break;

    case 'run':
      await runCommand(options);
      break;

    case 'analyze':
      await analyzeCommand(options);
      break;

    case 'validate':
      await validateCommand(options);
      break;

    case 'init':
      await initCommand({ name: options.name, quiet: options.quiet });
      break;

    case 'scaffold':
      await scaffoldCommand({ subcommand: options.subcommand, quiet: options.quiet });
      break;

    default:
      console.error(`❌ Unknown command: ${options.command}`);
      console.error('Run "cal help" for usage information.');
      process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  });
}
