#!/usr/bin/env node

/**
 * CAL CLI entry point
 */

import('../dist/cli/index.js').then(cli => {
  cli.main(process.argv).catch(error => {
    console.error('Fatal error:', error.message);
    process.exit(1);
  });
}).catch(error => {
  console.error('Failed to load CAL CLI:', error.message);
  process.exit(1);
});
