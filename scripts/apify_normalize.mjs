/**
 * Normalize raw Apify dataset items into candidate schema.
 * Mapping defined per-actor in config/apify_actors.json
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRY_PATH = join(__dirname, '../config/apify_actors.json');

export function loadRegistry() {
  return JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
}

function getPath(obj, path) {
  if (!path) return undefined;
  const parts = path.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    const idx = /^\d+$/.test(p) ? parseInt(p, 10) : p;
    cur = cur[idx];
  }
  return cur;
}

function firstTruthy(item, keys) {
  for (const key of keys) {
    if (key.includes('{{')) {
      const m = key.match(/\{\{(\w+(?:\.\w+)*)\}\}/g);
      if (m) {
        let s = key;
        for (const token of m) {
          const field = token.slice(2, -2);
          const val = getPath(item, field.replace(/\]/g, '').replace(/\[/g, '.'));
          if (val != null) s = s.replace(token, String(val));
        }
        if (!s.includes('{{')) return s;
      }
      continue;
    }
    const val = getPath(item, key);
    if (val != null && String(val).trim() !== '') return val;
  }
  return '';
}

export function normalizeItem(item, sourceKey, meta = {}) {
  const registry = loadRegistry();
  const actor = registry[sourceKey];
  if (!actor) throw new Error(`Unknown source for normalization: ${sourceKey}`);

  const map = actor.normalize_map;
  const name = firstTruthy(item, map.name || ['fullName', 'name']);
  const role = firstTruthy(item, map.role || ['headline']);
  const company = firstTruthy(item, map.company || []);
  const person_location = firstTruthy(item, map.person_location || ['location']);
  const linkedin = firstTruthy(item, map.linkedin_url || []);
  const instagram = firstTruthy(item, map.instagram_url || []);
  const company_linkedin = firstTruthy(item, map.company_linkedin_url || []);
  const profile =
    String(linkedin || instagram || firstTruthy(item, map.profile_url || []) || '').trim();

  return {
    name: String(name || '').trim(),
    role: String(role || '').trim(),
    company: String(company || '').trim(),
    person_location: String(person_location || '').trim(),
    links: {
      linkedin: String(linkedin || '').trim(),
      instagram: String(instagram || '').trim(),
      company_linkedin: String(company_linkedin || '').trim(),
      profile: String(profile || '').trim(),
    },
    headline: String(firstTruthy(item, map.headline || ['headline']) || '').trim(),
    bio_snippet: String(firstTruthy(item, map.bio_snippet || ['about', 'biography', 'summary']) || '').trim().slice(0, 500),
    source: actor.source,
    scraped_at: meta.scraped_at || new Date().toISOString(),
    scrape_id: meta.scrape_id || '',
    raw_ref: meta.raw_ref || '',
    apify_run_id: meta.apify_run_id || '',
  };
}

export function normalizeBatch(rawItems, sourceKey, meta = {}) {
  return rawItems
    .map((item) => normalizeItem(item, sourceKey, meta))
    .filter((c) => c.name || c.links.profile || c.links.linkedin || c.links.instagram);
}
