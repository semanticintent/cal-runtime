/**
 * 🪶 CLI Tests
 *
 * Validates command-line interface functionality
 */

import { describe, it, expect, vi } from 'vitest';
import { parseArgs, showHelp, showVersion } from '../../src/cli/index.js';

describe('CLI - Argument Parsing', () => {
  it('should parse run command with script', () => {
    const args = ['run', 'script.cal'];
    const options = parseArgs(args);

    expect(options.command).toBe('run');
    expect(options.script).toBe('script.cal');
  });

  it('should parse inline code', () => {
    const args = ['run', '--inline', 'FORAGE entities'];
    const options = parseArgs(args);

    expect(options.command).toBe('run');
    expect(options.inline).toBe('FORAGE entities');
  });

  it('should parse short inline flag', () => {
    const args = ['run', '-i', 'FORAGE entities'];
    const options = parseArgs(args);

    expect(options.inline).toBe('FORAGE entities');
  });

  it('should parse data file option', () => {
    const args = ['run', 'script.cal', '--data', 'data.json'];
    const options = parseArgs(args);

    expect(options.dataFile).toBe('data.json');
  });

  it('should parse short data flag', () => {
    const args = ['run', 'script.cal', '-d', 'data.json'];
    const options = parseArgs(args);

    expect(options.dataFile).toBe('data.json');
  });

  it('should parse data path option', () => {
    const args = ['run', 'script.cal', '--data-path', './data'];
    const options = parseArgs(args);

    expect(options.dataPath).toBe('./data');
  });

  it('should parse output file option', () => {
    const args = ['run', 'script.cal', '--output', 'results.json'];
    const options = parseArgs(args);

    expect(options.outputFile).toBe('results.json');
  });

  it('should parse short output flag', () => {
    const args = ['run', 'script.cal', '-o', 'results.json'];
    const options = parseArgs(args);

    expect(options.outputFile).toBe('results.json');
  });

  it('should parse alert type option', () => {
    const args = ['run', 'script.cal', '--alert', 'file'];
    const options = parseArgs(args);

    expect(options.alertType).toBe('file');
  });

  it('should parse short alert flag', () => {
    const args = ['run', 'script.cal', '-a', 'json'];
    const options = parseArgs(args);

    expect(options.alertType).toBe('json');
  });

  it('should parse alert file option', () => {
    const args = ['run', 'script.cal', '--alert-file', 'alerts.log'];
    const options = parseArgs(args);

    expect(options.alertFile).toBe('alerts.log');
  });

  it('should parse verbose flag', () => {
    const args = ['run', 'script.cal', '--verbose'];
    const options = parseArgs(args);

    expect(options.verbose).toBe(true);
  });

  it('should parse short verbose flag', () => {
    const args = ['run', 'script.cal', '-v'];
    const options = parseArgs(args);

    expect(options.verbose).toBe(true);
  });

  it('should parse quiet flag', () => {
    const args = ['run', 'script.cal', '--quiet'];
    const options = parseArgs(args);

    expect(options.quiet).toBe(true);
  });

  it('should parse short quiet flag', () => {
    const args = ['run', 'script.cal', '-q'];
    const options = parseArgs(args);

    expect(options.quiet).toBe(true);
  });

  it('should parse analyze command', () => {
    const args = ['analyze', 'script.cal'];
    const options = parseArgs(args);

    expect(options.command).toBe('analyze');
    expect(options.script).toBe('script.cal');
  });

  it('should parse validate command', () => {
    const args = ['validate', 'script.cal'];
    const options = parseArgs(args);

    expect(options.command).toBe('validate');
    expect(options.script).toBe('script.cal');
  });

  it('should parse help command', () => {
    const args = ['help'];
    const options = parseArgs(args);

    expect(options.command).toBe('help');
  });

  it('should parse version command', () => {
    const args = ['version'];
    const options = parseArgs(args);

    expect(options.command).toBe('version');
  });

  it('should parse multiple options together', () => {
    const args = [
      'run',
      'script.cal',
      '-d', 'data.json',
      '-o', 'results.json',
      '-a', 'file',
      '--verbose'
    ];
    const options = parseArgs(args);

    expect(options.command).toBe('run');
    expect(options.script).toBe('script.cal');
    expect(options.dataFile).toBe('data.json');
    expect(options.outputFile).toBe('results.json');
    expect(options.alertType).toBe('file');
    expect(options.verbose).toBe(true);
  });

  it('should default to run command if not specified', () => {
    const args = ['script.cal'];
    const options = parseArgs(args);

    expect(options.command).toBe('run');
    expect(options.script).toBe('script.cal');
  });

  it('should default alert type to console', () => {
    const args = ['run', 'script.cal'];
    const options = parseArgs(args);

    expect(options.alertType).toBe('console');
  });

  it('should default verbose to false', () => {
    const args = ['run', 'script.cal'];
    const options = parseArgs(args);

    expect(options.verbose).toBe(false);
  });

  it('should default quiet to false', () => {
    const args = ['run', 'script.cal'];
    const options = parseArgs(args);

    expect(options.quiet).toBe(false);
  });

  it('should ignore invalid alert types', () => {
    const args = ['run', 'script.cal', '--alert', 'invalid'];
    const options = parseArgs(args);

    // Should remain default
    expect(options.alertType).toBe('console');
  });

  it('should handle empty args', () => {
    const args: string[] = [];
    const options = parseArgs(args);

    expect(options.command).toBe('run');
    expect(options.script).toBeUndefined();
  });
});

describe('CLI - Help and Version', () => {
  it('should show help without errors', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    showHelp();

    expect(spy).toHaveBeenCalled();
    const output = spy.mock.calls.map(call => call[0]).join('\n');

    expect(output).toContain('USAGE:');
    expect(output).toContain('cal run');
    expect(output).toContain('FORAGE');
    expect(output).toContain('DIVE');
    expect(output).toContain('6D DIMENSIONS');

    spy.mockRestore();
  });

  it('should show version without errors', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    showVersion();

    expect(spy).toHaveBeenCalled();
    const output = spy.mock.calls.map(call => call[0]).join('\n');

    expect(output).toContain('CAL');
    expect(output).toContain('Cormorant Agentic Language');
    expect(output).toContain('v1.1.0');

    spy.mockRestore();
  });
});

describe('CLI - Command Examples', () => {
  it('should parse typical run command', () => {
    const args = ['run', 'analysis.cal', '--data', 'entities.json'];
    const options = parseArgs(args);

    expect(options.command).toBe('run');
    expect(options.script).toBe('analysis.cal');
    expect(options.dataFile).toBe('entities.json');
  });

  it('should parse inline with data path', () => {
    const args = [
      'run',
      '--inline', 'FORAGE entities WHERE sound > 5',
      '--data-path', './data'
    ];
    const options = parseArgs(args);

    expect(options.command).toBe('run');
    expect(options.inline).toBe('FORAGE entities WHERE sound > 5');
    expect(options.dataPath).toBe('./data');
  });

  it('should parse analyze with verbose', () => {
    const args = ['analyze', 'script.cal', '--verbose'];
    const options = parseArgs(args);

    expect(options.command).toBe('analyze');
    expect(options.script).toBe('script.cal');
    expect(options.verbose).toBe(true);
  });

  it('should parse validate command', () => {
    const args = ['validate', 'script.cal'];
    const options = parseArgs(args);

    expect(options.command).toBe('validate');
    expect(options.script).toBe('script.cal');
  });

  it('should parse with file alerts', () => {
    const args = [
      'run',
      'script.cal',
      '--alert', 'file',
      '--alert-file', 'alerts.log'
    ];
    const options = parseArgs(args);

    expect(options.alertType).toBe('file');
    expect(options.alertFile).toBe('alerts.log');
  });

  it('should parse quiet output', () => {
    const args = ['run', 'script.cal', '--quiet'];
    const options = parseArgs(args);

    expect(options.quiet).toBe(true);
  });
});
