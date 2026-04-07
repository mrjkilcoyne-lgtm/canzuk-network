import { v4 as uuid } from 'uuid';
import { BaseAgent } from './base-agent.js';
import { GRAND_STRATEGY_PROMPT } from '../llm/prompts.js';
import type { StrategicRecommendation } from '../models/types.js';

interface StrategyLLMResponse {
  action: 'contact' | 'monitor' | 'adopt_tech' | 'ignore' | 'partner' | 'compete';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  rationale: string;
  suggestedPitch: string | null;
  targetContact: string | null;
}

export class GrandStrategyAgent extends BaseAgent {
  name = 'GrandStrategy';

  async run(): Promise<void> {
    await this.runWithErrorHandling(async () => {
      const apps = this.db.getAppsForSweep(this.ctx.sweepId);
      this.log(`Running grand strategy analysis on ${apps.length} apps...`);

      for (const app of apps) {
        if (this.ctx.dryRun) {
          this.log(`[DRY RUN] Would strategise: ${app.appName}`);
          continue;
        }

        try {
          const intel = this.db.getFullAppIntel(app.id);
          const contacts = this.db.getContacts(app.id);

          const userMessage = `Synthesise all intelligence on this app and provide a strategic recommendation for CANZUK Network:

=== APP OVERVIEW ===
Name: ${app.appName}
Developer: ${app.developer}
Platform: ${app.platform}
Category: ${app.category}
Ownership Country: ${app.ownershipCountry}
HQ: ${app.hqLocation}
Rating: ${app.rating ?? 'N/A'}
Downloads: ${app.downloadEstimate ?? 'N/A'}
Description: ${app.description}

=== DISRUPTION ANALYSIS ===
${intel.disruption ? `
Threat Level: ${intel.disruption.threatLevel}
Disrupted Parties: ${intel.disruption.disruptedParties.join(', ')}
Adaptation Needed: ${intel.disruption.adaptationNeeded.join(', ')}
Key Tech to Adopt: ${intel.disruption.keyTechToAdopt.join(', ')}
Opportunity: ${intel.disruption.opportunitySummary}
` : 'Not available'}

=== UK LEGAL ASSESSMENT ===
${intel.legal.find(l => l.jurisdiction === 'uk') ? (() => {
  const uk = intel.legal.find(l => l.jurisdiction === 'uk')!;
  return `Risk: ${uk.riskLevel}
ICO Registered: ${uk.icoRegistered}
GDPR Compliant: ${uk.gdprCompliant}
Findings: ${uk.findings.join('; ')}`;
})() : 'Not available'}

=== EU LEGAL ASSESSMENT ===
${intel.legal.find(l => l.jurisdiction === 'eu') ? (() => {
  const eu = intel.legal.find(l => l.jurisdiction === 'eu')!;
  return `Risk: ${eu.riskLevel}
GDPR Compliant: ${eu.gdprCompliant}
Findings: ${eu.findings.join('; ')}`;
})() : 'Not available'}

=== KNOWN CONTACTS ===
${contacts.map(c => `${c.entityType}: ${c.name} (${c.email ?? 'no email'}) — ${c.website ?? 'no site'}`).join('\n') || 'None found'}

=== PRIVACY ANALYSIS ===
${intel.privacy ? `
Data Collected: ${intel.privacy.dataCollected.join(', ') || 'Unknown'}
Third Party Sharing: ${intel.privacy.thirdPartySharing.join(', ') || 'Unknown'}
Summary: ${intel.privacy.summary || 'Not analysed'}
` : 'Not available'}

Based on ALL of the above, provide your strategic recommendation.

Respond with JSON:
{
  "action": "contact|monitor|adopt_tech|ignore|partner|compete",
  "priority": "low|medium|high|urgent",
  "rationale": "your strategic reasoning",
  "suggestedPitch": "if action is contact/partner, write the outreach message here, otherwise null",
  "targetContact": "who specifically to contact (name/role), or null"
}`;

          const result = await this.llm.askJson<StrategyLLMResponse>(
            GRAND_STRATEGY_PROMPT,
            userMessage,
            { model: 'claude-sonnet-4-20250514' }, // Use Sonnet for cost efficiency at scale
          );

          const rec: StrategicRecommendation = {
            id: uuid(),
            sweepId: this.ctx.sweepId,
            appId: app.id,
            action: result.action,
            priority: result.priority,
            rationale: result.rationale,
            suggestedPitch: result.suggestedPitch,
            targetContact: result.targetContact,
            createdAt: new Date().toISOString(),
          };

          this.db.insertRecommendation(rec);
          this.log(`Strategy for ${app.appName}: ${result.action} (${result.priority})`);
        } catch (error) {
          this.log(`Strategy failed for ${app.appName}: ${error instanceof Error ? error.message : error}`);
        }
      }
    });
  }
}
