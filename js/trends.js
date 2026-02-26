// ===== TRENDS / CHARTS =====

const Trends = {
  exerciseChart: null,
  cardioChart: null,

  init() {
    this.populateExerciseSelect();
    this.renderExerciseChart();
    this.renderAttendance();
    this.renderCardioChart();
  },

  populateExerciseSelect() {
    const select = document.getElementById('exercise-select');
    select.innerHTML = '';
    const exercises = getAllLiftingExercises();
    for (const ex of exercises) {
      const opt = document.createElement('option');
      opt.value = ex.id;
      opt.textContent = ex.name;
      select.appendChild(opt);
    }
  },

  renderExerciseChart() {
    const select = document.getElementById('exercise-select');
    const exId = select.value;
    if (!exId) return;

    const history = Store.getExerciseHistory(exId);
    const labels = history.map(h => `W${h.week}`);
    const weights = history.map(h => h.weight);

    if (this.exerciseChart) this.exerciseChart.destroy();

    const ctx = document.getElementById('chart-exercise').getContext('2d');
    this.exerciseChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Best Weight (lbs)',
          data: weights,
          borderColor: '#a29bfe',
          backgroundColor: '#a29bfe30',
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#a29bfe',
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              afterLabel(ctx) {
                const h = history[ctx.dataIndex];
                return h ? `${h.reps} reps` : '';
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: '#2a2a5a40' },
            ticks: { color: '#9090b0' }
          },
          y: {
            grid: { color: '#2a2a5a40' },
            ticks: { color: '#9090b0' },
            beginAtZero: false
          }
        }
      }
    });
  },

  renderAttendance() {
    const grid = document.getElementById('attendance-grid');
    grid.innerHTML = '';

    const attendance = Store.getAttendance();
    const dayLabels = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];

    // Header row
    grid.appendChild(Object.assign(document.createElement('div'), { className: 'att-header', textContent: '' }));
    for (const d of dayLabels) {
      grid.appendChild(Object.assign(document.createElement('div'), { className: 'att-header', textContent: d }));
    }

    // Weeks
    for (let w = 1; w <= 12; w++) {
      const weekLabel = document.createElement('div');
      weekLabel.className = 'att-week';
      weekLabel.textContent = `W${w}`;
      grid.appendChild(weekLabel);

      for (const wid of WORKOUT_ORDER) {
        const cell = document.createElement('div');
        cell.className = 'att-cell' + (attendance[w][wid] ? ' done' : '');
        grid.appendChild(cell);
      }
    }
  },

  renderCardioChart() {
    const history = Store.getCardioHistory().filter(h => h.avgHR > 0);
    const labels = history.map(h => `W${h.week}`);
    const hrs = history.map(h => h.avgHR);

    if (this.cardioChart) this.cardioChart.destroy();

    const ctx = document.getElementById('chart-cardio').getContext('2d');
    this.cardioChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Avg HR (bpm)',
          data: hrs,
          borderColor: '#ff5252',
          backgroundColor: '#ff525230',
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#ff5252',
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: '#2a2a5a40' },
            ticks: { color: '#9090b0' }
          },
          y: {
            grid: { color: '#2a2a5a40' },
            ticks: { color: '#9090b0' },
            beginAtZero: false
          }
        }
      }
    });
  }
};
