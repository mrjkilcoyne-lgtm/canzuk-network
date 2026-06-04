import { v4 as uuid } from 'uuid';
import { BaseAgent } from './base-agent.js';
import { searchGooglePlay } from '../scrapers/google-play.js';
import { searchAppleAppStore } from '../scrapers/apple-app-store.js';
import { fetchPrivacyPolicy } from '../scrapers/privacy-policy.js';
import { SEARCH_TERMS, MAX_RESULTS_PER_TERM, MAX_APPS_PER_SWEEP, CANZUK_COUNTRIES } from '../config/search-terms.js';
import type { DiscoveredApp, PrivacyPolicyAnalysis, ContactInfo } from '../models/types.js';

export class AppStoreResearchAgent extends BaseAgent {
  name = 'AppStoreResearch';

  async run(): Promise<void> {
    await this.runWithErrorHandling(async () => {
      const seen = new Set<string>(); // bundle_id + platform dedup within this sweep
      const apps: DiscoveredApp[] = [];
      let newCount = 0;
      let returningCount = 0;

      this.log(`Searching ${SEARCH_TERMS.length} terms across both stores in ${CANZUK_COUNTRIES.length} CANZUK countries...`);

      for (const term of SEARCH_TERMS) {
        if (apps.length >= MAX_APPS_PER_SWEEP) {
          this.log(`Hit max apps limit (${MAX_APPS_PER_SWEEP}), stopping search.`);
          break;
        }

        // Search all 4 CANZUK stores in parallel for each term
        const googleSearches = CANZUK_COUNTRIES.map(country =>
          searchGooglePlay(term, MAX_RESULTS_PER_TERM, country.toLowerCase()),
        );
        const appleSearches = CANZUK_COUNTRIES.map(country =>
          searchAppleAppStore(term, MAX_RESULTS_PER_TERM, country.toLowerCase()),
        );
        const [googleResultsByCountry, appleResultsByCountry] = await Promise.all([
          Promise.all(googleSearches),
          Promise.all(appleSearches),
        ]);

        const countryCounts: Record<string, { google: number; apple: number }> = {};

        for (let i = 0; i < CANZUK_COUNTRIES.length; i++) {
          const country = CANZUK_COUNTRIES[i];
          const googleResults = googleResultsByCountry[i];
          const appleResults = appleResultsByCountry[i];
          countryCounts[country] = { google: googleResults.length, apple: appleResults.length };

          // Process Google Play results
          for (const gApp of googleResults) {
            const key = `google:${gApp.appId}`;
            if (seen.has(key)) continue;
            seen.add(key);

            const isNew = !this.db.appExistsPreviously(gApp.appId, 'google');
            if (isNew) newCount++; else returningCount++;

            const app: DiscoveredApp = {
              id: uuid(),
              sweepId: this.ctx.sweepId,
              appName: gApp.title,
              platform: 'google',
              storeUrl: gApp.url,
              bundleId: gApp.appId,
              developer: gApp.developer,
              ownershipCountry: 'Unknown', // Enriched later by DatabaseBuilder
              hqLocation: 'Unknown',
              category: gApp.genre,
              description: gApp.description,
              rating: gApp.score,
              downloadEstimate: gApp.installs,
              releaseDate: gApp.released,
              lastUpdated: gApp.updated ? new Date(gApp.updated).toISOString() : null,
              discoveredAt: new Date().toISOString(),
              isNew,
            };

            apps.push(app);

            if (isNew && (gApp.developerEmail || gApp.developerWebsite)) {
              const contact: ContactInfo = {
                id: uuid(),
                appId: app.id,
                entityType: 'app_owner',
                name: gApp.developer,
                email: gApp.developerEmail ?? null,
                phone: null,
                website: gApp.developerWebsite ?? null,
                linkedIn: null,
                notes: `Auto-discovered from Google Play (${country} store)`,
              };
              this.db.insertContact(contact);
            }

            // Fetch and store privacy policy if available (only for new apps)
            if (isNew && gApp.privacyPolicy) {
              await this.fetchAndStorePrivacyPolicy(app.id, gApp.privacyPolicy);
            }
          }

          // Process Apple App Store results
          for (const aApp of appleResults) {
            const key = `apple:${aApp.appId}`;
            if (seen.has(key)) continue;
            seen.add(key);

            const isNew = !this.db.appExistsPreviously(aApp.appId, 'apple');
            if (isNew) newCount++; else returningCount++;

            const app: DiscoveredApp = {
              id: uuid(),
              sweepId: this.ctx.sweepId,
              appName: aApp.title,
              platform: 'apple',
              storeUrl: aApp.url,
              bundleId: aApp.appId,
              developer: aApp.developer,
              ownershipCountry: 'Unknown',
              hqLocation: 'Unknown',
              category: aApp.genre,
              description: aApp.description,
              rating: aApp.score,
              downloadEstimate: null,
              releaseDate: aApp.released,
              lastUpdated: aApp.updated,
              discoveredAt: new Date().toISOString(),
              isNew,
            };

            apps.push(app);

            if (isNew && aApp.developerWebsite) {
              const contact: ContactInfo = {
                id: uuid(),
                appId: app.id,
                entityType: 'app_owner',
                name: aApp.developer,
                email: null,
                phone: null,
                website: aApp.developerWebsite,
                linkedIn: null,
                notes: `Auto-discovered from Apple App Store (${country} store)`,
              };
              this.db.insertContact(contact);
            }

            if (isNew && aApp.privacyPolicy) {
              await this.fetchAndStorePrivacyPolicy(app.id, aApp.privacyPolicy);
            }
          }
        }

        const breakdown = CANZUK_COUNTRIES.map(c => `${c}: ${countryCounts[c].google}G+${countryCounts[c].apple}A`).join(', ');
        this.log(`"${term}": ${breakdown}. Total unique: ${apps.length}`);
      }

      // Store only genuinely new apps (INSERT OR IGNORE handles DB-level dedup)
      for (const app of apps) {
        this.db.insertApp(app);
      }

      this.db.updateSweepRun(this.ctx.sweepId, { appsFound: newCount });
      this.log(`Discovered ${apps.length} unique apps: ${newCount} NEW, ${returningCount} previously seen.`);
      if (returningCount > 0) {
        this.log(`Skipped ${returningCount} previously-seen apps — only new entries will be analysed.`);
      }
    });
  }

  private async fetchAndStorePrivacyPolicy(appId: string, policyUrl: string): Promise<void> {
    try {
      const text = await fetchPrivacyPolicy(policyUrl);
      const analysis: PrivacyPolicyAnalysis = {
        id: uuid(),
        appId,
        policyUrl,
        policyText: text,
        dataCollected: [],     // Filled in by legal agents
        thirdPartySharing: [], // Filled in by legal agents
        retentionPolicy: null,
        summary: '',
        analysedAt: new Date().toISOString(),
      };
      this.db.insertPrivacyAnalysis(analysis);
    } catch {
      // Non-fatal — some policies are behind CAPTCHAs or geo-blocks
    }
  }
}
