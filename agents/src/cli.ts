#!/usr/bin/env node

import { runSweep } from './orchestrator/sweep-orchestrator.js';
import { generateReport } from './reports/report-generator.js';
import { IntelDatabase } from './db/database.js';

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case 'sweep': {
      const dryRun = args.includes('--dry');
      const sweepId = await runSweep({ dryRun });
      console.log(`\nSweep ID: ${sweepId}`);

      // Auto-generate report after successful sweep
      if (!dryRun) {
        console.log('\nGenerating report...');
        generateReport(sweepId);
      }
      break;
    }

    case 'report': {
      if (args.includes('--latest')) {
        const db = new IntelDatabase();
        const latest = db.getLatestSweepRun();
        db.close();
        if (!latest) {
          console.error('No sweep runs found. Run a sweep first.');
          process.exit(1);
        }
        generateReport(latest.id);
      } else if (args[1]) {
        generateReport(args[1]);
      } else {
        console.error('Usage: report <sweepId> or report --latest');
        process.exit(1);
      }
      break;
    }

    case 'status': {
      const db = new IntelDatabase();
      const latest = db.getLatestSweepRun();
      if (latest) {
        console.log(`Latest sweep: ${latest.id}`);
        console.log(`  Status: ${latest.status}`);
        console.log(`  Started: ${latest.startedAt}`);
        console.log(`  Apps found: ${latest.appsFound}`);
        console.log(`  Log entries: ${latest.agentLog.length}`);
      } else {
        console.log('No sweeps found.');
      }
      const allApps = db.getAllApps();
      console.log(`\nTotal apps in database: ${allApps.length}`);
      db.close();
      break;
    }

    default:
      console.log(`
CANZUK Intel Agents — Competitive Intelligence System

Usage:
  npm run sweep           Run a full intelligence sweep
  npm run sweep:dry       Dry run (scrape only, no LLM analysis)

  npx tsx src/cli.ts report --latest    Generate report from latest sweep
  npx tsx src/cli.ts report <sweepId>   Generate report from specific sweep
  npx tsx src/cli.ts status             Show database status

Environment:
  ANTHROPIC_API_KEY       Required for LLM analysis agents

Schedule (weekly cron):
  0 6 * * 1 cd /path/to/agents && npm run sweep
      `);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
