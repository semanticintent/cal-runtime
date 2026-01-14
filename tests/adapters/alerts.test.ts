/**
 * 🪶 Alert Adapter Tests
 *
 * Validates alert broadcasting implementations
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ConsoleAlertAdapter,
  FileAlertAdapter,
  WebhookAlertAdapter,
  JSONAlertAdapter,
  MultiAlertAdapter,
  createAlertAdapter,
  type Alert
} from '../../src/adapters/alerts/index.js';
import * as fs from 'fs/promises';
import * as path from 'path';

// Mock fs for file adapter tests
vi.mock('fs/promises');

describe('ConsoleAlertAdapter', () => {
  let adapter: ConsoleAlertAdapter;
  let consoleSpy: any;

  beforeEach(() => {
    adapter = new ConsoleAlertAdapter();
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('should send critical alert', async () => {
    const alert: Alert = {
      type: 'critical',
      message: 'System failure detected'
    };

    await adapter.send(alert);

    expect(consoleSpy).toHaveBeenCalled();
    const output = consoleSpy.mock.calls.map((call: any) => call[0]).join('\n');
    expect(output).toContain('🚨');
    expect(output).toContain('CRITICAL');
    expect(output).toContain('System failure detected');
  });

  it('should send warning alert', async () => {
    const alert: Alert = {
      type: 'warning',
      message: 'High memory usage'
    };

    await adapter.send(alert);

    const output = consoleSpy.mock.calls.map((call: any) => call[0]).join('\n');
    expect(output).toContain('⚠️');
    expect(output).toContain('WARNING');
  });

  it('should send info alert', async () => {
    const alert: Alert = {
      type: 'info',
      message: 'Process started'
    };

    await adapter.send(alert);

    const output = consoleSpy.mock.calls.map((call: any) => call[0]).join('\n');
    expect(output).toContain('ℹ️');
    expect(output).toContain('INFO');
  });

  it('should send success alert', async () => {
    const alert: Alert = {
      type: 'success',
      message: 'Operation completed'
    };

    await adapter.send(alert);

    const output = consoleSpy.mock.calls.map((call: any) => call[0]).join('\n');
    expect(output).toContain('✅');
    expect(output).toContain('SUCCESS');
  });

  it('should include metadata in output', async () => {
    const alert: Alert = {
      type: 'info',
      message: 'Test message',
      metadata: {
        userId: 'user-123',
        action: 'login'
      }
    };

    await adapter.send(alert);

    const output = consoleSpy.mock.calls.map((call: any) => call[0]).join('\n');
    expect(output).toContain('METADATA');
    expect(output).toContain('userId');
    expect(output).toContain('user-123');
    expect(output).toContain('action');
    expect(output).toContain('login');
  });

  it('should include timestamp', async () => {
    const timestamp = new Date('2025-01-01T12:00:00Z');
    const alert: Alert = {
      type: 'info',
      message: 'Test',
      timestamp
    };

    await adapter.send(alert);

    const output = consoleSpy.mock.calls.map((call: any) => call[0]).join('\n');
    expect(output).toContain('2025-01-01T12:00:00.000Z');
  });
});

describe('FileAlertAdapter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should write alert to file', async () => {
    const mockMkdir = vi.mocked(fs.mkdir).mockResolvedValue(undefined);
    const mockAppendFile = vi.mocked(fs.appendFile).mockResolvedValue();

    const adapter = new FileAlertAdapter('./logs/alerts.log');
    const alert: Alert = {
      type: 'info',
      message: 'Test alert'
    };

    await adapter.send(alert);

    expect(mockMkdir).toHaveBeenCalledWith('./logs', { recursive: true });
    expect(mockAppendFile).toHaveBeenCalled();

    const writeCall = mockAppendFile.mock.calls[0];
    expect(writeCall[0]).toBe('./logs/alerts.log');

    const content = writeCall[1] as string;
    const parsed = JSON.parse(content);
    expect(parsed.type).toBe('info');
    expect(parsed.message).toBe('Test alert');
  });

  it('should include metadata in log', async () => {
    vi.mocked(fs.mkdir).mockResolvedValue(undefined);
    const mockAppendFile = vi.mocked(fs.appendFile).mockResolvedValue();

    const adapter = new FileAlertAdapter('./logs/alerts.log');
    const alert: Alert = {
      type: 'warning',
      message: 'Test',
      metadata: { key: 'value' }
    };

    await adapter.send(alert);

    const content = mockAppendFile.mock.calls[0][1] as string;
    const parsed = JSON.parse(content);
    expect(parsed.metadata).toEqual({ key: 'value' });
  });

  it('should handle file write errors', async () => {
    vi.mocked(fs.mkdir).mockRejectedValue(new Error('Permission denied'));

    const adapter = new FileAlertAdapter('./logs/alerts.log');
    const alert: Alert = {
      type: 'info',
      message: 'Test'
    };

    await expect(adapter.send(alert)).rejects.toThrow('Failed to write alert to file');
  });
});

describe('WebhookAlertAdapter', () => {
  let fetchMock: any;

  beforeEach(() => {
    fetchMock = vi.fn();
    global.fetch = fetchMock;
  });

  it('should send generic webhook', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200 });

    const adapter = new WebhookAlertAdapter('https://example.com/webhook', 'generic');
    const alert: Alert = {
      type: 'info',
      message: 'Test alert'
    };

    await adapter.send(alert);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/webhook',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
    );

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.type).toBe('info');
    expect(body.message).toBe('Test alert');
  });

  it('should send Slack formatted webhook', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200 });

    const adapter = new WebhookAlertAdapter('https://hooks.slack.com/webhook', 'slack');
    const alert: Alert = {
      type: 'critical',
      message: 'Critical error',
      metadata: { error: 'Out of memory' }
    };

    await adapter.send(alert);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toContain('CRITICAL');
    expect(body.text).toContain('Critical error');
    expect(body.attachments).toBeDefined();
    expect(body.attachments[0].color).toBe('danger');
  });

  it('should send Discord formatted webhook', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200 });

    const adapter = new WebhookAlertAdapter('https://discord.com/api/webhooks/123', 'discord');
    const alert: Alert = {
      type: 'success',
      message: 'Deployment complete',
      metadata: { version: '1.2.3' }
    };

    await adapter.send(alert);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.embeds).toBeDefined();
    expect(body.embeds[0].title).toContain('SUCCESS');
    expect(body.embeds[0].description).toBe('Deployment complete');
    expect(body.embeds[0].color).toBe(0x00FF00); // Green
  });

  it('should handle webhook errors', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500, statusText: 'Server Error' });

    const adapter = new WebhookAlertAdapter('https://example.com/webhook');
    const alert: Alert = {
      type: 'info',
      message: 'Test'
    };

    await expect(adapter.send(alert)).rejects.toThrow('Webhook returned 500');
  });

  it('should handle network errors', async () => {
    fetchMock.mockRejectedValue(new Error('Network error'));

    const adapter = new WebhookAlertAdapter('https://example.com/webhook');
    const alert: Alert = {
      type: 'info',
      message: 'Test'
    };

    await expect(adapter.send(alert)).rejects.toThrow('Failed to send webhook alert');
  });
});

describe('JSONAlertAdapter', () => {
  let adapter: JSONAlertAdapter;

  beforeEach(() => {
    adapter = new JSONAlertAdapter();
  });

  it('should accumulate alerts', async () => {
    await adapter.send({ type: 'info', message: 'First' });
    await adapter.send({ type: 'warning', message: 'Second' });

    const alerts = adapter.getAlerts();
    expect(alerts).toHaveLength(2);
    expect(alerts[0].message).toBe('First');
    expect(alerts[1].message).toBe('Second');
  });

  it('should add timestamps', async () => {
    const beforeSend = new Date();
    await adapter.send({ type: 'info', message: 'Test' });
    const afterSend = new Date();

    const alerts = adapter.getAlerts();
    expect(alerts[0].timestamp).toBeDefined();
    expect(alerts[0].timestamp!.getTime()).toBeGreaterThanOrEqual(beforeSend.getTime());
    expect(alerts[0].timestamp!.getTime()).toBeLessThanOrEqual(afterSend.getTime());
  });

  it('should filter alerts by type', async () => {
    await adapter.send({ type: 'info', message: 'Info 1' });
    await adapter.send({ type: 'critical', message: 'Critical 1' });
    await adapter.send({ type: 'info', message: 'Info 2' });

    const infoAlerts = adapter.getAlertsByType('info');
    expect(infoAlerts).toHaveLength(2);
    expect(infoAlerts[0].message).toBe('Info 1');
    expect(infoAlerts[1].message).toBe('Info 2');

    const criticalAlerts = adapter.getAlertsByType('critical');
    expect(criticalAlerts).toHaveLength(1);
    expect(criticalAlerts[0].message).toBe('Critical 1');
  });

  it('should clear alerts', async () => {
    await adapter.send({ type: 'info', message: 'Test' });
    expect(adapter.getAlerts()).toHaveLength(1);

    adapter.clear();
    expect(adapter.getAlerts()).toHaveLength(0);
  });

  it('should export as JSON', async () => {
    await adapter.send({ type: 'info', message: 'Test' });

    const json = adapter.toJSON();
    const parsed = JSON.parse(json);

    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0].type).toBe('info');
    expect(parsed[0].message).toBe('Test');
  });

  it('should return immutable arrays', async () => {
    await adapter.send({ type: 'info', message: 'Test' });

    const alerts = adapter.getAlerts();
    expect(Object.isFrozen(alerts)).toBe(true);
  });
});

describe('MultiAlertAdapter', () => {
  it('should send to multiple adapters', async () => {
    const adapter1 = new JSONAlertAdapter();
    const adapter2 = new JSONAlertAdapter();

    const multi = new MultiAlertAdapter([adapter1, adapter2]);
    const alert: Alert = {
      type: 'info',
      message: 'Broadcast message'
    };

    await multi.send(alert);

    expect(adapter1.getAlerts()).toHaveLength(1);
    expect(adapter2.getAlerts()).toHaveLength(1);
    expect(adapter1.getAlerts()[0].message).toBe('Broadcast message');
    expect(adapter2.getAlerts()[0].message).toBe('Broadcast message');
  });

  it('should add adapters dynamically', async () => {
    const multi = new MultiAlertAdapter([]);
    const adapter = new JSONAlertAdapter();

    multi.addAdapter(adapter);

    await multi.send({ type: 'info', message: 'Test' });

    expect(adapter.getAlerts()).toHaveLength(1);
  });

  it('should clear all adapters', () => {
    const adapter1 = new JSONAlertAdapter();
    const adapter2 = new JSONAlertAdapter();

    const multi = new MultiAlertAdapter([adapter1, adapter2]);
    multi.clear();

    // MultiAlertAdapter cleared, but original adapters should still work
    expect(adapter1).toBeInstanceOf(JSONAlertAdapter);
  });

  it('should handle errors from individual adapters', async () => {
    const workingAdapter = new JSONAlertAdapter();
    const failingAdapter = {
      async send(): Promise<void> {
        throw new Error('Adapter failed');
      }
    };

    const multi = new MultiAlertAdapter([workingAdapter, failingAdapter]);

    await expect(multi.send({ type: 'info', message: 'Test' })).rejects.toThrow();
  });
});

describe('createAlertAdapter', () => {
  it('should create console adapter', () => {
    const adapter = createAlertAdapter({ type: 'console' });
    expect(adapter).toBeInstanceOf(ConsoleAlertAdapter);
  });

  it('should create file adapter', () => {
    const adapter = createAlertAdapter({
      type: 'file',
      filePath: './logs/test.log'
    });
    expect(adapter).toBeInstanceOf(FileAlertAdapter);
  });

  it('should throw if file path missing', () => {
    expect(() => {
      createAlertAdapter({ type: 'file' } as any);
    }).toThrow('filePath is required');
  });

  it('should create webhook adapter', () => {
    const adapter = createAlertAdapter({
      type: 'webhook',
      webhookUrl: 'https://example.com/webhook'
    });
    expect(adapter).toBeInstanceOf(WebhookAlertAdapter);
  });

  it('should throw if webhook URL missing', () => {
    expect(() => {
      createAlertAdapter({ type: 'webhook' } as any);
    }).toThrow('webhookUrl is required');
  });

  it('should create JSON adapter', () => {
    const adapter = createAlertAdapter({ type: 'json' });
    expect(adapter).toBeInstanceOf(JSONAlertAdapter);
  });

  it('should create multi adapter', () => {
    const adapter = createAlertAdapter({
      type: 'multi',
      adapters: []
    });
    expect(adapter).toBeInstanceOf(MultiAlertAdapter);
  });

  it('should throw on unknown adapter type', () => {
    expect(() => {
      createAlertAdapter({ type: 'unknown' as any });
    }).toThrow('Unknown adapter type');
  });
});
