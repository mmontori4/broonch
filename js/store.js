// ===== localStorage ABSTRACTION =====
// Namespaced per user: broonch_{user}_{key}

const Store = {
  _user: null,

  setUser(user) {
    this._user = user;
    localStorage.setItem('broonch_active_user', user);
  },

  getUser() {
    if (!this._user) {
      this._user = localStorage.getItem('broonch_active_user');
    }
    return this._user;
  },

  clearUser() {
    this._user = null;
    localStorage.removeItem('broonch_active_user');
  },

  _key(key) {
    return `broonch_${this._user}_${key}`;
  },

  // Save a workout entry
  saveWorkout(entry) {
    const entries = this.getWorkouts();
    // Replace existing entry for same workout + week, or add new
    const idx = entries.findIndex(e =>
      e.workoutId === entry.workoutId && e.week === entry.week
    );
    if (idx >= 0) {
      entries[idx] = entry;
    } else {
      entries.push(entry);
    }
    localStorage.setItem(this._key('workouts'), JSON.stringify(entries));
  },

  // Get all workout entries for current user
  getWorkouts() {
    try {
      return JSON.parse(localStorage.getItem(this._key('workouts'))) || [];
    } catch {
      return [];
    }
  },

  // Get a specific workout entry
  getWorkoutEntry(workoutId, week) {
    return this.getWorkouts().find(e =>
      e.workoutId === workoutId && e.week === week
    );
  },

  // Check if a workout is logged for a given week
  isLogged(workoutId, week) {
    return !!this.getWorkoutEntry(workoutId, week);
  },

  // Get last logged entry for a workout (any week) for prefill
  getLastEntry(workoutId) {
    const entries = this.getWorkouts()
      .filter(e => e.workoutId === workoutId)
      .sort((a, b) => b.week - a.week);
    return entries[0] || null;
  },

  // Get best weight for a specific exercise across all weeks
  getExerciseHistory(exerciseId) {
    const history = [];
    const entries = this.getWorkouts();
    for (const entry of entries) {
      if (!entry.exercises) continue;
      for (const ex of entry.exercises) {
        if (ex.exerciseId === exerciseId && ex.sets) {
          const bestSet = ex.sets.reduce((best, s) => {
            const w = parseFloat(s.weight) || 0;
            return w > (best.weight || 0) ? s : best;
          }, {});
          if (bestSet.weight) {
            history.push({
              week: entry.week,
              date: entry.date,
              weight: parseFloat(bestSet.weight),
              reps: parseInt(bestSet.reps) || 0
            });
          }
        }
      }
    }
    return history.sort((a, b) => a.week - b.week);
  },

  // Get cardio history
  getCardioHistory() {
    return this.getWorkouts()
      .filter(e => e.cardio)
      .map(e => ({
        week: e.week,
        date: e.date,
        avgHR: e.cardio.avgHR,
        duration: e.cardio.duration,
        modality: e.cardio.modality
      }))
      .sort((a, b) => a.week - b.week);
  },

  // Get attendance data: which workouts are logged per week
  getAttendance() {
    const grid = {};
    for (let w = 1; w <= 12; w++) {
      grid[w] = {};
      for (const wid of WORKOUT_ORDER) {
        grid[w][wid] = this.isLogged(wid, w);
      }
    }
    return grid;
  },

  // Get current week number based on plan start date
  getCurrentWeek() {
    const start = new Date(PLAN_START);
    const now = new Date();
    const diff = Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000));
    return Math.max(1, Math.min(12, diff + 1));
  }
};
