import { v4 as uuid } from 'uuid';
import { BaseAgent } from './base-agent.js';
import { GRAND_STRATEGY_PROMPT } from '../llm/prompts.js';
import type { StrategicRecommendation } from '../models/types.js';

interface OutreachAngle {
  targetType: 'app_owner' | 'impacted_party' | 'competitor';
  action: 'contact' | 'monitor' | 'adopt_tech' | 'ignore' | 'partner' | 'compete';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  rationale: string;
  suggestedPitch: string | null;
  targetContact: string | null;
}

interface StrategyLLMResponse {
  primaryAction: 'contact' | 'monitor' | 'adopt_tech' | 'ignore' | 'partner' | 'compete';
  primaryPriority: 'low' | 'medium' | 'high' | 'urgent';
  overallRationale: string;
  outreachAngles: OutreachAngle[];
}

export class GrandStrategyAgent extends BaseAgent {
  name = 'GrandStrategy';

  async run(): Promise<void> {
    await this.runWithErrorHandling(async () => {
      const apps = this.db.getNewAppsForSweep(this.ctx.sweepId);
      this.log(`Running grand strategy analysis on ${apps.length} new apps...`);

      for (const app of apps) {
        if (this.ctx.dryRun) {
          this.log(`[DRY RUN] Would strategise: ${app.appName}`);
          continue;
        }

        try {
          const intel = this.db.getFullAppIntel(app.id);
          const contacts = this.db.getContacts(app.id);

          const userMessage = `Synthesise all intelligence on this app and provide strategic recommendations for CANZUK Network.

IMPORTANT: Evaluate THREE outreach angles — the app owner, any impacted parties being disrupted, and competitors. The best opportunities are often with the impacted parties who don't yet know they're being disrupted.

=== APP OVERVIEW ===
Name: ${app.appName}
Developer: ${app.developer}
Platform: ${app.platform}
Category: ${app.category}
Ownership Country: ${app.ownershipCountry}
HQ: ${app.hqLocation}
Rating: ${app.rating ?? 'N/A'}
Downloads: ${app.downloadEstimate ?? 'N/A'}
New This Sweep: ${app.isNew ? 'YES — first time discovered' : 'No — seen in a previous sweep'}
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

Based on ALL of the above, provide strategic recommendations for EACH outreach angle.

Respond with JSON:
{
  "primaryAction": "contact|monitor|adopt_tech|ignore|partner|compete",
  "primaryPriority": "low|medium|high|urgent",
  "overallRationale": "high-level strategic reasoning about this app's significance",
  "outreachAngles": [
    {
      "targetType": "app_owner",
      "action": "contact|monitor|adopt_tech|ignore|partner|compete",
      "priority": "low|medium|high|urgent",
      "rationale": "why this action for the app owner",
      "suggestedPitch": "outreach message if action is contact/partner, otherwise null",
      "targetContact": "specific person/role to contact, or null"
    },
    {
      "targetType": "impacted_party",
      "action": "contact|monitor|adopt_tech|ignore|partner|compete",
      "priority": "low|medium|high|urgent",
      "rationale": "why contact (or not) the disrupted party — what pain point can we address?",
      "suggestedPitch": "outreach message pitched as: we spotted this new app disrupting your space, here's what we can offer",
      "targetContact": "specific impacted org/person/role, or null"
    },
    {
      "targetType": "competitor",
      "action": "contact|monitor|adopt_tech|ignore|partner|compete",
      "priority": "low|medium|high|urgent",
      "rationale": "why engage (or not) a competitor in this space",
      "suggestedPitch": "outreach message if relevant, otherwise null",
      "targetContact": "specific competitor org/person/role, or null"
    }
  ]
}`;

          const result = await this.llm.askJson<StrategyLLMResponse>(
            GRAND_STRATEGY_PROMPT,
            userMessage,
            { model: 'claude-sonnet-4-6' },
          );

          // Store the primary (overall) recommendation
          const primaryRec: StrategicRecommendation = {
            id: uuid(),
            sweepId: this.ctx.sweepId,
            appId: app.id,
            action: result.primaryAction,
            priority: result.primaryPriority,
            rationale: result.overallRationale,
            suggestedPitch: null,
            targetContact: null,
            createdAt: new Date().toISOString(),
          };
          this.db.insertRecommendation(primaryRec);

          // Store each outreach angle as a separate recommendation
          for (const angle of result.outreachAngles) {
            if (angle.action === 'ignore') continue; // Don't store "ignore" angles

            const angleRec: StrategicRecommendation = {
              id: uuid(),
              sweepId: this.ctx.sweepId,
              appId: app.id,
              action: angle.action,
              priority: angle.priority,
              rationale: `[${angle.targetType.toUpperCase()}] ${angle.rationale}`,
              suggestedPitch: angle.suggestedPitch,
              targetContact: angle.targetContact,
              createdAt: new Date().toISOString(),
            };
            this.db.insertRecommendation(angleRec);
          }

          const actionableAngles = result.outreachAngles.filter(a => a.action !== 'ignore');
          this.log(`Strategy for ${app.appName}: ${result.primaryAction} (${result.primaryPriority}) — ${actionableAngles.length} outreach angles`);
        } catch (error) {
          this.log(`Strategy failed for ${app.appName}: ${error instanceof Error ? error.message : error}`);
        }
      }
    });
  }
}
