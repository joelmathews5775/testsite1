/**
 * GET /api/patrons
 *
 * Server-side only — this is what keeps the Patreon access token out of
 * the browser. supporters.html calls this same-origin endpoint instead
 * of calling Patreon directly, so the token never reaches the client.
 *
 * Required environment variable (set in the Vercel project settings,
 * never committed to the repo):
 *   PATREON_ACCESS_TOKEN — a Creator's Access Token from
 *     https://www.patreon.com/portal/registration/register-clients
 *     (or the equivalent OAuth flow), with the "campaigns" and
 *     "campaigns.members" scopes.
 *
 * Optional:
 *   PATREON_CAMPAIGN_ID — if omitted, this looks up the token owner's
 *     own campaign automatically (one extra API call). Setting it
 *     explicitly skips that lookup.
 *
 * IMPORTANT — I can't test this against a real Patreon account from
 * this environment (no network access to Patreon's API, no real
 * token). The request shapes and field names below follow Patreon's
 * documented API v2 conventions, but Patreon does change field names
 * and pagination details between API versions — verify this against
 * https://docs.patreon.com/ once you have a real token, and treat the
 * first live deploy as a test run, not a guarantee.
 */

const PATREON_API_BASE = 'https://www.patreon.com/api/oauth2/v2';

// The three known tiers, in the order they should display. Any tier
// name Patreon returns that doesn't match one of these still gets
// shown (grouped under its own heading) rather than silently dropped
// — so a tier rename on Patreon's side degrades gracefully instead of
// disappearing.
const KNOWN_TIER_ORDER = [
  'Infrastructure Backer',
  'Visionary Partner',
  'Buy the Dev a Coffee',
];

async function patreonFetch(path, token) {
  const res = await fetch(`${PATREON_API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Patreon API ${res.status} for ${path}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

async function getCampaignId(token) {
  const data = await patreonFetch('/campaigns', token);
  const campaign = data && data.data && data.data[0];
  if (!campaign) throw new Error('No campaign found for this access token.');
  return campaign.id;
}

async function getAllMembers(campaignId, token) {
  const members = [];
  const included = [];
  let path =
    `/campaigns/${campaignId}/members` +
    `?include=currently_entitled_tiers,user` +
    `&fields.member=full_name,patron_status` +
    `&fields.tier=title` +
    `&page.size=200`;

  while (path) {
    const page = await patreonFetch(path, token);
    if (Array.isArray(page.data)) members.push(...page.data);
    if (Array.isArray(page.included)) included.push(...page.included);
    const next = page.links && page.links.next;
    // `next` is a full URL from Patreon; strip the base so patreonFetch's
    // base-URL prefix isn't duplicated.
    path = next ? next.replace(PATREON_API_BASE, '') : null;
  }

  return { members, included };
}

function buildTierMap(included) {
  const map = {};
  included.forEach((item) => {
    if (item.type === 'tier' && item.attributes && item.attributes.title) {
      map[item.id] = item.attributes.title;
    }
  });
  return map;
}

function buildUserNameMap(included) {
  const map = {};
  included.forEach((item) => {
    if (item.type === 'user' && item.attributes && item.attributes.full_name) {
      map[item.id] = item.attributes.full_name;
    }
  });
  return map;
}

function groupByTier(members, included) {
  const tierTitleById = buildTierMap(included);
  const userNameById = buildUserNameMap(included);
  const groups = {};

  members.forEach((member) => {
    const attrs = member.attributes || {};
    if (attrs.patron_status !== 'active_patron') return;

    const userRel = member.relationships && member.relationships.user;
    const userId = userRel && userRel.data && userRel.data.id;
    const name = (userId && userNameById[userId]) || attrs.full_name;
    if (!name) return;

    const tierRel = member.relationships && member.relationships.currently_entitled_tiers;
    const tierRefs = (tierRel && tierRel.data) || [];

    if (tierRefs.length === 0) {
      groups['Other supporters'] = groups['Other supporters'] || [];
      groups['Other supporters'].push(name);
      return;
    }

    tierRefs.forEach((ref) => {
      const title = tierTitleById[ref.id] || 'Other supporters';
      groups[title] = groups[title] || [];
      if (!groups[title].includes(name)) groups[title].push(name);
    });
  });

  Object.keys(groups).forEach((tier) => groups[tier].sort((a, b) => a.localeCompare(b)));
  return groups;
}

function orderedTiers(groups) {
  const ordered = {};
  KNOWN_TIER_ORDER.forEach((tier) => {
    ordered[tier] = groups[tier] || [];
  });
  Object.keys(groups).forEach((tier) => {
    if (!(tier in ordered)) ordered[tier] = groups[tier];
  });
  return ordered;
}

module.exports = async (req, res) => {
  const token = process.env.PATREON_ACCESS_TOKEN;

  if (!token) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({
      configured: false,
      tiers: orderedTiers({}),
      updatedAt: new Date().toISOString(),
    });
    return;
  }

  try {
    const campaignId = process.env.PATREON_CAMPAIGN_ID || (await getCampaignId(token));
    const { members, included } = await getAllMembers(campaignId, token);
    const tiers = orderedTiers(groupByTier(members, included));

    // Cache at the edge so we're not hitting Patreon's API on every
    // single page view — 1 hour is a reasonable balance between
    // freshness and staying well clear of rate limits.
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    res.status(200).json({
      configured: true,
      tiers,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({
      configured: true,
      error: 'Could not reach Patreon right now.',
      tiers: orderedTiers({}),
      updatedAt: new Date().toISOString(),
    });
  }
};
