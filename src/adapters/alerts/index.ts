/**
 * 🪶 Alert Adapters
 *
 * Semantic contract: Alert adapters broadcast signals (CHIRP),
 * just as cormorants vocalize to communicate with their flock.
 */

import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Alert severity levels
 */
export type AlertLevel = 'critical' | 'warning' | 'info' | 'success' | 'alert';

/**
 * Alert message structure
 */
export interface Alert {
  type: AlertLevel;
  message: string;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

/**
 * Base alert adapter interface
 */
export interface AlertAdapter {
  /**
   * Send an alert through this channel
   */
  send(alert: Alert): Promise<void>;
}

/**
 * Console alert adapter with pretty formatting
 * Semantic: Immediate, visible signals (like cormorants' distinctive calls)
 */
export class ConsoleAlertAdapter implements AlertAdapter {
  private icons: Record<AlertLevel, string> = {
    critical: '🚨',
    warning: '⚠️',
    info: 'ℹ️',
    success: '✅',
    alert: '🔔'
  };

  async send(alert: Alert): Promise<void> {
    const icon = this.icons[alert.type] || this.icons.alert;
    const timestamp = alert.timestamp || new Date();

    console.log(`\n${icon} ═══════════════════════════════════════════════`);
    console.log(`   CHIRP: ${alert.type.toUpperCase()}`);
    console.log(`   TIME: ${timestamp.toISOString()}`);
    console.log(`   ───────────────────────────────────────────────`);
    console.log(`   ${alert.message}`);

    if (alert.metadata && Object.keys(alert.metadata).length > 0) {
      console.log(`   ───────────────────────────────────────────────`);
      console.log(`   METADATA:`);
      Object.entries(alert.metadata).forEach(([key, value]) => {
        console.log(`   • ${key}: ${JSON.stringify(value)}`);
      });
    }

    console.log(`   ═══════════════════════════════════════════════\n`);
  }
}

/**
 * File-based alert adapter
 * Semantic: Persistent record-keeping (like tracking cormorant activity over time)
 */
export class FileAlertAdapter implements AlertAdapter {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async send(alert: Alert): Promise<void> {
    const timestamp = alert.timestamp || new Date();
    const logLine = JSON.stringify({
      timestamp: timestamp.toISOString(),
      type: alert.type,
      message: alert.message,
      metadata: alert.metadata
    }) + '\n';

    try {
      // Ensure directory exists
      const dir = path.dirname(this.filePath);
      await fs.mkdir(dir, { recursive: true });

      // Append to file
      await fs.appendFile(this.filePath, logLine, 'utf-8');
    } catch (error: any) {
      throw new Error(`Failed to write alert to file: ${error.message}`);
    }
  }
}

/**
 * Webhook alert adapter for external services
 * Semantic: Broadcasting to distant observers (like cormorants signaling across waters)
 */
export class WebhookAlertAdapter implements AlertAdapter {
  private webhookUrl: string;
  private format: 'slack' | 'discord' | 'generic';

  constructor(webhookUrl: string, format: 'slack' | 'discord' | 'generic' = 'generic') {
    this.webhookUrl = webhookUrl;
    this.format = format;
  }

  async send(alert: Alert): Promise<void> {
    const payload = this.formatPayload(alert);

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Webhook returned ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      throw new Error(`Failed to send webhook alert: ${error.message}`);
    }
  }

  private formatPayload(alert: Alert): any {
    const timestamp = alert.timestamp || new Date();

    switch (this.format) {
      case 'slack':
        return {
          text: `*${alert.type.toUpperCase()}*: ${alert.message}`,
          attachments: alert.metadata ? [{
            color: this.getSlackColor(alert.type),
            fields: Object.entries(alert.metadata).map(([key, value]) => ({
              title: key,
              value: JSON.stringify(value),
              short: true
            })),
            ts: Math.floor(timestamp.getTime() / 1000)
          }] : []
        };

      case 'discord':
        return {
          embeds: [{
            title: `🪶 ${alert.type.toUpperCase()}`,
            description: alert.message,
            color: this.getDiscordColor(alert.type),
            fields: alert.metadata ? Object.entries(alert.metadata).map(([key, value]) => ({
              name: key,
              value: JSON.stringify(value),
              inline: true
            })) : [],
            timestamp: timestamp.toISOString()
          }]
        };

      case 'generic':
      default:
        return {
          type: alert.type,
          message: alert.message,
          timestamp: timestamp.toISOString(),
          metadata: alert.metadata
        };
    }
  }

  private getSlackColor(type: AlertLevel): string {
    const colors: Record<AlertLevel, string> = {
      critical: 'danger',
      warning: 'warning',
      info: '#36a64f',
      success: 'good',
      alert: '#764FA5'
    };
    return colors[type] || '#cccccc';
  }

  private getDiscordColor(type: AlertLevel): number {
    const colors: Record<AlertLevel, number> = {
      critical: 0xFF0000,  // Red
      warning: 0xFFA500,   // Orange
      info: 0x3498DB,      // Blue
      success: 0x00FF00,   // Green
      alert: 0x9B59B6      // Purple
    };
    return colors[type] || 0xCCCCCC;
  }
}

/**
 * JSON alert adapter for testing and accumulation
 * Semantic: Collecting signals for later analysis (like studying cormorant patterns)
 */
export class JSONAlertAdapter implements AlertAdapter {
  private alerts: Alert[] = [];

  async send(alert: Alert): Promise<void> {
    const timestamp = alert.timestamp || new Date();
    this.alerts.push({
      ...alert,
      timestamp
    });
  }

  /**
   * Get all accumulated alerts
   */
  getAlerts(): readonly Alert[] {
    return Object.freeze([...this.alerts]);
  }

  /**
   * Clear accumulated alerts
   */
  clear(): void {
    this.alerts = [];
  }

  /**
   * Get alerts filtered by type
   */
  getAlertsByType(type: AlertLevel): readonly Alert[] {
    return Object.freeze(this.alerts.filter(a => a.type === type));
  }

  /**
   * Export alerts as JSON string
   */
  toJSON(): string {
    return JSON.stringify(this.alerts, null, 2);
  }
}

/**
 * Multi-channel alert adapter
 * Semantic: Broadcasting to multiple territories simultaneously
 */
export class MultiAlertAdapter implements AlertAdapter {
  private adapters: AlertAdapter[];

  constructor(adapters: AlertAdapter[]) {
    this.adapters = adapters;
  }

  async send(alert: Alert): Promise<void> {
    // Send to all adapters in parallel
    await Promise.all(
      this.adapters.map(adapter => adapter.send(alert))
    );
  }

  /**
   * Add an adapter to the multi-channel
   */
  addAdapter(adapter: AlertAdapter): void {
    this.adapters.push(adapter);
  }

  /**
   * Remove all adapters
   */
  clear(): void {
    this.adapters = [];
  }
}

/**
 * Factory function to create alert adapters
 */
export function createAlertAdapter(config: {
  type: 'console' | 'file' | 'webhook' | 'json' | 'multi';
  filePath?: string;
  webhookUrl?: string;
  webhookFormat?: 'slack' | 'discord' | 'generic';
  adapters?: AlertAdapter[];
}): AlertAdapter {
  switch (config.type) {
    case 'console':
      return new ConsoleAlertAdapter();

    case 'file':
      if (!config.filePath) {
        throw new Error('filePath is required for file adapter');
      }
      return new FileAlertAdapter(config.filePath);

    case 'webhook':
      if (!config.webhookUrl) {
        throw new Error('webhookUrl is required for webhook adapter');
      }
      return new WebhookAlertAdapter(config.webhookUrl, config.webhookFormat);

    case 'json':
      return new JSONAlertAdapter();

    case 'multi':
      return new MultiAlertAdapter(config.adapters || []);

    default:
      throw new Error(`Unknown adapter type: ${(config as any).type}`);
  }
}
