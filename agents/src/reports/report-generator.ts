import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { IntelDatabase } from '../db/database.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = join(__dirname, '../../data/reports');

export function generateReport(sweepId: string, dbPath?: string): string {
  const db = new IntelDatabase(dbPath);

  try {
    const sweep = db.getSweepRun(sweepId);
    if (!sweep) throw new Error(`Sweep run ${sweepId} not found`);

    const apps = db.getAppsForSweep(sweepId);
    const recommendations = db.getRecommendationsForSweep(sweepId);

    const lines: string[] = [];

    // Header
    lines.push(`# CANZUK Intel Report`);
    lines.push(`**Sweep ID:** ${sweepId}`);
    lines.push(`**Date:** ${new Date(sweep.startedAt).toLocaleDateString('en-GB', { dateStyle: 'full' })}`);
    lines.push(`**Status:** ${sweep.status}`);
    lines.push(`**Apps Found:** ${sweep.appsFound}`);
    lines.push('');

    // Executive Summary
    lines.push(`## Executive Summary`);
    const urgent = recommendations.filter(r => r.priority === 'urgent');
    const high = recommendations.filter(r => r.priority === 'high');
    const contactActions = recommendations.filter(r => r.action === 'contact' || r.action === 'partner');
    lines.push(`- **${apps.length}** apps discovered across Apple App Store and Google Play`);
    lines.push(`- **${urgent.length}** urgent actions, **${high.length}** high priority`);
    lines.push(`- **${contactActions.length}** recommended outreach targets`);
    lines.push('');

    // Priority Actions
    if (urgent.length > 0 || high.length > 0) {
      lines.push(`## Priority Actions`);
      for (const rec of [...urgent, ...high]) {
        const app = db.getAppById(rec.appId);
        lines.push(`### ${rec.priority.toUpperCase()}: ${app?.appName ?? 'Unknown App'}`);
        lines.push(`- **Action:** ${rec.action}`);
        lines.push(`- **Rationale:** ${rec.rationale}`);
        if (rec.suggestedPitch) {
          lines.push(`- **Suggested Pitch:**`);
          lines.push(`  > ${rec.suggestedPitch.replace(/\n/g, '\n  > ')}`);
        }
        if (rec.targetContact) {
          lines.push(`- **Target:** ${rec.targetContact}`);
        }
        lines.push('');
      }
    }

    // Full App Analysis
    lines.push(`## Full App Analysis`);
    for (const app of apps) {
      const intel = db.getFullAppIntel(app.id);
      const appRecs = recommendations.filter(r => r.appId === app.id);
      const contacts = db.getContacts(app.id);

      lines.push(`### ${app.appName}`);
      lines.push(`| Field | Value |`);
      lines.push(`|-------|-------|`);
      lines.push(`| Platform | ${app.platform} |`);
      lines.push(`| Developer | ${app.developer} |`);
      lines.push(`| Country | ${app.ownershipCountry} |`);
      lines.push(`| HQ | ${app.hqLocation} |`);
      lines.push(`| Category | ${app.category} |`);
      lines.push(`| Rating | ${app.rating ?? 'N/A'} |`);
      lines.push(`| Downloads | ${app.downloadEstimate ?? 'N/A'} |`);
      lines.push(`| Store URL | ${app.storeUrl} |`);
      lines.push('');

      if (intel.disruption) {
        lines.push(`**Disruption Analysis** (Threat: ${intel.disruption.threatLevel})`);
        lines.push(`- Disrupted: ${intel.disruption.disruptedParties.join(', ')}`);
        lines.push(`- Must Adapt: ${intel.disruption.adaptationNeeded.join(', ')}`);
        lines.push(`- Key Tech: ${intel.disruption.keyTechToAdopt.join(', ')}`);
        lines.push(`- Opportunity: ${intel.disruption.opportunitySummary}`);
        lines.push('');
      }

      for (const legal of intel.legal) {
        lines.push(`**${legal.jurisdiction.toUpperCase()} Legal Assessment** (Risk: ${legal.riskLevel})`);
        if (legal.jurisdiction === 'uk') {
          lines.push(`- ICO Registered: ${legal.icoRegistered ?? 'Unknown'}`);
        }
        lines.push(`- GDPR Compliant: ${legal.gdprCompliant ?? 'Unknown'}`);
        lines.push(`- DPIA Required: ${legal.dpiaRequired ?? 'Unknown'}`);
        if (legal.dataTransferMechanism) {
          lines.push(`- Transfer Mechanism: ${legal.dataTransferMechanism}`);
        }
        lines.push(`- Findings: ${legal.findings.join('; ')}`);
        lines.push(`- Recommendations: ${legal.recommendations.join('; ')}`);
        lines.push('');
      }

      if (contacts.length > 0) {
        lines.push(`**Contacts**`);
        for (const c of contacts) {
          lines.push(`- [${c.entityType}] **${c.name}** — ${c.email ?? 'no email'} | ${c.website ?? 'no site'} | ${c.linkedIn ?? 'no LinkedIn'}${c.notes ? ` | _${c.notes}_` : ''}`);
        }
        lines.push('');
      }

      if (appRecs.length > 0) {
        lines.push(`**Strategic Recommendations**`);
        for (const rec of appRecs) {
          lines.push(`- **${rec.action.toUpperCase()}** (${rec.priority}): ${rec.rationale}`);
          if (rec.suggestedPitch) {
            lines.push(`  > ${rec.suggestedPitch.replace(/\n/g, '\n  > ')}`);
          }
          if (rec.targetContact) {
            lines.push(`  - Target: ${rec.targetContact}`);
          }
        }
        lines.push('');
      }

      lines.push('---');
      lines.push('');
    }

    const markdown = lines.join('\n');

    // Ensure reports directory exists
    mkdirSync(REPORTS_DIR, { recursive: true });

    // Write files
    const dateStr = new Date().toISOString().split('T')[0];
    const mdPath = join(REPORTS_DIR, `sweep-${dateStr}-${sweepId.slice(0, 8)}.md`);
    const jsonPath = join(REPORTS_DIR, `sweep-${dateStr}-${sweepId.slice(0, 8)}.json`);

    writeFileSync(mdPath, markdown, 'utf-8');

    // JSON export for frontend consumption
    const jsonData = {
      sweep,
      apps: apps.map(app => ({
        ...app,
        ...db.getFullAppIntel(app.id),
        contacts: db.getContacts(app.id),
        recommendations: recommendations.filter(r => r.appId === app.id),
      })),
      recommendations,
    };
    writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf-8');

    console.log(`Report written to:\n  ${mdPath}\n  ${jsonPath}`);

    return mdPath;
  } finally {
    db.close();
  }
}
