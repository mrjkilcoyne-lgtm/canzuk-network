import store from 'app-store-scraper';

export interface AppStoreApp {
  id: number;
  appId: string;
  title: string;
  developer: string;
  url: string;
  description: string;
  score: number | null;
  genre: string;
  released: string | null;
  updated: string | null;
  privacyPolicy: string | null;
  developerWebsite: string | null;
}

export async function searchAppleAppStore(term: string, maxResults = 15, country = 'gb'): Promise<AppStoreApp[]> {
  try {
    const results = await store.search({
      term,
      num: maxResults,
      lang: 'en',
      country,
    });

    return results.map((app: Record<string, unknown>) => ({
      id: app.id as number,
      appId: (app.appId as string) ?? String(app.id),
      title: app.title as string,
      developer: (app.developer as string) ?? 'Unknown',
      url: app.url as string,
      description: (app.description as string) ?? '',
      score: (app.score as number) ?? null,
      genre: (app.primaryGenre as string) ?? (app.genre as string) ?? '',
      released: (app.released as string) ?? null,
      updated: (app.updated as string) ?? null,
      privacyPolicy: (app.privacyUrl as string) ?? null,
      developerWebsite: (app.developerUrl as string) ?? null,
    }));
  } catch (error) {
    console.error(`[AppleAppStore] Search failed for "${term}":`, error instanceof Error ? error.message : error);
    return [];
  }
}

export async function getAppleAppDetails(appId: string | number, country = 'gb'): Promise<AppStoreApp | null> {
  try {
    const app = await store.app({ id: appId, lang: 'en', country });
    return {
      id: app.id,
      appId: app.appId ?? String(app.id),
      title: app.title,
      developer: app.developer ?? 'Unknown',
      url: app.url,
      description: app.description ?? '',
      score: app.score ?? null,
      genre: app.primaryGenre ?? '',
      released: app.released ?? null,
      updated: app.updated ?? null,
      privacyPolicy: app.privacyUrl ?? null,
      developerWebsite: app.developerUrl ?? null,
    };
  } catch {
    return null;
  }
}
