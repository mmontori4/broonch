// ===== WHOOP INTEGRATION =====
// OAuth token management + data fetching via Cloudflare Worker proxy

const Whoop = {
  // Set this after deploying the worker
  WORKER_URL: '',

  // ===== TOKEN MANAGEMENT =====
  getTokens() {
    try {
      return JSON.parse(localStorage.getItem('whoop_tokens')) || null;
    } catch { return null; }
  },

  saveTokens(access, refresh, expiresIn) {
    const expiresAt = Date.now() + (expiresIn * 1000);
    localStorage.setItem('whoop_tokens', JSON.stringify({
      access, refresh, expiresAt,
    }));
  },

  clearTokens() {
    localStorage.removeItem('whoop_tokens');
  },

  isConnected() {
    return !!this.getTokens();
  },

  // Check URL hash for OAuth callback tokens (called on page load)
  checkCallback() {
    const hash = window.location.hash;
    if (!hash.includes('whoop_access')) return false;

    const params = new URLSearchParams(hash.substring(1));
    const access = params.get('whoop_access');
    const refresh = params.get('whoop_refresh');
    const expires = parseInt(params.get('whoop_expires')) || 3600;

    if (access) {
      this.saveTokens(access, refresh, expires);
      // Clean up URL
      history.replaceState(null, '', window.location.pathname + window.location.search);
      return true;
    }
    return false;
  },

  // ===== AUTH =====
  connect() {
    if (!this.WORKER_URL) {
      App.toast('Whoop proxy not configured');
      return;
    }
    window.location.href = this.WORKER_URL + '/auth';
  },

  disconnect() {
    this.clearTokens();
    this._cache = null;
    App.toast('Whoop disconnected');
  },

  // ===== DATA =====
  _cache: null,
  _cacheTime: 0,

  async fetchData() {
    if (!this.WORKER_URL || !this.isConnected()) return null;

    // Cache for 5 minutes
    if (this._cache && Date.now() - this._cacheTime < 300000) {
      return this._cache;
    }

    const tokens = this.getTokens();

    // Refresh if expired
    if (tokens.expiresAt < Date.now() + 60000) {
      const refreshed = await this._refresh(tokens.refresh);
      if (!refreshed) return null;
    }

    try {
      const t = this.getTokens();
      const resp = await fetch(`${this.WORKER_URL}/data?token=${encodeURIComponent(t.access)}`);

      if (resp.status === 401) {
        // Try refresh once
        const refreshed = await this._refresh(t.refresh);
        if (!refreshed) return null;
        const t2 = this.getTokens();
        const resp2 = await fetch(`${this.WORKER_URL}/data?token=${encodeURIComponent(t2.access)}`);
        if (!resp2.ok) return null;
        this._cache = await resp2.json();
      } else if (resp.ok) {
        this._cache = await resp.json();
      } else {
        return null;
      }

      this._cacheTime = Date.now();
      return this._cache;
    } catch (err) {
      console.warn('Whoop fetch failed:', err);
      return null;
    }
  },

  async _refresh(refreshToken) {
    if (!refreshToken) { this.clearTokens(); return false; }
    try {
      const resp = await fetch(`${this.WORKER_URL}/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      const data = await resp.json();
      if (data.access_token) {
        this.saveTokens(data.access_token, data.refresh_token || refreshToken, data.expires_in || 3600);
        return true;
      }
      this.clearTokens();
      return false;
    } catch {
      return false;
    }
  },

  // ===== HELPERS =====
  // Map recovery score (0-100) to energy rating (1-10)
  recoveryToEnergy(score) {
    if (score >= 80) return 9;
    if (score >= 67) return 8;
    if (score >= 50) return 6;
    if (score >= 34) return 4;
    return 2;
  },

  // Recovery color: green (67+), yellow (34-66), red (<34)
  recoveryColor(score) {
    if (score >= 67) return 'var(--green)';
    if (score >= 34) return 'var(--orange)';
    return 'var(--red)';
  },
};
