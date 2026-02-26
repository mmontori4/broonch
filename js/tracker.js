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
      `${w.dayLabel} \u00b7 ${w.duration} \u00b7 ${w.location === 'gym' ? "Gold's Gym" : 'Home'}`;

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

    const form = document.createElement('div');
    form.className = 'cardio-form';

    // Modality
    let modalityHtml = '';
    for (const mod of workout.modalities) {
      const sel = data.modality === mod ? 'selected' : '';
      modalityHtml += `<button class="modality-btn ${sel}" onclick="Tracker.selectModality(this, '${mod}')">${mod}</button>`;
    }

    form.innerHTML = `
      <div class="form-field">
        <label>Modality</label>
        <div class="modality-options" id="modality-options">${modalityHtml}</div>
      </div>
      <div class="form-field">
        <label for="cardio-duration">Duration (min)</label>
        <input type="number" inputmode="numeric" id="cardio-duration" placeholder="45" value="${data.duration || ''}">
      </div>
      <div class="form-field">
        <label for="cardio-hr">Avg Heart Rate (bpm)</label>
        <input type="number" inputmode="numeric" id="cardio-hr" placeholder="130" value="${data.avgHR || ''}">
      </div>
      <div class="form-field">
        <label>Target: ${workout.targetHR}</label>
      </div>
      <div class="form-field">
        <label>Structure</label>
        <p style="font-size:0.85rem;color:var(--text2)">${workout.structure}</p>
      </div>
    `;
    container.appendChild(form);
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
      entry.cardio = {
        modality: selectedMod ? selectedMod.textContent : '',
        duration: parseInt(document.getElementById('cardio-duration').value) || 0,
        avgHR: parseInt(document.getElementById('cardio-hr').value) || 0
      };
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
