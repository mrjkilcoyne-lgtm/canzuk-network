-- CANZUK Intel Agents — Database Schema

CREATE TABLE IF NOT EXISTS sweep_runs (
  id TEXT PRIMARY KEY,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  status TEXT NOT NULL DEFAULT 'running' CHECK(status IN ('running', 'completed', 'failed')),
  search_terms_used TEXT NOT NULL DEFAULT '[]',  -- JSON array
  apps_found INTEGER NOT NULL DEFAULT 0,
  agent_log TEXT NOT NULL DEFAULT '[]'           -- JSON array of log entries
);

CREATE TABLE IF NOT EXISTS discovered_apps (
  id TEXT PRIMARY KEY,
  sweep_id TEXT NOT NULL REFERENCES sweep_runs(id),
  app_name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK(platform IN ('apple', 'google')),
  store_url TEXT NOT NULL,
  bundle_id TEXT NOT NULL,
  developer TEXT NOT NULL,
  ownership_country TEXT NOT NULL DEFAULT 'Unknown',
  hq_location TEXT NOT NULL DEFAULT 'Unknown',
  category TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  rating REAL,
  download_estimate TEXT,
  release_date TEXT,
  last_updated TEXT,
  discovered_at TEXT NOT NULL,
  is_new INTEGER NOT NULL DEFAULT 1  -- 1 = first seen this sweep, 0 = previously discovered
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_apps_bundle_platform
  ON discovered_apps(bundle_id, platform);

CREATE TABLE IF NOT EXISTS privacy_policy_analyses (
  id TEXT PRIMARY KEY,
  app_id TEXT NOT NULL REFERENCES discovered_apps(id),
  policy_url TEXT,
  policy_text TEXT,
  data_collected TEXT NOT NULL DEFAULT '[]',     -- JSON array
  third_party_sharing TEXT NOT NULL DEFAULT '[]', -- JSON array
  retention_policy TEXT,
  summary TEXT NOT NULL DEFAULT '',
  analysed_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS legal_assessments (
  id TEXT PRIMARY KEY,
  app_id TEXT NOT NULL REFERENCES discovered_apps(id),
  jurisdiction TEXT NOT NULL CHECK(jurisdiction IN ('uk', 'eu')),
  ico_registered INTEGER,        -- boolean: 0/1/null
  gdpr_compliant INTEGER,        -- boolean: 0/1/null
  dpia_required INTEGER,         -- boolean: 0/1/null
  data_transfer_mechanism TEXT,
  risk_level TEXT NOT NULL CHECK(risk_level IN ('low', 'medium', 'high', 'critical')),
  findings TEXT NOT NULL DEFAULT '[]',           -- JSON array
  recommendations TEXT NOT NULL DEFAULT '[]',    -- JSON array
  assessed_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_legal_app_jurisdiction
  ON legal_assessments(app_id, jurisdiction);

CREATE TABLE IF NOT EXISTS disruption_analyses (
  id TEXT PRIMARY KEY,
  app_id TEXT NOT NULL REFERENCES discovered_apps(id),
  sweep_id TEXT NOT NULL REFERENCES sweep_runs(id),
  disrupted_parties TEXT NOT NULL DEFAULT '[]',  -- JSON array
  adaptation_needed TEXT NOT NULL DEFAULT '[]',  -- JSON array
  key_tech_to_adopt TEXT NOT NULL DEFAULT '[]',  -- JSON array
  threat_level TEXT NOT NULL CHECK(threat_level IN ('low', 'medium', 'high')),
  opportunity_summary TEXT NOT NULL DEFAULT '',
  analysed_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  app_id TEXT NOT NULL REFERENCES discovered_apps(id),
  entity_type TEXT NOT NULL CHECK(entity_type IN ('app_owner', 'competitor', 'impacted_party')),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  website TEXT,
  linkedin TEXT,
  notes TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_contacts_dedup
  ON contacts(app_id, entity_type, name);

CREATE TABLE IF NOT EXISTS strategic_recommendations (
  id TEXT PRIMARY KEY,
  sweep_id TEXT NOT NULL REFERENCES sweep_runs(id),
  app_id TEXT NOT NULL REFERENCES discovered_apps(id),
  action TEXT NOT NULL CHECK(action IN ('contact', 'monitor', 'adopt_tech', 'ignore', 'partner', 'compete')),
  priority TEXT NOT NULL CHECK(priority IN ('low', 'medium', 'high', 'urgent')),
  rationale TEXT NOT NULL DEFAULT '',
  suggested_pitch TEXT,
  target_contact TEXT,
  created_at TEXT NOT NULL
);
