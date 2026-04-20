import Database from 'better-sqlite3';
import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type {
  SweepRun, DiscoveredApp, PrivacyPolicyAnalysis,
  LegalAssessment, DisruptionAnalysis, ContactInfo,
  StrategicRecommendation,
} from '../models/types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export class IntelDatabase {
  private db: Database.Database;

  constructor(dbPath?: string) {
    const resolvedPath = dbPath ?? join(__dirname, '../../data/intel.db');
    mkdirSync(dirname(resolvedPath), { recursive: true });
    this.db = new Database(resolvedPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.migrate();
  }

  private migrate(): void {
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    this.db.exec(schema);
  }

  close(): void {
    this.db.close();
  }

  // ---- Sweep Runs ----

  createSweepRun(run: SweepRun): void {
    this.db.prepare(`
      INSERT INTO sweep_runs (id, started_at, completed_at, status, search_terms_used, apps_found, agent_log)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      run.id, run.startedAt, run.completedAt, run.status,
      JSON.stringify(run.searchTermsUsed), run.appsFound,
      JSON.stringify(run.agentLog),
    );
  }

  updateSweepRun(id: string, updates: Partial<SweepRun>): void {
    const fields: string[] = [];
    const values: unknown[] = [];
    if (updates.completedAt !== undefined) { fields.push('completed_at = ?'); values.push(updates.completedAt); }
    if (updates.status !== undefined) { fields.push('status = ?'); values.push(updates.status); }
    if (updates.appsFound !== undefined) { fields.push('apps_found = ?'); values.push(updates.appsFound); }
    if (updates.agentLog !== undefined) { fields.push('agent_log = ?'); values.push(JSON.stringify(updates.agentLog)); }
    if (fields.length === 0) return;
    values.push(id);
    this.db.prepare(`UPDATE sweep_runs SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  }

  getSweepRun(id: string): SweepRun | undefined {
    const row = this.db.prepare('SELECT * FROM sweep_runs WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    return row ? this.mapSweepRun(row) : undefined;
  }

  getLatestSweepRun(): SweepRun | undefined {
    const row = this.db.prepare('SELECT * FROM sweep_runs ORDER BY started_at DESC LIMIT 1').get() as Record<string, unknown> | undefined;
    return row ? this.mapSweepRun(row) : undefined;
  }

  private mapSweepRun(row: Record<string, unknown>): SweepRun {
    return {
      id: row.id as string,
      startedAt: row.started_at as string,
      completedAt: row.completed_at as string | null,
      status: row.status as SweepRun['status'],
      searchTermsUsed: JSON.parse(row.search_terms_used as string),
      appsFound: row.apps_found as number,
      agentLog: JSON.parse(row.agent_log as string),
    };
  }

  // ---- Discovered Apps ----

  /** Check if an app with this bundle_id + platform already exists from a previous sweep */
  appExistsPreviously(bundleId: string, platform: string): boolean {
    const row = this.db.prepare(
      'SELECT 1 FROM discovered_apps WHERE bundle_id = ? AND platform = ?'
    ).get(bundleId, platform);
    return !!row;
  }

  insertApp(app: DiscoveredApp): void {
    this.db.prepare(`
      INSERT OR IGNORE INTO discovered_apps
      (id, sweep_id, app_name, platform, store_url, bundle_id, developer,
       ownership_country, hq_location, category, description, rating,
       download_estimate, release_date, last_updated, discovered_at, is_new)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      app.id, app.sweepId, app.appName, app.platform, app.storeUrl,
      app.bundleId, app.developer, app.ownershipCountry, app.hqLocation,
      app.category, app.description, app.rating, app.downloadEstimate,
      app.releaseDate, app.lastUpdated, app.discoveredAt,
      app.isNew ? 1 : 0,
    );
  }

  getAppsForSweep(sweepId: string): DiscoveredApp[] {
    const rows = this.db.prepare('SELECT * FROM discovered_apps WHERE sweep_id = ?').all(sweepId) as Record<string, unknown>[];
    return rows.map(this.mapApp);
  }

  getAppById(id: string): DiscoveredApp | undefined {
    const row = this.db.prepare('SELECT * FROM discovered_apps WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    return row ? this.mapApp(row) : undefined;
  }

  getAllApps(): DiscoveredApp[] {
    const rows = this.db.prepare('SELECT * FROM discovered_apps ORDER BY discovered_at DESC').all() as Record<string, unknown>[];
    return rows.map(this.mapApp);
  }

  getNewAppsForSweep(sweepId: string): DiscoveredApp[] {
    const rows = this.db.prepare('SELECT * FROM discovered_apps WHERE sweep_id = ? AND is_new = 1').all(sweepId) as Record<string, unknown>[];
    return rows.map(this.mapApp);
  }

  private mapApp(row: Record<string, unknown>): DiscoveredApp {
    return {
      id: row.id as string,
      sweepId: row.sweep_id as string,
      appName: row.app_name as string,
      platform: row.platform as 'apple' | 'google',
      storeUrl: row.store_url as string,
      bundleId: row.bundle_id as string,
      developer: row.developer as string,
      ownershipCountry: row.ownership_country as string,
      hqLocation: row.hq_location as string,
      category: row.category as string,
      description: row.description as string,
      rating: row.rating as number | null,
      downloadEstimate: row.download_estimate as string | null,
      releaseDate: row.release_date as string | null,
      lastUpdated: row.last_updated as string | null,
      discoveredAt: row.discovered_at as string,
      isNew: row.is_new === 1,
    };
  }

  // ---- Privacy Policy ----

  insertPrivacyAnalysis(analysis: PrivacyPolicyAnalysis): void {
    this.db.prepare(`
      INSERT INTO privacy_policy_analyses
      (id, app_id, policy_url, policy_text, data_collected, third_party_sharing,
       retention_policy, summary, analysed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      analysis.id, analysis.appId, analysis.policyUrl, analysis.policyText,
      JSON.stringify(analysis.dataCollected), JSON.stringify(analysis.thirdPartySharing),
      analysis.retentionPolicy, analysis.summary, analysis.analysedAt,
    );
  }

  updatePrivacyAnalysis(appId: string, updates: Partial<Pick<PrivacyPolicyAnalysis, 'dataCollected' | 'thirdPartySharing' | 'retentionPolicy' | 'summary'>>): void {
    const fields: string[] = [];
    const values: unknown[] = [];
    if (updates.dataCollected !== undefined) { fields.push('data_collected = ?'); values.push(JSON.stringify(updates.dataCollected)); }
    if (updates.thirdPartySharing !== undefined) { fields.push('third_party_sharing = ?'); values.push(JSON.stringify(updates.thirdPartySharing)); }
    if (updates.retentionPolicy !== undefined) { fields.push('retention_policy = ?'); values.push(updates.retentionPolicy); }
    if (updates.summary !== undefined) { fields.push('summary = ?'); values.push(updates.summary); }
    if (fields.length === 0) return;
    values.push(appId);
    this.db.prepare(`UPDATE privacy_policy_analyses SET ${fields.join(', ')} WHERE app_id = ?`).run(...values);
  }

  getPrivacyAnalysis(appId: string): PrivacyPolicyAnalysis | undefined {
    const row = this.db.prepare('SELECT * FROM privacy_policy_analyses WHERE app_id = ?').get(appId) as Record<string, unknown> | undefined;
    if (!row) return undefined;
    return {
      id: row.id as string,
      appId: row.app_id as string,
      policyUrl: row.policy_url as string | null,
      policyText: row.policy_text as string | null,
      dataCollected: JSON.parse(row.data_collected as string),
      thirdPartySharing: JSON.parse(row.third_party_sharing as string),
      retentionPolicy: row.retention_policy as string | null,
      summary: row.summary as string,
      analysedAt: row.analysed_at as string,
    };
  }

  // ---- Legal Assessments ----

  insertLegalAssessment(assessment: LegalAssessment): void {
    this.db.prepare(`
      INSERT OR REPLACE INTO legal_assessments
      (id, app_id, jurisdiction, ico_registered, gdpr_compliant, dpia_required,
       data_transfer_mechanism, risk_level, findings, recommendations, assessed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      assessment.id, assessment.appId, assessment.jurisdiction,
      assessment.icoRegistered == null ? null : assessment.icoRegistered ? 1 : 0,
      assessment.gdprCompliant == null ? null : assessment.gdprCompliant ? 1 : 0,
      assessment.dpiaRequired == null ? null : assessment.dpiaRequired ? 1 : 0,
      assessment.dataTransferMechanism, assessment.riskLevel,
      JSON.stringify(assessment.findings), JSON.stringify(assessment.recommendations),
      assessment.assessedAt,
    );
  }

  getLegalAssessments(appId: string): LegalAssessment[] {
    const rows = this.db.prepare('SELECT * FROM legal_assessments WHERE app_id = ?').all(appId) as Record<string, unknown>[];
    return rows.map(this.mapLegalAssessment);
  }

  private mapLegalAssessment(row: Record<string, unknown>): LegalAssessment {
    return {
      id: row.id as string,
      appId: row.app_id as string,
      jurisdiction: row.jurisdiction as 'uk' | 'eu',
      icoRegistered: row.ico_registered == null ? null : row.ico_registered === 1,
      gdprCompliant: row.gdpr_compliant == null ? null : row.gdpr_compliant === 1,
      dpiaRequired: row.dpia_required == null ? null : row.dpia_required === 1,
      dataTransferMechanism: row.data_transfer_mechanism as string | null,
      riskLevel: row.risk_level as LegalAssessment['riskLevel'],
      findings: JSON.parse(row.findings as string),
      recommendations: JSON.parse(row.recommendations as string),
      assessedAt: row.assessed_at as string,
    };
  }

  // ---- Disruption Analyses ----

  insertDisruptionAnalysis(analysis: DisruptionAnalysis): void {
    this.db.prepare(`
      INSERT INTO disruption_analyses
      (id, app_id, sweep_id, disrupted_parties, adaptation_needed, key_tech_to_adopt,
       threat_level, opportunity_summary, analysed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      analysis.id, analysis.appId, analysis.sweepId,
      JSON.stringify(analysis.disruptedParties), JSON.stringify(analysis.adaptationNeeded),
      JSON.stringify(analysis.keyTechToAdopt), analysis.threatLevel,
      analysis.opportunitySummary, analysis.analysedAt,
    );
  }

  getDisruptionAnalysis(appId: string): DisruptionAnalysis | undefined {
    const row = this.db.prepare('SELECT * FROM disruption_analyses WHERE app_id = ? ORDER BY analysed_at DESC LIMIT 1').get(appId) as Record<string, unknown> | undefined;
    if (!row) return undefined;
    return {
      id: row.id as string,
      appId: row.app_id as string,
      sweepId: row.sweep_id as string,
      disruptedParties: JSON.parse(row.disrupted_parties as string),
      adaptationNeeded: JSON.parse(row.adaptation_needed as string),
      keyTechToAdopt: JSON.parse(row.key_tech_to_adopt as string),
      threatLevel: row.threat_level as DisruptionAnalysis['threatLevel'],
      opportunitySummary: row.opportunity_summary as string,
      analysedAt: row.analysed_at as string,
    };
  }

  // ---- Contacts ----

  insertContact(contact: ContactInfo): void {
    this.db.prepare(`
      INSERT INTO contacts (id, app_id, entity_type, name, email, phone, website, linkedin, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      contact.id, contact.appId, contact.entityType, contact.name,
      contact.email, contact.phone, contact.website, contact.linkedIn, contact.notes,
    );
  }

  getContacts(appId: string): ContactInfo[] {
    const rows = this.db.prepare('SELECT * FROM contacts WHERE app_id = ?').all(appId) as Record<string, unknown>[];
    return rows.map(row => ({
      id: row.id as string,
      appId: row.app_id as string,
      entityType: row.entity_type as ContactInfo['entityType'],
      name: row.name as string,
      email: row.email as string | null,
      phone: row.phone as string | null,
      website: row.website as string | null,
      linkedIn: row.linkedin as string | null,
      notes: row.notes as string | null,
    }));
  }

  // ---- Strategic Recommendations ----

  insertRecommendation(rec: StrategicRecommendation): void {
    this.db.prepare(`
      INSERT INTO strategic_recommendations
      (id, sweep_id, app_id, action, priority, rationale, suggested_pitch, target_contact, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      rec.id, rec.sweepId, rec.appId, rec.action, rec.priority,
      rec.rationale, rec.suggestedPitch, rec.targetContact, rec.createdAt,
    );
  }

  getRecommendationsForSweep(sweepId: string): StrategicRecommendation[] {
    const rows = this.db.prepare('SELECT * FROM strategic_recommendations WHERE sweep_id = ? ORDER BY priority DESC').all(sweepId) as Record<string, unknown>[];
    return rows.map(row => ({
      id: row.id as string,
      sweepId: row.sweep_id as string,
      appId: row.app_id as string,
      action: row.action as StrategicRecommendation['action'],
      priority: row.priority as StrategicRecommendation['priority'],
      rationale: row.rationale as string,
      suggestedPitch: row.suggested_pitch as string | null,
      targetContact: row.target_contact as string | null,
      createdAt: row.created_at as string,
    }));
  }

  // ---- Utility ----

  getFullAppIntel(appId: string) {
    return {
      app: this.getAppById(appId),
      privacy: this.getPrivacyAnalysis(appId),
      legal: this.getLegalAssessments(appId),
      disruption: this.getDisruptionAnalysis(appId),
      contacts: this.getContacts(appId),
    };
  }
}
