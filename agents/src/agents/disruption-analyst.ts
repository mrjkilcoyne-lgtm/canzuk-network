import { v4 as uuid } from 'uuid';
import { BaseAgent } from './base-agent.js';
import { DISRUPTION_ANALYST_PROMPT } from '../llm/prompts.js';
import type { DisruptionAnalysis } from '../models/types.js';

interface DisruptionLLMResponse {
  disruptedParties: string[];
  adaptationNeeded: string[];
  keyTechToAdopt: string[];
  threatLevel: 'low' | 'medium' | 'high';
  opportunitySummary: string;
}

export class DisruptionAnalystAgent extends BaseAgent {
  name = 'DisruptionAnalyst';

  async run(): Promise<void> {
    await this.runWithErrorHandling(async () => {
      const apps = this.db.getNewAppsForSweep(this.ctx.sweepId);
      this.log(`Analysing disruption potential for ${apps.length} new apps...`);

      for (const app of apps) {
        if (this.ctx.dryRun) {
          this.log(`[DRY RUN] Would analyse: ${app.appName}`);
          continue;
        }

        try {
          const userMessage = `Analyse the following app for disruption potential in the CANZUK immigration/relocation/civic tech space:

APP NAME: ${app.appName}
DEVELOPER: ${app.developer}
PLATFORM: ${app.platform}
CATEGORY: ${app.category}
DESCRIPTION: ${app.description}
RATING: ${app.rating ?? 'N/A'}
DOWNLOADS: ${app.downloadEstimate ?? 'N/A'}

Respond with JSON:
{
  "disruptedParties": ["who gets disrupted"],
  "adaptationNeeded": ["who needs to adapt"],
  "keyTechToAdopt": ["specific tech/features to adopt"],
  "threatLevel": "low|medium|high",
  "opportunitySummary": "strategic summary"
}`;

          const result = await this.llm.askJson<DisruptionLLMResponse>(
            DISRUPTION_ANALYST_PROMPT,
            userMessage,
          );

          const analysis: DisruptionAnalysis = {
            id: uuid(),
            appId: app.id,
            sweepId: this.ctx.sweepId,
            disruptedParties: result.disruptedParties,
            adaptationNeeded: result.adaptationNeeded,
            keyTechToAdopt: result.keyTechToAdopt,
            threatLevel: result.threatLevel,
            opportunitySummary: result.opportunitySummary,
            analysedAt: new Date().toISOString(),
          };

          this.db.insertDisruptionAnalysis(analysis);
          this.log(`Analysed ${app.appName}: threat=${result.threatLevel}`);
        } catch (error) {
          this.log(`Failed to analyse ${app.appName}: ${error instanceof Error ? error.message : error}`);
        }
      }
    });
  }
}
