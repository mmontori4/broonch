// ===== ROAD TO REUNIONS =====
// 7-week daily plan targeting Princeton Reunions May 21-24, 2026

const Reunions = {
  view: 'today',
  data: null,
  expandedDay: null,

  TARGET: new Date('2026-05-21T00:00:00'),
  START: new Date('2026-04-06T00:00:00'),

  PHASES: [
    { weeks: [1, 2], name: 'REBUILD', rpe: '7-8', rpeCue: '2-3 reps left in the tank. Learning weights.', desc: 'Full upper body. Legs: machines only (extensions, curls, calves).' },
    { weeks: [3, 4, 5], name: 'RAMP', rpe: '8-9', rpeCue: '1-2 reps left. Pushing hard.', desc: 'Add compound legs (leg press). Push upper body weights up.' },
    { weeks: [6, 7], name: 'PEAK', rpe: '9-10', rpeCue: 'Last rep is a grind. Leave nothing.', desc: 'Full intensity. Heavy legs if cleared. Taper into Reunions.' },
  ],

  SPLIT: [
    {
      name: 'PUSH A', subtitle: 'Chest & Shoulders', muscles: 'Chest · Delts · Triceps', type: 'lifting',
      exercises: [
        { name: 'Barbell Bench Press', sets: '4×6-8', note: 'Controlled descent, drive through' },
        { name: 'Incline DB Press (30°)', sets: '3×10-12', note: 'Upper chest emphasis' },
        { name: 'Cable Flyes (low-to-high)', sets: '3×12-15', note: 'Squeeze 1s at peak' },
        { name: 'Machine Shoulder Press', sets: '3×8-10', note: 'Push hard, controlled descent' },
        { name: 'Cable Lateral Raise', sets: '4×12-15', note: 'Slight lean away, slow negative' },
        { name: 'Rope Pushdowns', sets: '3×12-15', note: 'Split at bottom, squeeze tris' },
      ],
    },
    {
      name: 'PULL A', subtitle: 'Back Width & Biceps', muscles: 'Lats · Rear Delts · Biceps · Hamstrings', type: 'lifting',
      exercises: [
        { name: 'Pull-ups (weighted if able)', sets: '4×6-10', note: 'Add weight when bodyweight is easy' },
        { name: 'Seated Cable Row', sets: '4×10-12', note: 'Squeeze shoulder blades' },
        { name: 'Lat Pulldown (wide)', sets: '3×10-12', note: 'Full stretch at top' },
        { name: 'Face Pulls', sets: '3×15-20', note: 'External rotate at top. Posture gains.' },
        { name: 'Incline DB Curl', sets: '3×10-12', note: 'Full stretch at bottom' },
        { name: 'Hammer Curls', sets: '3×12-15', note: 'Brachialis = arm width' },
        { name: 'Leg Curl (lying)', sets: '3×12-15', note: 'Hamstrings, zero core demand' },
        { name: 'Standing Calf Raise', sets: '3×15-20', note: 'Full stretch at bottom' },
      ],
    },
    {
      name: 'ARMS & DELTS', subtitle: 'Vanity Day', muscles: 'Biceps · Triceps · All 3 Delt Heads', type: 'lifting',
      exercises: [
        { name: 'Cable Lateral Raise', sets: '4×12-15', note: 'Behind-body angle. Money exercise.' },
        { name: 'Rear Delt Fly (pec deck reverse)', sets: '4×15-20', note: 'Light, high rep, full squeeze' },
        { name: 'Cable Curl (bar)', sets: '4×10-12', note: 'Strict, no swing' },
        { name: 'Spider Curls (incline bench)', sets: '3×12-15', note: 'Peak contraction focus' },
        { name: 'Overhead Cable Extension', sets: '4×10-12', note: 'Long head stretch' },
        { name: 'Reverse Grip Pushdown', sets: '3×12-15', note: 'Medial head, arm detail' },
        { name: 'Reverse Curl (EZ bar)', sets: '2×12-15', note: 'Forearm pop' },
      ],
    },
    {
      name: 'PUSH B', subtitle: 'Shoulder Focus', muscles: 'Delts · Chest · Triceps · Quads', type: 'lifting',
      exercises: [
        { name: 'Seated DB Shoulder Press', sets: '4×8-10', note: 'Supported back, go heavy' },
        { name: 'Cable Lateral Raise', sets: '5×12-15', note: '5 sets. This is the move.' },
        { name: 'Cable Chest Fly (mid-height)', sets: '4×12-15', note: 'Constant tension' },
        { name: 'Front Raise (cable)', sets: '3×12-15', note: 'Anterior delt cap' },
        { name: 'Dips (chest emphasis)', sets: '3×8-12', note: 'Forward lean' },
        { name: 'Rope Pushdowns', sets: '3×12-15', note: 'Squeeze tris' },
        { name: 'Leg Extension', sets: '3×12-15', note: 'Quad isolation, no pelvic load' },
      ],
    },
    {
      name: 'PULL B', subtitle: 'Back Thickness & Arms', muscles: 'Rhomboids · Traps · Biceps · Forearms', type: 'lifting',
      exercises: [
        { name: 'Chest-Supported T-Bar Row', sets: '4×8-10', note: 'Bench takes the load — go heavy' },
        { name: 'Lat Pulldown (close/neutral)', sets: '4×10-12', note: 'Lean back slightly' },
        { name: 'Chest-Supported DB Row', sets: '3×10-12', note: 'Unilateral, full squeeze' },
        { name: 'Cable Shrug', sets: '3×12-15', note: 'Hold at top, trap thickness' },
        { name: 'Barbell Curl', sets: '3×8-10', note: 'Strict form, no swing' },
        { name: 'Hammer Curl (rope cable)', sets: '3×12-15', note: 'Constant tension variant' },
      ],
    },
    {
      name: 'LEGS + PUMP', subtitle: 'Lower Body & Conditioning', muscles: 'Quads · Hamstrings · Calves · Full Pump', type: 'conditioning',
      exercises: [
        { name: 'Leg Extension', sets: '4×12-15', note: 'Quad isolation, no pelvic load' },
        { name: 'Leg Curl (lying)', sets: '4×12-15', note: 'Hamstrings, zero core demand' },
        { name: 'Leg Press', sets: '3×10-12', note: 'Introduce week 3+. Moderate depth.' },
        { name: 'Hack Squat', sets: '3×8-10', note: 'Week 5+ when cleared for heavy bracing' },
        { name: 'Standing Calf Raise', sets: '4×15-20', note: 'Full stretch at bottom' },
        { name: 'Incline Walk (treadmill)', sets: '20 min', note: '12-15% incline, 3.0-3.5 mph' },
        { name: 'Cable Lateral Raise', sets: '3×20', note: 'Light, chase the burn' },
        { name: 'Cable Curl', sets: '3×20', note: 'Light, constant tension' },
        { name: 'Pushdowns', sets: '3×20', note: 'Light, blood flow' },
      ],
    },
    {
      name: 'REST', subtitle: 'Active Recovery', muscles: 'Recovery · Mobility', type: 'recovery',
      exercises: [
        { name: 'Walk (outside)', sets: '30-45 min', note: 'Zone 2. Circulation aids healing.' },
        { name: 'Upper Body Stretching', sets: '10 min', note: 'Chest doorway stretch, shoulder CARs' },
        { name: 'Foam Roll (upper back)', sets: '5 min', note: 'Thoracic extension' },
      ],
    },
  ],

  // ===== HELPERS =====
  _parseSets(str) {
    const m = str.match(/^(\d+)\s*[×x]/i);
    return m ? parseInt(m[1]) : null;
  },

  _getLastLog(splitIdx) {
    if (!this.data.workoutLog) return null;
    const today = this.getDayNum();
    const logs = this.data.workoutLog
      .filter(w => w.dayNum !== today && w.dayNum % 7 === splitIdx && w.complete !== false && w.exercises && w.exercises.length)
      .sort((a, b) => b.dayNum - a.dayNum);
    return logs[0] || null;
  },

  _getTodayEntry() {
    if (!this.data.workoutLog) return null;
    const today = this.getDayNum();
    return this.data.workoutLog.find(w => w.dayNum === today) || null;
  },

  // ===== STORAGE =====
  _load() {
    try {
      this.data = JSON.parse(localStorage.getItem('reunions_data')) || { completedDays: [], checkins: [], workoutLog: [] };
      if (!this.data.workoutLog) this.data.workoutLog = [];
      if (!this.data.completedDays) this.data.completedDays = [];
      if (!this.data.checkins) this.data.checkins = [];
    } catch (e) {
      console.error('reunions _load failed', e);
      this.data = { completedDays: [], checkins: [], workoutLog: [] };
    }
  },

  _save() {
    try {
      localStorage.setItem('reunions_data', JSON.stringify(this.data));
    } catch (e) {
      console.error('reunions _save failed', e);
    }
  },

  // ===== LIVE WORKOUT STATE =====
  // workoutLog is the single source of truth. Every keystroke upserts today's
  // entry (complete:false until Mark Complete). No separate draft layer.
  _collectTodayInputs() {
    const exercises = [];
    document.querySelectorAll('.r-exercise[data-ex-name]').forEach(el => {
      const name = el.dataset.exName;
      const sets = [];
      el.querySelectorAll('.r-set-row').forEach(row => {
        const wEl = row.querySelector('.r-set-wt');
        const rEl = row.querySelector('.r-set-rp');
        sets.push({
          weight: wEl ? wEl.value : '',
          reps: rEl ? rEl.value : '',
        });
      });
      if (sets.length > 0) exercises.push({ name, sets });
    });
    return exercises;
  },

  _saveTodayInput() {
    const d = this.getDayNum();
    const workout = this.SPLIT[d % 7];
    const exercises = this._collectTodayInputs();
    if (!exercises.length) return;
    let entry = this._getTodayEntry();
    if (!entry) {
      entry = {
        dayNum: d,
        date: new Date().toISOString(),
        name: workout.name,
        subtitle: workout.subtitle,
        muscles: workout.muscles,
        week: this.getWeek(d),
        exercises: [],
        complete: false,
      };
      this.data.workoutLog.push(entry);
    }
    entry.exercises = exercises;
    this._save();
  },

  _saveCheckinDraft() {
    try {
      const week = this.getWeek(this.getDayNum());
      const entry = {
        week,
        weight: document.getElementById('ci-weight')?.value || '',
        waist: document.getElementById('ci-waist')?.value || '',
        shoulders: document.getElementById('ci-shoulders')?.value || '',
        energy: document.getElementById('ci-energy')?.value || '',
        healing: document.getElementById('ci-healing')?.value || '',
        notes: document.getElementById('ci-notes')?.value || '',
      };
      const hasData = entry.weight || entry.waist || entry.shoulders || entry.energy || entry.healing || entry.notes;
      if (!hasData) {
        localStorage.removeItem('reunions_draft_checkin');
        return;
      }
      localStorage.setItem('reunions_draft_checkin', JSON.stringify(entry));
    } catch (e) {
      console.error('reunions _saveCheckinDraft failed', e);
    }
  },

  _loadCheckinDraft() {
    try {
      const raw = localStorage.getItem('reunions_draft_checkin');
      if (!raw) return null;
      const d = JSON.parse(raw);
      if (d.week !== this.getWeek(this.getDayNum())) return null;
      return d;
    } catch { return null; }
  },

  _clearCheckinDraft() {
    try { localStorage.removeItem('reunions_draft_checkin'); } catch {}
  },

  // Flush any in-memory input state before page hide/unload.
  _flushLiveState() {
    if (this.view === 'today') this._saveTodayInput();
    else if (this.view === 'checkin') this._saveCheckinDraft();
  },

  // ===== COMPUTED =====
  getDayNum() {
    return Math.max(0, Math.floor((new Date() - this.START) / 86400000));
  },

  getDaysLeft() {
    return Math.max(0, Math.ceil((this.TARGET - new Date()) / 86400000));
  },

  getWeek(d) { return Math.min(7, Math.floor(d / 7) + 1); },

  getPhase(w) { return this.PHASES.find(p => p.weeks.includes(w)) || this.PHASES[0]; },

  isCompleted(d) { return this.data.completedDays.includes(d); },

  getCompletionRate(d) {
    if (d <= 0) return 0;
    return Math.round((this.data.completedDays.filter(x => x < d).length / d) * 100);
  },

  vtaper(ci) {
    if (ci.shoulders && ci.waist) return (ci.shoulders / ci.waist).toFixed(2);
    return null;
  },

  // ===== INIT =====
  init() {
    this._load();
    if (!this._listenersInstalled) {
      const flush = () => this._flushLiveState();
      window.addEventListener('beforeunload', flush);
      window.addEventListener('pagehide', flush);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') flush();
      });
      this._listenersInstalled = true;
    }
    this.render();
  },

  // ===== MAIN RENDER =====
  render() {
    const dayNum = this.getDayNum();
    const daysLeft = this.getDaysLeft();
    const week = this.getWeek(dayNum);
    const phase = this.getPhase(week);

    // Header
    document.getElementById('r-days-left').textContent = daysLeft;
    document.getElementById('r-week').textContent = `WK ${week}/7`;
    document.getElementById('r-phase').textContent = phase.name;
    document.getElementById('r-progress').style.width =
      Math.min(100, (dayNum / 49) * 100) + '%';

    // Tabs
    document.querySelectorAll('.r-tab').forEach(t =>
      t.classList.toggle('active', t.dataset.view === this.view)
    );

    // Body
    const body = document.getElementById('r-body');
    switch (this.view) {
      case 'today': this._renderToday(body, dayNum, week, phase); break;
      case 'plan': this._renderPlan(body, dayNum); break;
      case 'checkin': this._renderCheckin(body, week); break;
      case 'log': this._renderLog(body); break;
    }
  },

  setView(v) {
    this.view = v;
    this.render();
  },

  // ===== TODAY =====
  _renderToday(el, dayNum, week, phase) {
    const workout = this.SPLIT[dayNum % 7];
    const done = this.isCompleted(dayNum);

    let html = `
      <div class="r-today-card">
        <div class="r-today-top">
          <span class="r-day-label">DAY ${dayNum + 1}</span>
          <span class="r-status-pill ${done ? 'done' : ''}">${done ? 'DONE' : 'PENDING'}</span>
        </div>
        <div class="r-today-name">${workout.name}</div>
        <div class="r-today-sub">${workout.subtitle}</div>
        <div class="r-today-muscles">${workout.muscles}</div>
      </div>
    `;

    // RPE banner
    if (workout.type !== 'recovery') {
      html += `
        <div class="r-rpe-banner">
          <span class="r-rpe-val">RPE ${phase.rpe}</span>
          <span class="r-rpe-cue">${phase.rpeCue}</span>
        </div>
      `;
    }

    // Today's in-progress entry is the source of truth for current inputs.
    // Fallback: prefill from last completed session of the same split day.
    const lastLog = this._getLastLog(dayNum % 7);
    const prefillMap = {};
    if (lastLog && lastLog.exercises) {
      lastLog.exercises.forEach(e => { prefillMap[e.name] = e.sets; });
    }
    const todayEntry = this._getTodayEntry();
    const liveMap = {};
    if (todayEntry && todayEntry.exercises) {
      todayEntry.exercises.forEach(e => { liveMap[e.name] = e.sets; });
    }

    // Exercises — live entry wins over historical prefill when present
    workout.exercises.forEach(ex => {
      const numSets = this._parseSets(ex.sets);
      const prefillSets = liveMap[ex.name] || prefillMap[ex.name];

      html += `
        <div class="r-exercise" data-ex-name="${ex.name}">
          <div class="r-ex-top">
            <span class="r-ex-name">${ex.name}</span>
            <span class="r-ex-sets">${ex.sets}</span>
          </div>
          <div class="r-ex-note">${ex.note}</div>
      `;

      if (numSets) {
        html += '<div class="r-sets">';
        for (let s = 0; s < numSets; s++) {
          const pf = prefillSets && prefillSets[s];
          const wv = pf && pf.weight ? pf.weight : '';
          const rv = pf && pf.reps ? pf.reps : '';
          html += `
            <div class="r-set-row">
              <span class="r-set-num">${s + 1}</span>
              <div class="r-set-field">
                <input type="number" inputmode="decimal" class="r-set-wt" placeholder="—" value="${wv}" step="2.5" oninput="Reunions._saveTodayInput()" onchange="Reunions._saveTodayInput()" onblur="Reunions._saveTodayInput()">
                <span class="r-set-unit">lbs</span>
              </div>
              <div class="r-set-field">
                <input type="number" inputmode="numeric" class="r-set-rp" placeholder="—" value="${rv}" oninput="Reunions._saveTodayInput()" onchange="Reunions._saveTodayInput()" onblur="Reunions._saveTodayInput()">
                <span class="r-set-unit">reps</span>
              </div>
            </div>
          `;
        }
        html += '</div>';
      }

      html += '</div>';
    });

    // Mark complete button
    html += `
      <button class="r-complete-btn ${done ? 'done' : ''}" onclick="Reunions.toggleComplete()">
        ${done ? '✓ COMPLETED' : 'MARK COMPLETE'}
      </button>
    `;

    // Stats
    html += `
      <div class="r-stats">
        <div class="r-stat">
          <div class="r-stat-val">${this.getCompletionRate(dayNum)}%</div>
          <div class="r-stat-label">ADHERENCE</div>
        </div>
        <div class="r-stat">
          <div class="r-stat-val">${this.data.completedDays.length}</div>
          <div class="r-stat-label">SESSIONS</div>
        </div>
        <div class="r-stat">
          <div class="r-stat-val">${this.data.checkins.length}</div>
          <div class="r-stat-label">CHECK-INS</div>
        </div>
      </div>
    `;

    el.innerHTML = html;
  },

  // ===== PLAN =====
  _renderPlan(el, dayNum) {
    const todayIdx = dayNum % 7;
    const week = this.getWeek(dayNum);
    const currentPhase = this.getPhase(week);

    let html = '<div class="r-plan-phases">';
    this.PHASES.forEach(p => {
      const isCurrent = p === currentPhase;
      html += `
        <div class="r-phase-row ${isCurrent ? 'current' : ''}">
          <span class="phase-badge ${isCurrent ? 'current' : ''}">${p.name}</span>
          <span class="r-phase-desc">Wk ${p.weeks[0]}-${p.weeks[p.weeks.length - 1]} · RPE ${p.rpe} · ${p.desc}</span>
        </div>
      `;
    });
    html += '</div>';

    this.SPLIT.forEach((day, i) => {
      const isToday = i === todayIdx;
      const expanded = this.expandedDay === i;

      html += `
        <button class="r-plan-day ${isToday ? 'is-today' : ''}" onclick="Reunions.toggleDay(${i})">
          <div class="r-plan-day-info">
            <div class="r-plan-day-name">${isToday ? '▸ ' : ''}${day.name}</div>
            <div class="r-plan-day-muscles">${day.muscles}</div>
          </div>
          <span class="r-tier-arrow">${expanded ? '▾' : '▸'}</span>
        </button>
      `;

      if (expanded) {
        html += '<div class="r-plan-detail">';
        day.exercises.forEach(ex => {
          html += `
            <div class="r-plan-ex">
              <span class="r-plan-ex-name">${ex.name}</span>
              <span class="r-plan-ex-sets">${ex.sets}</span>
            </div>
          `;
        });
        html += '</div>';
      }
    });

    // Nutrition
    html += `
      <div class="r-nutrition">
        <div class="r-section-title">NUTRITION</div>
        <p><strong>Protein:</strong> 1g/lb minimum. Non-negotiable.</p>
        <p><strong>Calories:</strong> Slight deficit (200-300 below TDEE). Recomp zone.</p>
        <p><strong>Fiber:</strong> Extra important right now. 30g+ daily, plenty of water.</p>
        <p><strong>Creatine:</strong> 5g/day.</p>
      </div>
    `;

    // Legs recovery timeline
    html += `
      <div class="r-nutrition">
        <div class="r-section-title">LEGS RECOVERY TIMELINE</div>
        <p><strong>Weeks 1-2:</strong> Machines only — extensions, curls, calves. No heavy bracing.</p>
        <p><strong>Weeks 3-4:</strong> Add leg press, moderate compounds. Light-moderate bracing OK.</p>
        <p><strong>Weeks 5+:</strong> Hack squat, heavier compounds if wound is closed and pain-free.</p>
        <p><strong>Listen to the site:</strong> Any bleeding or pressure → drop the exercise, wait a week.</p>
      </div>
    `;

    el.innerHTML = html;
  },

  // ===== CHECK-IN =====
  _renderCheckin(el, week) {
    const draft = this._loadCheckinDraft() || {};
    const d = (k) => draft[k] || '';
    let html = `
      <div class="r-checkin-intro">
        <div class="r-section-title">WEEKLY CHECK-IN</div>
        <p>Same conditions each week: morning, post-bathroom, pre-food.</p>
      </div>
      <div class="r-checkin-form">
        <label class="r-field-label">WEIGHT (LBS)</label>
        <input type="number" inputmode="decimal" id="ci-weight" placeholder="0" value="${d('weight')}" oninput="Reunions._saveCheckinDraft()" onblur="Reunions._saveCheckinDraft()">

        <label class="r-field-label">WAIST (INCHES)</label>
        <input type="number" inputmode="decimal" id="ci-waist" placeholder="0" step="0.25" value="${d('waist')}" oninput="Reunions._saveCheckinDraft()" onblur="Reunions._saveCheckinDraft()">

        <label class="r-field-label">SHOULDERS (INCHES)</label>
        <input type="number" inputmode="decimal" id="ci-shoulders" placeholder="0" step="0.25" value="${d('shoulders')}" oninput="Reunions._saveCheckinDraft()" onblur="Reunions._saveCheckinDraft()">

        <label class="r-field-label">ENERGY (1-10)</label>
        <input type="number" inputmode="numeric" id="ci-energy" placeholder="0" min="1" max="10" value="${d('energy')}" oninput="Reunions._saveCheckinDraft()" onblur="Reunions._saveCheckinDraft()">

        <label class="r-field-label">HEALING COMFORT (1-10)</label>
        <input type="number" inputmode="numeric" id="ci-healing" placeholder="0" min="1" max="10" value="${d('healing')}" oninput="Reunions._saveCheckinDraft()" onblur="Reunions._saveCheckinDraft()">

        <label class="r-field-label">NOTES / WHAT TO ADJUST</label>
        <textarea id="ci-notes" placeholder="..." oninput="Reunions._saveCheckinDraft()" onblur="Reunions._saveCheckinDraft()">${d('notes')}</textarea>

        <button class="r-submit-btn" onclick="Reunions.submitCheckin(${week})">LOG CHECK-IN</button>
      </div>

      <div class="r-iteration-rules">
        <div class="r-section-title">ITERATION RULES</div>
        <p><strong>Waist ↓ + weight stable?</strong> Recomp working. Stay course.</p>
        <p><strong>Weight dropping >2 lbs/wk?</strong> Add 200 cal.</p>
        <p><strong>Nothing moving?</strong> Cut 200 cal or add 10 min walking.</p>
        <p><strong>V-taper ratio?</strong> Shoulders÷waist. Target >1.45.</p>
        <p><strong>Healing comfort ↑?</strong> Unlock next leg phase.</p>
      </div>
    `;

    el.innerHTML = html;
  },

  // ===== LOG =====
  _renderLog(el) {
    const completedWorkouts = this.data.workoutLog.filter(w => w.complete !== false);
    const hasWorkouts = completedWorkouts.length > 0;
    const hasCheckins = this.data.checkins.length > 0;

    if (!hasWorkouts && !hasCheckins) {
      el.innerHTML = '<div class="r-empty">Nothing logged yet. Mark a workout complete or do a check-in.</div>';
      return;
    }

    let html = '';

    // Workout history
    if (hasWorkouts) {
      html += '<div class="r-section-title">WORKOUT HISTORY</div>';
      [...completedWorkouts].reverse().forEach(w => {
        const d = new Date(w.date);
        const dayStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        html += `
          <div class="r-wlog-card">
            <div class="r-wlog-left">
              <div class="r-wlog-name">${w.name}</div>
              <div class="r-wlog-sub">${w.subtitle}</div>
            </div>
            <div class="r-wlog-right">
              <div class="r-wlog-date">${dayStr}</div>
              <div class="r-wlog-day">Day ${w.dayNum + 1} · Wk ${w.week}</div>
            </div>
          </div>
        `;
      });
    }

    // Check-in history
    if (hasCheckins) {
      html += `<div class="r-section-title" ${hasWorkouts ? 'style="margin-top:20px"' : ''}>CHECK-IN HISTORY</div>`;
      [...this.data.checkins].reverse().forEach(ci => {
        const vt = this.vtaper(ci);
        html += `
          <div class="r-log-card">
            <div class="r-log-top">
              <span class="phase-badge">WEEK ${ci.week}</span>
              <span class="r-log-date">${new Date(ci.date).toLocaleDateString()}</span>
            </div>
            <div class="r-log-metrics">
              ${ci.weight ? `<div class="r-log-metric"><div class="r-log-val">${ci.weight}</div><div class="r-log-label">LBS</div></div>` : ''}
              ${ci.waist ? `<div class="r-log-metric"><div class="r-log-val">${ci.waist}"</div><div class="r-log-label">WAIST</div></div>` : ''}
              ${ci.shoulders ? `<div class="r-log-metric"><div class="r-log-val">${ci.shoulders}"</div><div class="r-log-label">SHLDR</div></div>` : ''}
              ${vt ? `<div class="r-log-metric"><div class="r-log-val ${parseFloat(vt) >= 1.45 ? 'hit-target' : ''}">${vt}</div><div class="r-log-label">V-TAPER</div></div>` : ''}
              ${ci.energy ? `<div class="r-log-metric"><div class="r-log-val">${ci.energy}/10</div><div class="r-log-label">ENERGY</div></div>` : ''}
              ${ci.healing ? `<div class="r-log-metric"><div class="r-log-val">${ci.healing}/10</div><div class="r-log-label">HEALING</div></div>` : ''}
            </div>
            ${ci.notes ? `<div class="r-log-notes">${ci.notes}</div>` : ''}
          </div>
        `;
      });
    }

    el.innerHTML = html;
  },

  // ===== ACTIONS =====
  toggleComplete() {
    const d = this.getDayNum();
    const workout = this.SPLIT[d % 7];
    // Capture any pending input first so Mark Complete never drops a keystroke.
    this._saveTodayInput();

    let entry = this._getTodayEntry();
    if (entry && entry.complete) {
      // Un-complete: keep the numbers, just flip the flag.
      entry.complete = false;
      this.data.completedDays = this.data.completedDays.filter(x => x !== d);
    } else {
      if (!entry) {
        entry = {
          dayNum: d,
          date: new Date().toISOString(),
          name: workout.name,
          subtitle: workout.subtitle,
          muscles: workout.muscles,
          week: this.getWeek(d),
          exercises: [],
          complete: false,
        };
        this.data.workoutLog.push(entry);
      }
      entry.exercises = this._collectTodayInputs();
      entry.complete = true;
      entry.date = new Date().toISOString();
      if (!this.data.completedDays.includes(d)) this.data.completedDays.push(d);
    }
    this._save();
    this.render();
    App.toast(this.isCompleted(d) ? 'Workout logged!' : 'Unmarked');
  },

  toggleDay(i) {
    this.expandedDay = this.expandedDay === i ? null : i;
    this.render();
  },

  submitCheckin(week) {
    const entry = {
      week,
      date: new Date().toISOString(),
      weight: parseFloat(document.getElementById('ci-weight').value) || null,
      waist: parseFloat(document.getElementById('ci-waist').value) || null,
      shoulders: parseFloat(document.getElementById('ci-shoulders').value) || null,
      energy: parseInt(document.getElementById('ci-energy').value) || null,
      healing: parseInt(document.getElementById('ci-healing').value) || null,
      notes: document.getElementById('ci-notes').value.trim() || null,
    };
    this.data.checkins.push(entry);
    this._save();
    this._clearCheckinDraft();
    App.toast('Check-in logged!');
    this.view = 'log';
    this.render();
  },
};
