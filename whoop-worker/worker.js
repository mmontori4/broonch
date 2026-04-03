// Whoop OAuth + API proxy for broonch gym PWA
// Deploy: npx wrangler deploy
// Secrets: npx wrangler secret put WHOOP_CLIENT_ID
//          npx wrangler secret put WHOOP_CLIENT_SECRET

const WHOOP_AUTH = 'https://api.prod.whoop.com/oauth/oauth2/auth';
const WHOOP_TOKEN = 'https://api.prod.whoop.com/oauth/oauth2/token';
const WHOOP_API = 'https://api.prod.whoop.com';
const SCOPES = 'read:recovery read:cycles read:sleep read:workout offline';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }

    try {
      if (path === '/auth') return this.auth(url, env);
      if (path === '/callback') return this.callback(url, env);
      if (path === '/refresh') return this.refresh(request, env);
      if (path === '/data') return this.data(url);
      return json({ error: 'not found' }, 404);
    } catch (err) {
      return json({ error: err.message }, 500);
    }
  },

  // Step 1: redirect user to Whoop login
  auth(url, env) {
    const params = new URLSearchParams({
      client_id: env.WHOOP_CLIENT_ID,
      redirect_uri: `${url.origin}/callback`,
      response_type: 'code',
      scope: SCOPES,
      state: crypto.randomUUID(),
    });
    return Response.redirect(`${WHOOP_AUTH}?${params}`, 302);
  },

  // Step 2: exchange code for tokens, redirect back to PWA
  async callback(url, env) {
    const code = url.searchParams.get('code');
    if (!code) return json({ error: 'missing code' }, 400);

    const resp = await fetch(WHOOP_TOKEN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: env.WHOOP_CLIENT_ID,
        client_secret: env.WHOOP_CLIENT_SECRET,
        redirect_uri: `${url.origin}/callback`,
      }),
    });

    const tokens = await resp.json();
    if (!tokens.access_token) {
      return json({ error: 'auth_failed', detail: tokens }, 400);
    }

    // Redirect to PWA with tokens in hash fragment (never sent to server)
    const pwa = env.PWA_URL || 'https://mmontori4.github.io/broonch/';
    const frag = new URLSearchParams({
      whoop_access: tokens.access_token,
      whoop_refresh: tokens.refresh_token,
      whoop_expires: tokens.expires_in,
    });
    return Response.redirect(`${pwa}#${frag}`, 302);
  },

  // Refresh expired access token
  async refresh(request, env) {
    const { refresh_token } = await request.json();
    if (!refresh_token) return json({ error: 'missing refresh_token' }, 400);

    const resp = await fetch(WHOOP_TOKEN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
        client_id: env.WHOOP_CLIENT_ID,
        client_secret: env.WHOOP_CLIENT_SECRET,
      }),
    });

    return json(await resp.json(), resp.ok ? 200 : 400);
  },

  // Fetch today's recovery, cycle (strain), and sleep from Whoop
  async data(url) {
    const token = url.searchParams.get('token');
    if (!token) return json({ error: 'missing token' }, 401);

    const headers = { Authorization: `Bearer ${token}` };

    const [cycleResp, recoveryResp, sleepResp] = await Promise.all([
      fetch(`${WHOOP_API}/v2/users/me/cycles?limit=1`, { headers }),
      fetch(`${WHOOP_API}/v2/users/me/recovery?limit=1`, { headers }),
      fetch(`${WHOOP_API}/v2/users/me/sleep?limit=1`, { headers }),
    ]);

    // If any returns 401, token is expired
    if (cycleResp.status === 401 || recoveryResp.status === 401) {
      return json({ error: 'token_expired' }, 401);
    }

    const [cycleData, recoveryData, sleepData] = await Promise.all([
      cycleResp.json(), recoveryResp.json(), sleepResp.json(),
    ]);

    const cycle = cycleData.records?.[0];
    const recovery = recoveryData.records?.[0];
    const sleep = sleepData.records?.[0];

    return json({
      ok: true,
      recovery: recovery?.score_state === 'SCORED' ? {
        score: recovery.score.recovery_score,
        restingHR: recovery.score.resting_heart_rate,
        hrv: Math.round(recovery.score.heart_rate_variability_rmssd * 10) / 10,
        spo2: recovery.score.blood_oxygen,
      } : null,
      strain: cycle?.score_state === 'SCORED' ? {
        score: Math.round(cycle.score.strain * 10) / 10,
        avgHR: cycle.score.average_heart_rate,
        maxHR: cycle.score.max_heart_rate,
        cal: Math.round(cycle.score.kilojoule / 4.184),
      } : null,
      sleep: sleep?.score_state === 'SCORED' ? {
        hours: Math.round(sleep.score.sleep_duration_ms / 3600000 * 10) / 10,
        quality: sleep.score.quality_percentage,
      } : null,
    });
  },
};
