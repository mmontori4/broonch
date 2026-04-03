// ===== ROAD TO REUNIONS =====
// 7-week daily plan targeting Princeton Reunions May 21-24, 2026

const Reunions = {
  view: 'today',
  data: null,
  expandedDay: null,
  collapsedTiers: {},

  TARGET: new Date('2026-05-21T00:00:00'),
  START: new Date('2026-04-02T00:00:00'),

  PHASES: [
    { weeks: [1, 2], name: 'REBUILD', desc: 'Max effort upper via cables/machines. Zero heavy bracing.' },
    { weeks: [3, 4, 5], name: 'RAMP', desc: 'Add free weights, reintroduce legs, push volume.' },
    { weeks: [6, 7], name: 'PEAK', desc: 'Full intensity. Pump work. Arrive full, not flat.' },
  ],

  SPLIT: [
    {
      name: 'PUSH A', subtitle: 'Chest & Shoulders', muscles: 'Chest · Delts · Triceps', type: 'lifting',
      tiers: [
        { label: 'GO HARD', note: 'No core bracing needed. Max effort.', exercises: [
          { name: 'Machine Chest Press', sets: '4×8-10', note: 'Go heavy, the machine catches it' },
          { name: 'Cable Flyes (low-to-high)', sets: '4×12-15', note: 'Squeeze 1s at peak' },
          { name: 'Lateral Raises (cable)', sets: '4×12-15', note: 'Slight lean away, slow negative' },
          { name: 'Machine Shoulder Press', sets: '3×8-10', note: 'Push hard, controlled descent' },
          { name: 'Rope Pushdowns', sets: '3×12-15', note: 'Split at bottom, squeeze tris' },
        ]},
        { label: 'IF FEELING GOOD', note: 'Light bracing. Stop if any pelvic pressure.', exercises: [
          { name: 'Incline DB Press (30°)', sets: '3×10-12', note: 'Moderate weight, no straining' },
          { name: 'Overhead Tricep Extension (cable)', sets: '3×10-12', note: 'Standing, controlled' },
        ]},
        { label: 'WEEKS 3+', note: 'Reintroduce as healing allows.', exercises: [
          { name: 'Flat Barbell Bench', sets: '3×8-10', note: 'Moderate bracing okay by now' },
          { name: 'Dips (chest emphasis)', sets: '3×8-12', note: 'Forward lean, bodyweight first' },
        ]},
      ],
    },
    {
      name: 'PULL A', subtitle: 'Back Width & Biceps', muscles: 'Lats · Rear Delts · Biceps', type: 'lifting',
      tiers: [
        { label: 'GO HARD', note: 'All cable/machine. Send it.', exercises: [
          { name: 'Lat Pulldown (wide)', sets: '4×8-10', note: 'Full stretch, squeeze at bottom' },
          { name: 'Seated Cable Row', sets: '4×10-12', note: 'Squeeze shoulder blades' },
          { name: 'Face Pulls', sets: '4×15-20', note: 'External rotate at top. Posture gains.' },
          { name: 'Incline DB Curl', sets: '3×10-12', note: 'Full stretch at bottom' },
          { name: 'Hammer Curls (standing)', sets: '3×12-15', note: 'Brachialis = arm width' },
        ]},
        { label: 'IF FEELING GOOD', note: 'Slightly more core engagement.', exercises: [
          { name: 'Single-Arm Cable Row', sets: '3×10-12/arm', note: 'Standing, brace lightly' },
          { name: 'Straight-Arm Pulldown', sets: '3×12-15', note: 'Lat isolation, no core load' },
        ]},
        { label: 'WEEKS 3+', note: 'Free weight rows when ready.', exercises: [
          { name: 'Chest-Supported DB Row', sets: '3×10-12', note: 'Bench supports you — minimal core' },
          { name: 'Pull-ups / Assisted', sets: '3×AMRAP', note: 'Add weight when ready' },
        ]},
      ],
    },
    {
      name: 'ARMS & DELTS', subtitle: 'Vanity Day', muscles: 'Biceps · Triceps · All 3 Delt Heads', type: 'lifting',
      tiers: [
        { label: 'GO HARD', note: 'Pure isolation. Zero core. Absolute green light.', exercises: [
          { name: 'Cable Lateral Raise', sets: '4×12-15', note: 'Behind-body angle. Money exercise.' },
          { name: 'Rear Delt Fly (pec deck reverse)', sets: '4×15-20', note: 'Light, high rep, full squeeze' },
          { name: 'Cable Curl (bar)', sets: '4×10-12', note: 'Strict, no swing' },
          { name: 'Spider Curls (incline bench)', sets: '3×12-15', note: 'Peak contraction focus' },
          { name: 'Overhead Cable Extension', sets: '4×10-12', note: 'Long head stretch' },
          { name: 'Reverse Grip Pushdown', sets: '3×12-15', note: 'Medial head, arm detail' },
        ]},
        { label: 'IF FEELING GOOD', note: 'More volume. Still zero core.', exercises: [
          { name: 'Machine Lateral Raise', sets: '3×12-15', note: 'If gym has one — great isolation' },
          { name: 'Concentration Curl', sets: '2×12-15', note: 'Peak squeeze' },
          { name: 'Reverse Curl (EZ bar)', sets: '2×12-15', note: 'Forearm pop' },
        ]},
      ],
    },
    {
      name: 'PUSH B', subtitle: 'Shoulder Emphasis', muscles: 'Delts · Chest · Triceps', type: 'lifting',
      tiers: [
        { label: 'GO HARD', note: 'Shoulders are #1 aesthetics muscle. Hammer them.', exercises: [
          { name: 'Machine Shoulder Press', sets: '4×8-10', note: 'Go heavy here' },
          { name: 'Cable Lateral Raise', sets: '5×12-15', note: '5 sets. This is the move.' },
          { name: 'Cable Chest Fly (mid-height)', sets: '4×12-15', note: 'Constant tension' },
          { name: 'Tricep Dip Machine', sets: '3×10-12', note: 'If available, otherwise pushdowns' },
          { name: 'Front Raise (cable)', sets: '3×12-15', note: 'Anterior delt cap' },
        ]},
        { label: 'IF FEELING GOOD', note: 'Add pressing volume.', exercises: [
          { name: 'Seated DB Shoulder Press', sets: '3×10-12', note: 'Light brace, supported back' },
          { name: 'Pec Deck', sets: '3×12-15', note: 'Inner chest squeeze' },
        ]},
        { label: 'WEEKS 3+', note: 'Free weight pressing.', exercises: [
          { name: 'Standing OHP (barbell)', sets: '3×6-8', note: 'Only when bracing feels normal' },
        ]},
      ],
    },
    {
      name: 'PULL B', subtitle: 'Back Thickness & Arms', muscles: 'Rhomboids · Traps · Biceps · Forearms', type: 'lifting',
      tiers: [
        { label: 'GO HARD', note: 'Machine/cable pulling. Full send.', exercises: [
          { name: 'Lat Pulldown (close/neutral)', sets: '4×10-12', note: 'Lean back slightly' },
          { name: 'Machine Row (chest supported)', sets: '4×10-12', note: 'Squeeze at contraction' },
          { name: 'Cable Shrug', sets: '3×12-15', note: 'Trap thickness, hold at top' },
          { name: 'Barbell Curl (standing)', sets: '4×8-10', note: 'Strict form, no swing' },
          { name: 'Hammer Curl (rope cable)', sets: '3×12-15', note: 'Constant tension variant' },
        ]},
        { label: 'IF FEELING GOOD', note: 'Add volume and detail work.', exercises: [
          { name: 'Straight-Arm Pulldown', sets: '3×12-15', note: 'Lat sweep' },
          { name: 'Reverse Curl', sets: '2×12-15', note: 'Forearm pop' },
        ]},
        { label: 'WEEKS 3+', note: 'Heavier free weight pulling.', exercises: [
          { name: 'Chest-Supported T-Bar Row', sets: '3×8-10', note: 'Bench takes the load' },
          { name: 'Weighted Pull-ups', sets: '3×6-8', note: 'When core is solid' },
        ]},
      ],
    },
    {
      name: 'PUMP + CARDIO', subtitle: 'Conditioning & Weak Points', muscles: 'Full Body Pump · Fat Burn', type: 'conditioning',
      tiers: [
        { label: 'GO HARD', note: 'Walking is king for recovery + fat loss. Pump work is all cables.', exercises: [
          { name: 'Incline Walk (treadmill)', sets: '25-30 min', note: '12-15% incline, 3.0-3.5 mph' },
          { name: 'Cable Lateral Raise', sets: '3×20', note: 'Light, chase the burn' },
          { name: 'Cable Curl', sets: '3×20', note: 'Light, constant tension' },
          { name: 'Pushdowns', sets: '3×20', note: 'Light, blood flow' },
          { name: 'Face Pulls', sets: '3×20', note: 'Posture + rear delt pump' },
        ]},
        { label: 'IF FEELING GOOD', note: 'More conditioning if energy is there.', exercises: [
          { name: 'Pushup Variations', sets: '3×AMRAP', note: 'Diamond → standard → wide' },
          { name: 'Standing Cable Crunch', sets: '3×15', note: 'Core without pelvic floor load' },
        ]},
        { label: 'WEEKS 3+', note: 'Leg work as tolerated.', exercises: [
          { name: 'Leg Extension', sets: '3×12-15', note: 'Quad pump, no pelvic pressure' },
          { name: 'Leg Curl (lying)', sets: '3×12-15', note: 'Hamstrings, pad position permitting' },
          { name: 'Standing Calf Raise', sets: '3×15-20', note: 'No core load' },
        ]},
      ],
    },
    {
      name: 'REST', subtitle: 'Active Recovery', muscles: 'Recovery · Mobility · Healing', type: 'recovery',
      tiers: [
        { label: 'DO THIS', note: 'Non-negotiable recovery work.', exercises: [
          { name: 'Walk (outside)', sets: '30-45 min', note: 'Zone 2. Circulation aids healing.' },
          { name: 'Upper Body Stretching', sets: '10 min', note: 'Chest doorway stretch, shoulder CARs' },
          { name: 'Foam Roll (upper back)', sets: '5 min', note: 'Thoracic extension' },
        ]},
      ],
    },
  ],

  TIER_CLASS: {
    'GO HARD': 'tier-go',
    'DO THIS': 'tier-go',
    'IF FEELING GOOD': 'tier-caution',
    'WEEKS 3+': 'tier-unlock',
  },

  // ===== STORAGE =====
  _load() {
    try {
      this.data = JSON.parse(localStorage.getItem('reunions_data')) || { completedDays: [], checkins: [], workoutLog: [] };
      if (!this.data.workoutLog) this.data.workoutLog = [];
    } catch { this.data = { completedDays: [], checkins: [], workoutLog: [] }; }
  },

  _save() {
    localStorage.setItem('reunions_data', JSON.stringify(this.data));
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

    // Tiers
    workout.tiers.forEach((tier, ti) => {
      const key = `today-${ti}`;
      const open = this.collapsedTiers[key] !== true;
      const cls = this.TIER_CLASS[tier.label] || 'tier-go';

      html += `
        <button class="r-tier-header ${cls}" onclick="Reunions.toggleTier('${key}')">
          <div class="r-tier-info">
            <span class="r-tier-label">${tier.label}</span>
            <span class="r-tier-note">${tier.note}</span>
          </div>
          <span class="r-tier-arrow">${open ? '▾' : '▸'}</span>
        </button>
      `;

      if (open) {
        tier.exercises.forEach(ex => {
          html += `
            <div class="r-exercise ${cls}">
              <div class="r-ex-top">
                <span class="r-ex-name">${ex.name}</span>
                <span class="r-ex-sets">${ex.sets}</span>
              </div>
              <div class="r-ex-note">${ex.note}</div>
            </div>
          `;
        });
      }
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

    let html = `
      <div class="r-plan-legend">
        <span class="tier-go">● Go hard</span>
        <span class="tier-caution">● If feeling good</span>
        <span class="tier-unlock">● Weeks 3+</span>
      </div>
    `;

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
        day.tiers.forEach(tier => {
          const cls = this.TIER_CLASS[tier.label] || 'tier-go';
          html += `<div class="r-plan-tier-label ${cls}">${tier.label}</div>`;
          tier.exercises.forEach(ex => {
            html += `
              <div class="r-plan-ex ${cls}">
                <span class="r-plan-ex-name">${ex.name}</span>
                <span class="r-plan-ex-sets">${ex.sets}</span>
              </div>
            `;
          });
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

    el.innerHTML = html;
  },

  // ===== CHECK-IN =====
  _renderCheckin(el, week) {
    let html = `
      <div class="r-checkin-intro">
        <div class="r-section-title">WEEKLY CHECK-IN</div>
        <p>Same conditions each week: morning, post-bathroom, pre-food.</p>
      </div>
      <div class="r-checkin-form">
        <label class="r-field-label">WEIGHT (LBS)</label>
        <input type="number" inputmode="decimal" id="ci-weight" placeholder="0">

        <label class="r-field-label">WAIST (INCHES)</label>
        <input type="number" inputmode="decimal" id="ci-waist" placeholder="0" step="0.25">

        <label class="r-field-label">SHOULDERS (INCHES)</label>
        <input type="number" inputmode="decimal" id="ci-shoulders" placeholder="0" step="0.25">

        <label class="r-field-label">ENERGY (1-10)</label>
        <input type="number" inputmode="numeric" id="ci-energy" placeholder="0" min="1" max="10">

        <label class="r-field-label">HEALING COMFORT (1-10)</label>
        <input type="number" inputmode="numeric" id="ci-healing" placeholder="0" min="1" max="10">

        <label class="r-field-label">NOTES / WHAT TO ADJUST</label>
        <textarea id="ci-notes" placeholder="..."></textarea>

        <button class="r-submit-btn" onclick="Reunions.submitCheckin(${week})">LOG CHECK-IN</button>
      </div>

      <div class="r-iteration-rules">
        <div class="r-section-title">ITERATION RULES</div>
        <p><strong>Waist ↓ + weight stable?</strong> Recomp working. Stay course.</p>
        <p><strong>Weight dropping >2 lbs/wk?</strong> Add 200 cal.</p>
        <p><strong>Nothing moving?</strong> Cut 200 cal or add 10 min walking.</p>
        <p><strong>V-taper ratio?</strong> Shoulders÷waist. Target >1.45.</p>
        <p><strong>Healing comfort ↑?</strong> Unlock next tier.</p>
      </div>
    `;

    el.innerHTML = html;
  },

  // ===== LOG =====
  _renderLog(el) {
    const hasWorkouts = this.data.workoutLog.length > 0;
    const hasCheckins = this.data.checkins.length > 0;

    if (!hasWorkouts && !hasCheckins) {
      el.innerHTML = '<div class="r-empty">Nothing logged yet. Mark a workout complete or do a check-in.</div>';
      return;
    }

    let html = '';

    // Workout history
    if (hasWorkouts) {
      html += '<div class="r-section-title">WORKOUT HISTORY</div>';
      [...this.data.workoutLog].reverse().forEach(w => {
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
    if (this.isCompleted(d)) {
      this.data.completedDays = this.data.completedDays.filter(x => x !== d);
      this.data.workoutLog = this.data.workoutLog.filter(x => x.dayNum !== d);
    } else {
      this.data.completedDays.push(d);
      this.data.workoutLog.push({
        dayNum: d,
        date: new Date().toISOString(),
        name: workout.name,
        subtitle: workout.subtitle,
        muscles: workout.muscles,
        week: this.getWeek(d),
      });
    }
    this._save();
    this.render();
    App.toast(this.isCompleted(d) ? 'Workout logged!' : 'Unmarked');
  },

  toggleTier(key) {
    this.collapsedTiers[key] = !this.collapsedTiers[key];
    this.render();
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
    App.toast('Check-in logged!');
    this.view = 'log';
    this.render();
  },
};
