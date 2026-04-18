// ===== APP ROUTING & NAVIGATION =====

const App = {
  currentWeek: 1,

  init() {
    document.body.dataset.screen = 'profile';
    Sync.init();
    const user = Store.getUser();
    if (user) {
      this.currentWeek = Store.getCurrentWeek();
      this._enterDashboard(user);
      // Background sync
      Sync.pull(user).catch(() => {});
    }
    // else: profile screen is already active
  },

  selectProfile(user) {
    Store.setUser(user);
    this.currentWeek = Store.getCurrentWeek();
    this._enterDashboard(user);
  },

  switchUser() {
    Store.clearUser();
    this.showScreen('profile');
  },

  _enterDashboard(user) {
    this.showScreen('dashboard');
  },

  changeWeek(delta) {
    this.currentWeek = Math.max(1, Math.min(12, this.currentWeek + delta));
    this._renderWeek();
  },

  _renderWeek() {
    const week = this.currentWeek;
    document.getElementById('week-label').textContent = `Week ${week}`;

    const phase = getPhase(week);
    const phaseBadge = document.getElementById('phase-label');
    phaseBadge.textContent = phase.name;

    // Progress bar
    document.getElementById('week-progress-bar').style.width = `${(week / 12) * 100}%`;

    // Workout cards
    const grid = document.getElementById('workout-grid');
    grid.innerHTML = '';

    for (const wid of WORKOUT_ORDER) {
      const w = WORKOUTS[wid];
      const logged = Store.isLogged(wid, week);

      const typeClass = w.type === 'cardio' ? 'cardio' :
                        w.type === 'recovery' ? 'recovery' : 'lifting';

      const card = document.createElement('button');
      card.className = 'workout-card' + (logged ? ' logged' : '');
      card.onclick = () => Tracker.open(wid, week);

      card.innerHTML = `
        <div class="wc-type ${typeClass}">
          <span class="wc-type-label">${w.shortName}</span>
        </div>
        <div class="wc-info">
          <div class="wc-name">${w.name}</div>
          <div class="wc-meta">${w.duration} \u00b7 ${w.location === 'gym' ? "Gold's" : 'Home'}</div>
        </div>
        <div class="wc-check ${logged ? 'done' : ''}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
      `;

      grid.appendChild(card);
    }
  },

  showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`screen-${name}`).classList.add('active');
    document.body.dataset.screen = name;

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.screen === name);
    });

    if (name !== 'dashboard' && name !== 'tracker') {
      Stopwatch.hide();
    }

    // Refresh data when showing certain screens
    if (name === 'dashboard') {
      Reunions.init();
    } else if (name === 'wallet') {
      Wallet.init();
    } else if (name === 'trends') {
      Trends.init();
    }
  },

  toast(msg) {
    let t = document.querySelector('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
  }
};

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
