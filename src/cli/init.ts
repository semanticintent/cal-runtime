/**
 * 🪶 CAL Init — Project Scaffolding
 *
 * Semantic contract: Creates a new CAL project with a working
 * starter script and entity data — ready to run immediately.
 */

import * as fs from 'fs/promises';
import * as path from 'path';

interface InitOptions {
  name?: string;
  quiet?: boolean;
}

const STARTER_CAL = (name: string) => `-- ================================================
-- Cormorant Agentic Language (CAL)
-- Project: ${name}
--
-- Sense → Analyze → Measure → Decide → Act
-- ================================================

-- LAYER 1: SENSE
-- Find entities with high-urgency signals
FORAGE entities
WHERE sound > 5
ACROSS D1, D2, D3, D5, D6
DEPTH 3
SURFACE cascade_map

-- LAYER 2: ANALYZE
-- Deep dive into the cascade
DIVE INTO operations
WHEN impact = "high"
TRACE cascade
EMIT impact_analysis

-- LAYER 3: MEASURE (DRIFT)
-- Measure the gap between methodology and performance
DRIFT cascade_map
METHODOLOGY 75
PERFORMANCE 45

-- LAYER 4: DECIDE (FETCH)
-- Determine action based on Fetch score
FETCH cascade_map
THRESHOLD 1000
ON EXECUTE CHIRP critical "Cascade detected — immediate action required"

-- LAYER 5: ACT
-- Output final results
SURFACE analysis AS json
`;

const STARTER_ENTITIES = `{
  "entities": [
    {
      "id": "example-entity",
      "name": "Example Company",
      "type": "entities",
      "category": "general",
      "sound": 7,
      "space": 6,
      "time": 7,
      "segment": "enterprise",
      "impact": "high",
      "baseCost": 500000,
      "currency": "USD",
      "dimensions": {
        "D1": { "sound": 6, "space": 7, "time": 6, "notes": "Customer trust under pressure" },
        "D2": { "sound": 7, "space": 6, "time": 7, "notes": "Workforce restructuring" },
        "D3": { "sound": 7, "space": 7, "time": 6, "notes": "Revenue declining" },
        "D4": { "sound": 4, "space": 3, "time": 4, "notes": "Regulatory stable" },
        "D5": { "sound": 8, "space": 7, "time": 7, "notes": "Quality at risk" },
        "D6": { "sound": 7, "space": 6, "time": 8, "notes": "Operational strain" }
      }
    }
  ]
}
`;

export async function initCommand(options: InitOptions): Promise<void> {
  const projectName = options.name || 'my-cal-project';
  const targetDir = path.resolve(process.cwd(), projectName);

  // Check if directory already exists
  try {
    await fs.access(targetDir);
    console.error(`❌ Directory "${projectName}" already exists.`);
    process.exit(1);
  } catch {
    // Directory doesn't exist — good
  }

  if (!options.quiet) {
    console.log(`\n🪶 Creating CAL project: ${projectName}\n`);
  }

  // Create directory structure
  await fs.mkdir(path.join(targetDir, 'data'), { recursive: true });

  // Write files
  await Promise.all([
    fs.writeFile(
      path.join(targetDir, 'analysis.cal'),
      STARTER_CAL(projectName)
    ),
    fs.writeFile(
      path.join(targetDir, 'data', 'entities.json'),
      STARTER_ENTITIES
    ),
  ]);

  if (!options.quiet) {
    console.log(`   ├── ${projectName}/`);
    console.log(`   │   ├── analysis.cal`);
    console.log(`   │   └── data/`);
    console.log(`   │       └── entities.json`);
    console.log('');
    console.log('✅ Project created\n');
    console.log('Next steps:');
    console.log(`   cd ${projectName}`);
    console.log('   cal run analysis.cal --data data/entities.json');
    console.log('   cal run analysis.cal --data data/entities.json --verbose');
    console.log('');
  }
}
