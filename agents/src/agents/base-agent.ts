import type { IntelDatabase } from '../db/database.js';
import type { LLMClient } from '../llm/llm-client.js';
import type { AgentContext } from '../models/types.js';

export abstract class BaseAgent {
  constructor(
    protected db: IntelDatabase,
    protected llm: LLMClient,
    protected ctx: AgentContext,
  ) {}

  abstract name: string;
  abstract run(): Promise<void>;

  protected log(message: string): void {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] [${this.name}] ${message}`;
    console.log(entry);

    // Append to sweep run log
    const sweep = this.db.getSweepRun(this.ctx.sweepId);
    if (sweep) {
      sweep.agentLog.push(entry);
      this.db.updateSweepRun(this.ctx.sweepId, { agentLog: sweep.agentLog });
    }
  }

  protected async runWithErrorHandling(fn: () => Promise<void>): Promise<void> {
    try {
      this.log(`Starting...`);
      await fn();
      this.log(`Completed successfully.`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.log(`FAILED: ${msg}`);
      throw error;
    }
  }
}
