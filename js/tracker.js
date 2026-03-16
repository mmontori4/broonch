// ===== STOPWATCH =====
const Stopwatch = {
  _interval: null,
  _startTime: null,
  _elapsed: 0,
  _running: false,

  show() {
    document.getElementById('stopwatch-bar').classList.remove('hidden');
    this.reset();
  },

  hide() {
    document.getElementById('stopwatch-bar').classList.add('hidden');
    this.stop();
  },

  toggle() {
    if (this._running) this.pause(); else this.start();
  },

  start() {
    this._running = true;
    this._startTime = Date.now() - this._elapsed;
    this._interval = setInterval(() => this._updateDisplay(), 100);
    document.getElementById('sw-toggle').textContent = '\u23F8';
    document.getElementById('stopwatch-bar').classList.add('running');
  },

  pause() {
    this._running = false;
    this._elapsed = Date.now() - this._startTime;
    clearInterval(this._interval);
    document.getElementById('sw-toggle').textContent = '\u25B6';
    document.getElementById('stopwatch-bar').classList.remove('running');
  },

  stop() {
    this.pause();
    this._elapsed = 0;
    this._updateDisplay();
  },

  reset() {
    this.pause();
    this._elapsed = 0;
    this._updateDisplay();
  },

  _updateDisplay() {
    if (this._running) {
      this._elapsed = Date.now() - this._startTime;
    }
    const totalSec = Math.floor(this._elapsed / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    document.getElementById('sw-time').textContent =
      `${min}:${sec.toString().padStart(2, '0')}`;
  }
};

// ===== WORKOUT TRACKER =====
// Dynamic form generation for lifting, supersets, cardio, and recovery

const Tracker = {
  currentWorkout: null,
  currentWeek: 1,

  open(workoutId, week) {
    this.currentWorkout = WORKOUTS[workoutId];
    this.currentWeek = week;
    const w = this.currentWorkout;

    document.getElementById('tracker-title').textContent = w.name;
    document.getElementById('tracker-subtitle').textContent =
      `${w.duration} \u00b7 ${w.location === 'gym' ? "Gold's Gym" : 'Home'}`;

    const body = document.getElementById('tracker-body');
    body.innerHTML = '';

    // Phase banner
    const phase = getPhase(week);
    const banner = document.createElement('div');
    banner.className = 'phase-banner';
    banner.innerHTML = `<strong>Week ${week} \u2014 ${phase.name}</strong><br>${phase.desc}`;
    body.appendChild(banner);

    // Load existing entry or last entry for prefill
    const existing = Store.getWorkoutEntry(workoutId, week);
    const lastEntry = !existing ? Store.getLastEntry(workoutId) : null;

    if (w.type === 'lifting') {
      this._renderLifting(body, w, week, existing, lastEntry);
    } else if (w.type === 'supersets') {
      this._renderSupersets(body, w, week, existing, lastEntry);
    } else if (w.type === 'cardio') {
      this._renderCardio(body, w, existing, lastEntry);
    } else if (w.type === 'recovery') {
      this._renderRecovery(body, w, existing, lastEntry);
    }

    // Notes section
    const notes = document.createElement('div');
    notes.className = 'notes-section';
    notes.innerHTML = `
      <label for="workout-notes">Notes</label>
      <textarea id="workout-notes" placeholder="How did it feel?">${(existing && existing.notes) || ''}</textarea>
    `;
    body.appendChild(notes);

    // Reset save button
    const saveBtn = document.getElementById('save-btn');
    saveBtn.textContent = 'Save';
    saveBtn.classList.remove('saved');

    // Show stopwatch for lifting/superset workouts
    if (w.type === 'lifting' || w.type === 'supersets') {
      Stopwatch.show();
    } else {
      Stopwatch.hide();
    }

    App.showScreen('tracker');
  },

  _renderLifting(container, workout, week, existing, lastEntry) {
    for (const section of workout.sections) {
      const group = document.createElement('div');
      group.className = 'exercise-group';
      group.innerHTML = `<div class="exercise-group-title">${section.title}</div>`;

      for (const ex of section.exercises) {
        const adjusted = getPhaseSetAdjustment(week, ex);
        const block = this._createExerciseBlock(ex, adjusted, existing, lastEntry);
        group.appendChild(block);
      }
      container.appendChild(group);
    }
  },

  _renderSupersets(container, workout, week, existing, lastEntry) {
    for (const section of workout.sections) {
      const group = document.createElement('div');
      group.className = 'exercise-group';
      group.innerHTML = `<div class="exercise-group-title">${section.title}</div>`;

      if (section.supersets) {
        for (const ss of section.supersets) {
          const ssBlock = document.createElement('div');
          ssBlock.className = 'superset-block';
          ssBlock.innerHTML = `<div class="superset-label">${ss.label} \u00b7 Rest ${ss.rest}</div>`;

          for (const ex of ss.exercises) {
            const adjusted = getPhaseSetAdjustment(week, ex);
            const block = this._createExerciseBlock(ex, adjusted, existing, lastEntry);
            ssBlock.appendChild(block);
          }
          group.appendChild(ssBlock);
        }
      }

      if (section.exercises) {
        for (const ex of section.exercises) {
          const block = this._createExerciseBlock(ex, ex, existing, lastEntry);
          group.appendChild(block);
        }
      }

      container.appendChild(group);
    }
  },

  _createExerciseBlock(ex, adjusted, existing, lastEntry) {
    const block = document.createElement('div');
    block.className = 'exercise-block';
    block.dataset.exerciseId = ex.id;

    block.innerHTML = `
      <div class="exercise-name">${ex.name}</div>
      <div class="exercise-target">${adjusted.sets} sets \u00d7 ${ex.reps}${ex.rest ? ' \u00b7 Rest ' + ex.rest : ''}${ex.note ? ' \u00b7 ' + ex.note : ''}</div>
      <div class="sets-container"></div>
      <button class="add-set-btn" onclick="Tracker.addSet(this)">+ Add Set</button>
    `;

    const setsContainer = block.querySelector('.sets-container');

    // Find existing data for this exercise
    let prefillSets = null;
    if (existing && existing.exercises) {
      const exData = existing.exercises.find(e => e.exerciseId === ex.id);
      if (exData) prefillSets = exData.sets;
    }
    if (!prefillSets && lastEntry && lastEntry.exercises) {
      const exData = lastEntry.exercises.find(e => e.exerciseId === ex.id);
      if (exData) prefillSets = exData.sets;
    }

    const numSets = prefillSets ? Math.max(prefillSets.length, adjusted.sets) : adjusted.sets;
    for (let i = 0; i < numSets; i++) {
      const prefill = prefillSets && prefillSets[i];
      setsContainer.appendChild(this._createSetRow(i + 1, prefill, ex.reps === 'to failure'));
    }

    return block;
  },

  _createSetRow(num, prefill, isToFailure) {
    const row = document.createElement('div');
    row.className = 'set-row';

    const weightVal = prefill ? prefill.weight || '' : '';
    const repsVal = prefill ? prefill.reps || '' : '';

    row.innerHTML = `
      <span class="set-label">${num}</span>
      <div class="input-group">
        <input type="number" inputmode="decimal" class="set-weight" placeholder="\u2014" value="${weightVal}" step="2.5">
        <span class="input-label">lbs</span>
      </div>
      <div class="input-group">
        <input type="number" inputmode="numeric" class="set-reps" placeholder="${isToFailure ? 'max' : '\u2014'}" value="${repsVal}">
        <span class="input-label">reps</span>
      </div>
      <button class="remove-set-btn" onclick="Tracker.removeSet(this)">&times;</button>
    `;

    return row;
  },

  addSet(btn) {
    const container = btn.previousElementSibling;
    const num = container.children.length + 1;
    // Prefill from last set in this block
    const lastRow = container.lastElementChild;
    let prefill = null;
    if (lastRow) {
      const w = lastRow.querySelector('.set-weight').value;
      prefill = { weight: w, reps: '' };
    }
    container.appendChild(this._createSetRow(num, prefill, false));
  },

  removeSet(btn) {
    const row = btn.closest('.set-row');
    const container = row.parentElement;
    if (container.children.length > 1) {
      row.remove();
      // Renumber
      container.querySelectorAll('.set-label').forEach((lbl, i) => {
        lbl.textContent = i + 1;
      });
    }
  },

  _renderCardio(container, workout, existing, lastEntry) {
    const data = existing ? existing.cardio || {} : (lastEntry ? lastEntry.cardio || {} : {});
    const isHIIT = workout.cardioMode === 'hiit';

    const form = document.createElement('div');
    form.className = 'cardio-form';

    // Guidance box
    const guidanceHtml = workout.guidance ? `
      <div class="form-field guidance-box">
        <div class="guidance-text">${workout.guidance.general}</div>
        <div class="guidance-modality" id="guidance-modality"></div>
      </div>
    ` : '';

    // Modality buttons
    let modalityHtml = '';
    for (const mod of workout.modalities) {
      const sel = data.modality === mod ? 'selected' : '';
      modalityHtml += `<button class="modality-btn ${sel}" onclick="Tracker.selectCardioModality(this, '${mod}')">${mod}</button>`;
    }

    // Structure
    const structureHtml = `
      <div class="form-field">
        <label>Structure</label>
        <p style="font-size:0.85rem;color:var(--text2)">${workout.structure}</p>
      </div>
    `;

    form.innerHTML = `
      ${guidanceHtml}
      <div class="form-field">
        <label>Modality</label>
        <div class="modality-options" id="modality-options">${modalityHtml}</div>
      </div>
      ${structureHtml}
      <div class="form-field">
        <label for="cardio-duration">Duration (min)</label>
        <input type="number" inputmode="numeric" id="cardio-duration" placeholder="${isHIIT ? '45' : workout.duration.replace(' min', '')}" value="${data.duration || ''}">
      </div>
      <div class="form-field">
        <label for="cardio-hr">Avg Heart Rate (bpm)</label>
        <input type="number" inputmode="numeric" id="cardio-hr" placeholder="130" value="${data.avgHR || ''}">
      </div>
      <div class="form-field">
        <label>Target: ${workout.targetHR}</label>
      </div>
      <div id="pace-fields"></div>
    `;
    container.appendChild(form);

    // If modality already selected, render its pace fields
    if (data.modality) {
      this._renderPaceFields(data.modality, isHIIT, data);
      this._updateGuidance(data.modality, workout);
    }
  },

  selectCardioModality(btn, modality) {
    btn.closest('.modality-options').querySelectorAll('.modality-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    const workout = this.currentWorkout;
    const isHIIT = workout.cardioMode === 'hiit';

    // Load existing data for prefill
    const existing = Store.getWorkoutEntry(workout.id, this.currentWeek);
    const lastEntry = !existing ? Store.getLastEntry(workout.id) : null;
    const data = existing ? existing.cardio || {} : (lastEntry ? lastEntry.cardio || {} : {});

    this._renderPaceFields(modality, isHIIT, data);
    this._updateGuidance(modality, workout);
  },

  _updateGuidance(modality, workout) {
    const el = document.getElementById('guidance-modality');
    if (!el || !workout.guidance) return;
    const key = modality.toLowerCase();
    if (workout.guidance[key]) {
      el.textContent = workout.guidance[key];
      el.style.display = 'block';
    } else {
      el.textContent = '';
      el.style.display = 'none';
    }
  },

  _renderPaceFields(modality, isHIIT, data) {
    const container = document.getElementById('pace-fields');
    if (!container) return;
    container.innerHTML = '';

    const mod = modality.toLowerCase();

    if (mod === 'erg') {
      if (isHIIT) {
        container.innerHTML = `
          <div class="form-field">
            <label for="erg-interval-split">Interval Split (/500m)</label>
            <input type="text" inputmode="text" id="erg-interval-split" placeholder="1:50" value="${data.intervalSplit || ''}">
          </div>
          <div class="form-field">
            <label for="erg-recovery-split">Recovery Split (/500m)</label>
            <input type="text" inputmode="text" id="erg-recovery-split" placeholder="2:20" value="${data.recoverySplit || ''}">
          </div>
          <div class="form-field">
            <label for="erg-spm">Avg Stroke Rate (spm)</label>
            <input type="number" inputmode="numeric" id="erg-spm" placeholder="26" value="${data.spm || ''}">
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="form-field">
            <label for="erg-split">Avg Split (/500m)</label>
            <input type="text" inputmode="text" id="erg-split" placeholder="2:15" value="${data.split || ''}">
          </div>
          <div class="form-field">
            <label for="erg-spm">Avg Stroke Rate (spm)</label>
            <input type="number" inputmode="numeric" id="erg-spm" placeholder="20" value="${data.spm || ''}">
          </div>
        `;
      }
    } else if (mod === 'running') {
      if (isHIIT) {
        container.innerHTML = `
          <div class="form-field">
            <label for="run-interval-pace">Interval Pace (min/mile)</label>
            <input type="text" inputmode="text" id="run-interval-pace" placeholder="7:30" value="${data.intervalPace || ''}">
          </div>
          <div class="form-field">
            <label for="run-recovery-pace">Recovery Pace (min/mile)</label>
            <input type="text" inputmode="text" id="run-recovery-pace" placeholder="10:00" value="${data.recoveryPace || ''}">
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="form-field">
            <label for="run-pace">Avg Pace (min/mile)</label>
            <input type="text" inputmode="text" id="run-pace" placeholder="9:30" value="${data.pace || ''}">
          </div>
        `;
      }
    }
    // Skiing/Other: no extra pace fields, just HR + duration
  },

  selectModality(btn, modality) {
    btn.closest('.modality-options').querySelectorAll('.modality-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  },

  _renderRecovery(container, workout, existing, lastEntry) {
    const data = existing ? existing.recovery || {} : (lastEntry ? lastEntry.recovery || {} : {});

    const form = document.createElement('div');
    form.className = 'cardio-form';

    let optionsHtml = '';
    for (const opt of workout.options) {
      const sel = data.activity === opt ? 'selected' : '';
      optionsHtml += `<button class="modality-btn ${sel}" onclick="Tracker.selectModality(this, '${opt}')">${opt}</button>`;
    }

    form.innerHTML = `
      <div class="form-field">
        <label>Activity</label>
        <div class="modality-options" id="modality-options">${optionsHtml}</div>
      </div>
      <div class="form-field">
        <label for="recovery-duration">Duration (min)</label>
        <input type="number" inputmode="numeric" id="recovery-duration" placeholder="20" value="${data.duration || ''}">
      </div>
    `;
    container.appendChild(form);
  },

  // ===== SAVE =====
  save() {
    const w = this.currentWorkout;
    const entry = {
      date: new Date().toISOString().split('T')[0],
      user: Store.getUser(),
      workoutId: w.id,
      week: this.currentWeek,
      notes: document.getElementById('workout-notes').value.trim()
    };

    if (w.type === 'lifting' || w.type === 'supersets') {
      entry.exercises = [];
      document.querySelectorAll('.exercise-block').forEach(block => {
        const exId = block.dataset.exerciseId;
        const sets = [];
        block.querySelectorAll('.set-row').forEach(row => {
          const weight = row.querySelector('.set-weight').value;
          const reps = row.querySelector('.set-reps').value;
          if (weight || reps) {
            sets.push({
              weight: parseFloat(weight) || 0,
              reps: parseInt(reps) || 0
            });
          }
        });
        if (sets.length > 0) {
          entry.exercises.push({ exerciseId: exId, sets });
        }
      });
    } else if (w.type === 'cardio') {
      const selectedMod = document.querySelector('.modality-btn.selected');
      const modality = selectedMod ? selectedMod.textContent : '';
      const mod = modality.toLowerCase();
      const isHIIT = w.cardioMode === 'hiit';

      const cardioData = {
        modality,
        duration: parseInt(document.getElementById('cardio-duration').value) || 0,
        avgHR: parseInt(document.getElementById('cardio-hr').value) || 0
      };

      // Capture pace fields based on modality
      if (mod === 'erg') {
        if (isHIIT) {
          const el1 = document.getElementById('erg-interval-split');
          const el2 = document.getElementById('erg-recovery-split');
          const el3 = document.getElementById('erg-spm');
          if (el1) cardioData.intervalSplit = el1.value.trim();
          if (el2) cardioData.recoverySplit = el2.value.trim();
          if (el3) cardioData.spm = parseInt(el3.value) || 0;
        } else {
          const el1 = document.getElementById('erg-split');
          const el2 = document.getElementById('erg-spm');
          if (el1) cardioData.split = el1.value.trim();
          if (el2) cardioData.spm = parseInt(el2.value) || 0;
        }
      } else if (mod === 'running') {
        if (isHIIT) {
          const el1 = document.getElementById('run-interval-pace');
          const el2 = document.getElementById('run-recovery-pace');
          if (el1) cardioData.intervalPace = el1.value.trim();
          if (el2) cardioData.recoveryPace = el2.value.trim();
        } else {
          const el1 = document.getElementById('run-pace');
          if (el1) cardioData.pace = el1.value.trim();
        }
      }

      entry.cardio = cardioData;
    } else if (w.type === 'recovery') {
      const selectedAct = document.querySelector('.modality-btn.selected');
      entry.recovery = {
        activity: selectedAct ? selectedAct.textContent : '',
        duration: parseInt(document.getElementById('recovery-duration').value) || 0
      };
    }

    Store.saveWorkout(entry);

    const saveBtn = document.getElementById('save-btn');
    saveBtn.textContent = 'Saved!';
    saveBtn.classList.add('saved');

    App.toast('Workout saved!');

    // Update dashboard when we return
    setTimeout(() => {
      saveBtn.textContent = 'Save';
      saveBtn.classList.remove('saved');
    }, 2000);
  }
};
