// Search terms and categories for app store sweeps

export const SEARCH_TERMS = [
  // Direct CANZUK / immigration
  'CANZUK',
  'immigration app',
  'visa application',
  'relocation abroad',
  'expat community',
  'moving abroad',
  'citizenship application',
  'settlement visa',
  'work permit',

  // Country-specific immigration
  'UK immigration',
  'Canada immigration',
  'Australia immigration',
  'New Zealand immigration',
  'UK visa',
  'Canada visa',
  'Australia visa',
  'skilled worker visa',

  // Community / social for migrants
  'expat social network',
  'diaspora community',
  'newcomer guide',
  'immigrant support',
  'cultural integration',

  // Civic / government
  'civic engagement',
  'local council finder',
  'MP finder UK',
  'government services',
  'public services app',

  // Housing / settling
  'housing abroad',
  'rent flat UK',
  'apartment finder Canada',
  'housing Australia',
  'flatmate finder',

  // Financial / banking for migrants
  'international money transfer',
  'expat banking',
  'open bank account abroad',
  'currency exchange',

  // Jobs / career
  'jobs abroad',
  'international jobs',
  'skilled migration jobs',
  'work in UK',
  'work in Canada',
  'work in Australia',
];

export const CANZUK_COUNTRIES = ['CA', 'AU', 'NZ', 'GB'] as const;

export const APP_CATEGORIES = [
  'SOCIAL',
  'TRAVEL',
  'FINANCE',
  'BUSINESS',
  'LIFESTYLE',
  'EDUCATION',
  'GOVERNMENT',
  'UTILITIES',
] as const;

// Max apps to fetch per search term per platform
export const MAX_RESULTS_PER_TERM = 15;

// Max total apps to process per sweep (cost control)
export const MAX_APPS_PER_SWEEP = 200;
