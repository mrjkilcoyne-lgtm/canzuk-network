import { v4 as uuid } from 'uuid';
import { IntelDatabase } from '../db/database.js';
import { LLMClient } from '../llm/llm-client.js';
import { SEARCH_TERMS } from '../config/search-terms.js';
import type { AgentContext, SweepRun } from '../models/types.js';

// Agents
import { AppStoreResearchAgent } from '../agents/app-store-research.js';
import { DisruptionAnalystAgent } from '../agents/disruption-analyst.js';
import { UKLegalExpertAgent } from '../agents/uk-legal-expert.js';
import { EULegalExpertAgent } from '../agents/eu-legal-expert.js';
import { DatabaseBuilderAgent } from '../agents/database-builder.js';
import { GrandStrategyAgent } from '../agents/grand-strategy.js';

export interface SweepOptions {
  dryRun?: boolean;
  dbPath?: string;
}

export async function runSweep(options: SweepOptions = {}): Promise<string> {
  const db = new IntelDatabase(options.dbPath);
  const llm = new LLMClient();
  const sweepId = uuid();
  const dryRun = options.dryRun ?? false;

  const ctx: AgentContext = { sweepId, dryRun };

  // Create sweep run record
  const sweepRun: SweepRun = {
    id: sweepId,
    startedAt: new Date().toISOString(),
    completedAt: null,
    status: 'running',
    searchTermsUsed: SEARCH_TERMS,
    appsFound: 0,
    agentLog: [],
  };
  db.createSweepRun(sweepRun);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`  CANZUK INTEL SWEEP — ${new Date().toLocaleDateString('en-GB')}`);
  console.log(`  Sweep ID: ${sweepId}`);
  console.log(`  Mode: ${dryRun ? 'DRY RUN (no LLM calls)' : 'FULL SWEEP'}`);
  console.log(`${'='.repeat(60)}\n`);

  try {
    // ─── Stage 1: App Store Research ───────────────────────────
    console.log('\n--- Stage 1: App Store Research ---');
    const researcher = new AppStoreResearchAgent(db, llm, ctx);
    await researcher.run();

    if (dryRun) {
      console.log('\n[DRY RUN] Stopping after research stage.');
      db.updateSweepRun(sweepId, {
        status: 'completed',
        completedAt: new Date().toISOString(),
      });
      db.close();
      return sweepId;
    }

    const newApps = db.getNewAppsForSweep(sweepId);
    if (newApps.length === 0) {
      console.log('\nNo new apps discovered this sweep — skipping analysis stages.');
      db.updateSweepRun(sweepId, {
        status: 'completed',
        completedAt: new Date().toISOString(),
      });
      db.close();
      return sweepId;
    }

    console.log(`\n${newApps.length} new apps to analyse (skipping ${db.getAppsForSweep(sweepId).length - newApps.length} previously seen).\n`);

    // ─── Stage 2: Disruption Analysis ─────────────────────────
    console.log('\n--- Stage 2: Disruption Analysis ---');
    const disruptionAnalyst = new DisruptionAnalystAgent(db, llm, ctx);
    await disruptionAnalyst.run();

    // ─── Stage 3: Legal Assessment (UK + EU in parallel) ──────
    console.log('\n--- Stage 3: Legal Assessment (UK + EU parallel) ---');
    const ukLegal = new UKLegalExpertAgent(db, llm, ctx);
    const euLegal = new EULegalExpertAgent(db, llm, ctx);
    await Promise.all([ukLegal.run(), euLegal.run()]);

    // ─── Stage 4: Database Enrichment ─────────────────────────
    console.log('\n--- Stage 4: Database Enrichment & Contacts ---');
    const dbBuilder = new DatabaseBuilderAgent(db, llm, ctx);
    await dbBuilder.run();

    // ─── Stage 5: Grand Strategy ──────────────────────────────
    console.log('\n--- Stage 5: Grand Strategy ---');
    const strategist = new GrandStrategyAgent(db, llm, ctx);
    await strategist.run();

    // ─── Complete ─────────────────────────────────────────────
    db.updateSweepRun(sweepId, {
      status: 'completed',
      completedAt: new Date().toISOString(),
    });

    const usage = llm.getUsage();
    const sweepResult = db.getSweepRun(sweepId);
    const allSweepApps = db.getAppsForSweep(sweepId);
    const analysedApps = db.getNewAppsForSweep(sweepId);
    console.log(`\n${'='.repeat(60)}`);
    console.log(`  SWEEP COMPLETE`);
    console.log(`  New apps this sweep: ${sweepResult?.appsFound ?? 0}`);
    console.log(`  Total apps processed: ${allSweepApps.length}`);
    console.log(`  New entries analysed: ${analysedApps.length}`);
    console.log(`  Total apps in DB: ${db.getAllApps().length}`);
    console.log(`  Token usage: ${usage.totalTokens.toLocaleString()} total`);
    console.log(`    Input:  ${usage.inputTokens.toLocaleString()}`);
    console.log(`    Output: ${usage.outputTokens.toLocaleString()}`);
    console.log(`${'='.repeat(60)}\n`);

  } catch (error) {
    db.updateSweepRun(sweepId, {
      status: 'failed',
      completedAt: new Date().toISOString(),
    });
    console.error('Sweep failed:', error);
  } finally {
    db.close();
  }

  return sweepId;
}
