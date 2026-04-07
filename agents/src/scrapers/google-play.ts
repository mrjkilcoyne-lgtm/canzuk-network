import gplay from 'google-play-scraper';

export interface PlayStoreApp {
  appId: string;
  title: string;
  developer: string;
  url: string;
  description: string;
  score: number | null;
  installs: string | null;
  genre: string;
  released: string | null;
  updated: number | null;
  privacyPolicy: string | null;
  developerWebsite: string | null;
  developerEmail: string | null;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function searchGooglePlay(term: string, maxResults = 15): Promise<PlayStoreApp[]> {
  try {
    const results = await gplay.search({
      term,
      num: maxResults,
      lang: 'en',
      country: 'gb',
    });

    return results.map((app: any) => ({
      appId: app.appId,
      title: app.title,
      developer: app.developer ?? 'Unknown',
      url: app.url,
      description: app.summary ?? app.description ?? '',
      score: app.score ?? null,
      installs: app.installs ?? null,
      genre: app.genre ?? '',
      released: app.released ?? null,
      updated: app.updated ?? null,
      privacyPolicy: app.privacyPolicy ?? null,
      developerWebsite: app.developerWebsite ?? null,
      developerEmail: app.developerEmail ?? null,
    }));
  } catch (error) {
    console.error(`[GooglePlay] Search failed for "${term}":`, error instanceof Error ? error.message : error);
    return [];
  }
}

export async function getGooglePlayDetails(appId: string): Promise<PlayStoreApp | null> {
  try {
    const app: any = await gplay.app({ appId, lang: 'en', country: 'gb' });
    return {
      appId: app.appId,
      title: app.title,
      developer: app.developer ?? 'Unknown',
      url: app.url,
      description: app.description ?? '',
      score: app.score ?? null,
      installs: app.installs ?? null,
      genre: app.genre ?? '',
      released: app.released ?? null,
      updated: app.updated ?? null,
      privacyPolicy: app.privacyPolicy ?? null,
      developerWebsite: app.developerWebsite ?? null,
      developerEmail: app.developerEmail ?? null,
    };
  } catch {
    return null;
  }
}
