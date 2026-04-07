declare module 'app-store-scraper' {
  interface SearchOptions {
    term: string;
    num?: number;
    lang?: string;
    country?: string;
  }

  interface AppOptions {
    id: string | number;
    lang?: string;
    country?: string;
  }

  interface AppResult {
    id: number;
    appId: string;
    title: string;
    developer: string;
    url: string;
    description: string;
    summary: string;
    score: number | null;
    primaryGenre: string;
    genre: string;
    released: string;
    updated: string;
    privacyUrl: string | null;
    developerUrl: string | null;
    [key: string]: unknown;
  }

  function search(options: SearchOptions): Promise<AppResult[]>;
  function app(options: AppOptions): Promise<AppResult>;

  export { search, app };
  export default { search, app };
}
