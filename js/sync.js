// ===== GOOGLE SHEETS SYNC =====
// Write-through cache: localStorage stays primary, Sheets is the remote backup.
// Reads are always synchronous from localStorage.
// Writes go to both localStorage (via Store) and Sheets (fire-and-forget).
// On boot + screen navigations, pull fresh data from Sheets and merge into localStorage.

const APPS_SCRIPT_URL = 'PASTE_DEPLOYMENT_URL_HERE';

const Sync = {
  _queue: [],

  init() {
    this._queue = JSON.parse(localStorage.getItem('broonch_sync_queue') || '[]');
    this._drainQueue();
    window.addEventListener('online', () => this._drainQueue());

    // One-time migration: push any existing localStorage data to Sheets
    if (!localStorage.getItem('broonch_migrated')) {
      for (const user of ['huels', 'manoot']) {
        const entries = JSON.parse(localStorage.getItem(`broonch_${user}_workouts`) || '[]');
        if (entries.length > 0) {
          this._post({ action: 'syncBatch', entries });
        }
        const bal = parseFloat(localStorage.getItem(`broonch_${user}_wallet`)) || 0;
        if (bal > 0) {
          this._post({ action: 'setWallet', user, balance: bal });
        }
      }
      localStorage.setItem('broonch_migrated', '1');
    }
  },

  // Push a workout entry to remote
  pushWorkout(entry) {
    this._post({ action: 'saveWorkout', entry }).catch(() => {
      this._enqueue(entry);
    });
  },

  // Push wallet balance to remote
  pushWallet(user, balance) {
    this._post({ action: 'setWallet', user, balance }).catch(() => {});
  },

  // Pull all workouts for a user, merge into localStorage
  async pull(user) {
    if (!navigator.onLine) return;
    try {
      const resp = await fetch(APPS_SCRIPT_URL + '?action=getWorkouts&user=' + encodeURIComponent(user));
      const data = await resp.json();
      if (!data.ok || !data.entries) return;

      const local = JSON.parse(localStorage.getItem(`broonch_${user}_workouts`) || '[]');
      const merged = [...local];

      for (const remote of data.entries) {
        const idx = merged.findIndex(e =>
          e.workoutId === remote.workoutId && e.week === remote.week
        );
        if (idx >= 0) {
          merged[idx] = remote;
        } else {
          merged.push(remote);
        }
      }
      localStorage.setItem(`broonch_${user}_workouts`, JSON.stringify(merged));
    } catch (err) {
      console.warn('Sync pull failed:', err);
    }
  },

  // Pull wallet balances for both users from remote
  async pullWallet() {
    if (!navigator.onLine) return;
    try {
      const resp = await fetch(APPS_SCRIPT_URL + '?action=getWallet');
      const data = await resp.json();
      if (!data.ok || !data.data) return;
      for (const [user, balance] of Object.entries(data.data)) {
        localStorage.setItem(`broonch_${user}_wallet`, balance.toString());
      }
    } catch (err) {
      console.warn('Sync pullWallet failed:', err);
    }
  },

  // --- internals ---

  _enqueue(entry) {
    this._queue.push(entry);
    localStorage.setItem('broonch_sync_queue', JSON.stringify(this._queue));
  },

  async _drainQueue() {
    if (this._queue.length === 0 || !navigator.onLine) return;
    const batch = [...this._queue];
    this._queue = [];
    localStorage.setItem('broonch_sync_queue', '[]');
    try {
      await this._post({ action: 'syncBatch', entries: batch });
    } catch {
      this._queue = batch.concat(this._queue);
      localStorage.setItem('broonch_sync_queue', JSON.stringify(this._queue));
    }
  },

  _post(body) {
    if (!navigator.onLine) return Promise.reject('offline');
    return fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(body)
    });
  }
};
