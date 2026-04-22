import { v4 as uuid } from 'uuid';
import { BaseAgent } from './base-agent.js';
import { DATABASE_BUILDER_PROMPT } from '../llm/prompts.js';
import type { ContactInfo } from '../models/types.js';

interface ContactsLLMResponse {
  ownershipCountry: string;
  hqLocation: string;
  contacts: Array<{
    entityType: 'app_owner' | 'competitor' | 'impacted_party';
    name: string;
    email: string | null;
    phone: string | null;
    website: string | null;
    linkedIn: string | null;
    notes: string | null;
  }>;
}

export class DatabaseBuilderAgent extends BaseAgent {
  name = 'DatabaseBuilder';

  async run(): Promise<void> {
    await this.runWithErrorHandling(async () => {
      const apps = this.db.getNewAppsForSweep(this.ctx.sweepId);
      this.log(`Enriching data and building contacts for ${apps.length} new apps...`);

      for (const app of apps) {
        if (this.ctx.dryRun) {
          this.log(`[DRY RUN] Would enrich: ${app.appName}`);
          continue;
        }

        try {
          const privacy = this.db.getPrivacyAnalysis(app.id);
          const disruption = this.db.getDisruptionAnalysis(app.id);

          const userMessage = `Extract contact information and identify competitors for the following app:

APP NAME: ${app.appName}
DEVELOPER: ${app.developer}
PLATFORM: ${app.platform}
STORE URL: ${app.storeUrl}
CATEGORY: ${app.category}
DESCRIPTION: ${app.description}
${privacy?.policyUrl ? `PRIVACY POLICY URL: ${privacy.policyUrl}` : ''}
${disruption ? `DISRUPTED PARTIES: ${disruption.disruptedParties.join(', ')}` : ''}

Also determine the ownership country and headquarters location of this developer/company.

Respond with JSON:
{
  "ownershipCountry": "2-letter country code or full name",
  "hqLocation": "City, Country",
  "contacts": [
    {
      "entityType": "app_owner|competitor|impacted_party",
      "name": "Company or person name",
      "email": "email or null",
      "phone": "phone or null",
      "website": "url or null",
      "linkedIn": "profile url or null",
      "notes": "any relevant context"
    }
  ]
}

Include at least:
- The app owner's contact details
- 2-3 direct competitors with whatever contact details you can identify
- Any impacted parties (existing services being disrupted)`;

          const result = await this.llm.askJson<ContactsLLMResponse>(
            DATABASE_BUILDER_PROMPT,
            userMessage,
          );

          if (result.ownershipCountry || result.hqLocation) {
            this.db.updateAppLocation(app.id, result.ownershipCountry, result.hqLocation);
          }

          // Store contacts
          for (const contact of result.contacts) {
            const contactRecord: ContactInfo = {
              id: uuid(),
              appId: app.id,
              entityType: contact.entityType,
              name: contact.name,
              email: contact.email,
              phone: contact.phone,
              website: contact.website,
              linkedIn: contact.linkedIn,
              notes: contact.notes,
            };
            this.db.insertContact(contactRecord);
          }

          this.log(`Enriched ${app.appName}: ${result.contacts.length} contacts, HQ=${result.hqLocation}`);
        } catch (error) {
          this.log(`Failed to enrich ${app.appName}: ${error instanceof Error ? error.message : error}`);
        }
      }
    });
  }
}
