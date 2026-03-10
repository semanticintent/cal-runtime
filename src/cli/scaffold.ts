/**
 * 🪶 CAL Scaffold — Interactive Entity Builder
 *
 * Semantic contract: Guides users through creating entity JSON
 * with 6D dimension scoring, teaching the framework as they go.
 */

import * as readline from 'readline/promises';
import { stdin, stdout } from 'process';
import * as fs from 'fs/promises';
import * as path from 'path';
import { DIMENSION_SEMANTICS } from '../types/index.js';
import type { DimensionID, DimensionSignal, Entity } from '../types/index.js';

interface ScaffoldOptions {
  subcommand?: string;
  quiet?: boolean;
}

const DIMENSIONS: DimensionID[] = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];

const SIGNAL_HINTS: Record<string, string> = {
  sound: 'How loud/urgent is the signal?',
  space: 'How wide is the reach/scope?',
  time:  'How fast is the velocity/change?',
};

/**
 * Ask a string question with optional default and validation
 */
async function askString(
  rl: readline.Interface,
  prompt: string,
  defaultVal?: string,
  pattern?: RegExp
): Promise<string> {
  const suffix = defaultVal ? ` [${defaultVal}]` : '';
  while (true) {
    const answer = (await rl.question(`   ${prompt}${suffix}: `)).trim();
    const value = answer || defaultVal || '';
    if (!value) {
      console.log('   ⚠ Required field — please enter a value.');
      continue;
    }
    if (pattern && !pattern.test(value)) {
      console.log(`   ⚠ Invalid format. Expected pattern: ${pattern}`);
      continue;
    }
    return value;
  }
}

/**
 * Ask a number question with range validation
 */
async function askNumber(
  rl: readline.Interface,
  prompt: string,
  min: number,
  max: number,
  defaultVal?: number
): Promise<number> {
  const suffix = defaultVal !== undefined ? ` [${defaultVal}]` : '';
  while (true) {
    const answer = (await rl.question(`   ${prompt} (${min}-${max})${suffix}: `)).trim();
    if (!answer && defaultVal !== undefined) return defaultVal;
    const num = parseInt(answer, 10);
    if (isNaN(num) || num < min || num > max) {
      console.log(`   ⚠ Enter a number between ${min} and ${max}.`);
      continue;
    }
    return num;
  }
}

/**
 * Ask a choice question
 */
async function askChoice(
  rl: readline.Interface,
  prompt: string,
  choices: string[],
  defaultVal?: string
): Promise<string> {
  const suffix = defaultVal ? ` [${defaultVal}]` : '';
  const choiceStr = choices.join('/');
  while (true) {
    const answer = (await rl.question(`   ${prompt} (${choiceStr})${suffix}: `)).trim().toLowerCase();
    const value = answer || defaultVal || '';
    if (!choices.includes(value)) {
      console.log(`   ⚠ Choose one of: ${choiceStr}`);
      continue;
    }
    return value;
  }
}

/**
 * Score one dimension interactively
 */
async function scoreDimension(
  rl: readline.Interface,
  dimId: DimensionID
): Promise<DimensionSignal | null> {
  const dim = DIMENSION_SEMANTICS[dimId];
  const affected = await askChoice(
    rl,
    `Is ${dim.id} (${dim.name} — ${dim.description}) affected?`,
    ['y', 'n'],
    'y'
  );

  if (affected === 'n') return null;

  console.log(`\n   Scoring ${dim.id} (${dim.name}):`);
  const sound = await askNumber(rl, `   Sound — ${SIGNAL_HINTS.sound}`, 1, 10, 5);
  const space = await askNumber(rl, `   Space — ${SIGNAL_HINTS.space}`, 1, 10, 5);
  const time  = await askNumber(rl, `   Time  — ${SIGNAL_HINTS.time}`, 1, 10, 5);
  const notes = (await rl.question('      Notes (optional): ')).trim() || undefined;

  const score = (sound * space * time) / 10;
  console.log(`   → Score: ${score.toFixed(1)}\n`);

  return { sound, space, time, notes };
}

/**
 * Build an entity from collected answers (pure function, testable)
 */
export function buildEntityJSON(entity: Entity): string {
  return JSON.stringify({ entities: [entity] }, null, 2);
}

/**
 * Interactive entity scaffolding
 */
async function scaffoldEntity(): Promise<void> {
  const rl = readline.createInterface({ input: stdin, output: stdout });

  console.log('\n🪶 CAL Entity Scaffold');
  console.log('─── Build your entity step by step ───\n');

  try {
    // Basic identity
    console.log('── Identity ──');
    const id       = await askString(rl, 'Entity ID (kebab-case)', undefined, /^[a-z0-9][a-z0-9-]*$/);
    const name     = await askString(rl, 'Entity name');
    const type     = await askString(rl, 'Entity type', 'entities');
    const category = await askString(rl, 'Category', 'general');

    // 3D Lens (top-level signals)
    console.log('\n── 3D Lens (overall entity signals) ──');
    const sound = await askNumber(rl, `Sound — ${SIGNAL_HINTS.sound}`, 1, 10);
    const space = await askNumber(rl, `Space — ${SIGNAL_HINTS.space}`, 1, 10);
    const time  = await askNumber(rl, `Time  — ${SIGNAL_HINTS.time}`, 1, 10);
    const lensScore = (sound * space * time) / 10;
    console.log(`   → 3D Lens Score: ${lensScore.toFixed(1)}`);

    // Context
    console.log('\n── Context ──');
    const segment  = await askString(rl, 'Segment', 'general');
    const impact   = await askChoice(rl, 'Impact level', ['low', 'medium', 'high'], 'medium');
    const costStr  = (await rl.question('   Base cost (USD, optional): ')).trim();
    const baseCost = costStr ? parseInt(costStr, 10) : undefined;

    // 6D Dimensions
    console.log('\n── 6D Dimensions ──');
    console.log('   Score each affected dimension (skip unaffected ones)\n');

    const dimensions: Partial<Record<DimensionID, DimensionSignal>> = {};
    let affectedCount = 0;

    for (const dimId of DIMENSIONS) {
      const signal = await scoreDimension(rl, dimId);
      if (signal) {
        dimensions[dimId] = signal;
        affectedCount++;
      }
    }

    // Build entity
    const entity: Entity = {
      id, name, type, category,
      sound, space, time,
      segment, impact,
      ...(baseCost ? { baseCost, currency: 'USD' } : {}),
      dimensions,
    };

    // Summary
    console.log('\n── Summary ──');
    console.log(`   Entity: ${name} (${id})`);
    console.log(`   3D Lens: Sound ${sound} × Space ${space} × Time ${time} = ${lensScore.toFixed(1)}`);
    console.log(`   Dimensions affected: ${affectedCount}/6`);

    // Output
    console.log('\n── Output ──');
    const filename = await askString(rl, 'Output filename', `${type}.json`);
    const outputPath = path.resolve(process.cwd(), filename);

    // Check if file exists — offer to append or overwrite
    let existingEntities: any[] = [];
    try {
      const existing = await fs.readFile(outputPath, 'utf-8');
      const parsed = JSON.parse(existing);
      existingEntities = Array.isArray(parsed) ? parsed : parsed.entities || [];
      if (existingEntities.length > 0) {
        const action = await askChoice(
          rl,
          `File exists with ${existingEntities.length} entity(ies). Append or overwrite?`,
          ['append', 'overwrite'],
          'append'
        );
        if (action === 'overwrite') {
          existingEntities = [];
        }
      }
    } catch {
      // File doesn't exist — fine
    }

    existingEntities.push(entity);
    const finalJSON = JSON.stringify({ entities: existingEntities }, null, 2);
    await fs.writeFile(outputPath, finalJSON + '\n');

    console.log(`\n✅ Entity written to: ${filename}`);
    console.log(`   ${existingEntities.length} entity(ies) in file\n`);
    console.log(`Run: cal run your-script.cal --data ${filename}`);
    console.log('');
  } finally {
    rl.close();
  }
}

/**
 * Scaffold command dispatcher
 */
export async function scaffoldCommand(options: ScaffoldOptions): Promise<void> {
  if (!options.subcommand || options.subcommand === 'entity') {
    await scaffoldEntity();
    return;
  }

  console.error(`❌ Unknown scaffold type: "${options.subcommand}"`);
  console.error('');
  console.error('Available scaffolds:');
  console.error('   cal scaffold entity    Interactive entity JSON generator');
  console.error('');
  process.exit(1);
}
