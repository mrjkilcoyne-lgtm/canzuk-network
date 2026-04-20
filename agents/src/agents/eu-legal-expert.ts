import { v4 as uuid } from 'uuid';
import { BaseAgent } from './base-agent.js';
import { EU_LEGAL_EXPERT_PROMPT } from '../llm/prompts.js';
import type { LegalAssessment } from '../models/types.js';

interface LegalLLMResponse {
  gdprCompliant: boolean | null;
  dpiaRequired: boolean | null;
  dataTransferMechanism: string | null;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  findings: string[];
  recommendations: string[];
  dataCollected: string[];
  thirdPartySharing: string[];
  retentionPolicy: string | null;
  privacySummary: string;
}

export class EULegalExpertAgent extends BaseAgent {
  name = 'EULegalExpert';

  async run(): Promise<void> {
    await this.runWithErrorHandling(async () => {
      const apps = this.db.getAppsForSweep(this.ctx.sweepId);
      this.log(`EU legal assessment for ${apps.length} apps...`);

      for (const app of apps) {
        if (this.ctx.dryRun) {
          this.log(`[DRY RUN] Would assess: ${app.appName}`);
          continue;
        }

        try {
          const privacy = this.db.getPrivacyAnalysis(app.id);
          const policySection = privacy?.policyText
            ? `\n\nPRIVACY POLICY TEXT (truncated):\n${privacy.policyText.slice(0, 8000)}`
            : '\n\nPRIVACY POLICY: Not available — assess based on app description and category.';

          const userMessage = `Assess the following app under EU data protection law (GDPR):

APP NAME: ${app.appName}
DEVELOPER: ${app.developer}
PLATFORM: ${app.platform}
CATEGORY: ${app.category}
OWNERSHIP COUNTRY: ${app.ownershipCountry}
HQ LOCATION: ${app.hqLocation}
DESCRIPTION: ${app.description}
${privacy?.policyUrl ? `PRIVACY POLICY URL: ${privacy.policyUrl}` : ''}${policySection}

Respond with JSON:
{
  "gdprCompliant": true|false|null,
  "dpiaRequired": true|false|null,
  "dataTransferMechanism": "mechanism or null",
  "riskLevel": "low|medium|high|critical",
  "findings": ["finding 1", "finding 2"],
  "recommendations": ["rec 1", "rec 2"],
  "dataCollected": ["list of personal data types collected"],
  "thirdPartySharing": ["list of third parties data is shared with"],
  "retentionPolicy": "summary of data retention periods or null",
  "privacySummary": "2-3 sentence plain-English summary of the privacy policy"
}`;

          const result = await this.llm.askJson<LegalLLMResponse>(
            EU_LEGAL_EXPERT_PROMPT,
            userMessage,
          );

          const assessment: LegalAssessment = {
            id: uuid(),
            appId: app.id,
            jurisdiction: 'eu',
            icoRegistered: null, // N/A for EU
            gdprCompliant: result.gdprCompliant,
            dpiaRequired: result.dpiaRequired,
            dataTransferMechanism: result.dataTransferMechanism,
            riskLevel: result.riskLevel,
            findings: result.findings,
            recommendations: result.recommendations,
            assessedAt: new Date().toISOString(),
          };

          this.db.insertLegalAssessment(assessment);

          if (privacy) {
            this.db.updatePrivacyAnalysis(app.id, {
              dataCollected: result.dataCollected,
              thirdPartySharing: result.thirdPartySharing,
              retentionPolicy: result.retentionPolicy,
              summary: result.privacySummary,
            });
          }

          this.log(`EU assessed ${app.appName}: risk=${result.riskLevel}`);
        } catch (error) {
          this.log(`EU assessment failed for ${app.appName}: ${error instanceof Error ? error.message : error}`);
        }
      }
    });
  }
}
