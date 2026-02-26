// ===== WORKOUT PLAN DATA =====
// 12-week upper body hypertrophy + zone 2 cardio

const PLAN_START = '2026-02-23'; // Monday of Week 1

const PHASES = [
  { weeks: [1,2,3,4], name: 'Foundation', rpe: '7', desc: 'Learn movements, establish habits. RPE 7 (3 reps in reserve).' },
  { weeks: [5,6,7,8], name: 'Accumulation', rpe: '7-8', desc: 'Volume increase. +1 set on compounds. RPE 7-8.' },
  { weeks: [9,10,11], name: 'Intensification', rpe: '8-9', desc: 'Push harder. Fewer sets, heavier weight. RPE 8-9.' },
  { weeks: [12], name: 'Deload', rpe: '5-6', desc: 'Recovery week. 40% less weight, 50% less volume.' },
];

function getPhase(week) {
  return PHASES.find(p => p.weeks.includes(week)) || PHASES[0];
}

function getPhaseSetAdjustment(week, baseConfig) {
  const phase = getPhase(week);
  if (phase.name === 'Foundation') return baseConfig;
  if (phase.name === 'Accumulation') {
    return { ...baseConfig, sets: baseConfig.sets + 1 };
  }
  if (phase.name === 'Intensification') {
    return { ...baseConfig, sets: Math.max(3, baseConfig.sets - 1) };
  }
  // Deload
  return { ...baseConfig, sets: Math.max(2, Math.ceil(baseConfig.sets / 2)) };
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const WORKOUTS = {
  monday_push: {
    id: 'monday_push',
    day: 0,
    dayLabel: 'Mon',
    name: 'Upper Push + Core',
    duration: '60 min',
    location: 'gym',
    type: 'lifting',
    sections: [
      {
        title: 'Main Lifts',
        exercises: [
          { id: 'bench_press', name: 'Barbell Bench Press', sets: 4, reps: '6-8', rest: '3 min', note: 'Primary horizontal push' },
          { id: 'overhead_press', name: 'Overhead Press (BB/DB)', sets: 4, reps: '8-10', rest: '2 min', note: 'Primary vertical push' },
          { id: 'incline_db_press', name: 'Incline DB Press', sets: 3, reps: '10-12', rest: '90 sec', note: 'Upper chest emphasis' },
          { id: 'dips', name: 'Ring Dips / Machine Dips', sets: 3, reps: '8-12', rest: '90 sec', note: 'Chest/tricep compound' },
        ]
      },
      {
        title: 'Core Work',
        exercises: [
          { id: 'dead_bugs', name: 'Dead Bugs', sets: 3, reps: '10/side', rest: '30 sec', note: '' },
          { id: 'pallof_press', name: 'Cable Pallof Press', sets: 3, reps: '12/side', rest: '30 sec', note: '' },
          { id: 'plank', name: 'Plank', sets: 2, reps: '30-45 sec', rest: '30 sec', note: '' },
        ]
      }
    ]
  },

  tuesday_cardio: {
    id: 'tuesday_cardio',
    day: 1,
    dayLabel: 'Tue',
    name: 'Zone 2 Cardio',
    duration: '45 min',
    location: 'home',
    type: 'cardio',
    targetHR: '60-70% max HR',
    modalities: ['Rowing', 'Easy Run', 'Run/Walk Intervals'],
    structure: '5 min warmup → 35 min steady state → 5 min cooldown'
  },

  wednesday_pull: {
    id: 'wednesday_pull',
    day: 2,
    dayLabel: 'Wed',
    name: 'Upper Pull + Accessories',
    duration: '60 min',
    location: 'gym',
    type: 'lifting',
    sections: [
      {
        title: 'Main Lifts',
        exercises: [
          { id: 'pullups', name: 'Pull-ups (weighted if able)', sets: 4, reps: '6-10', rest: '2.5 min', note: 'Use squat rack or rings' },
          { id: 'barbell_row', name: 'Barbell Row', sets: 4, reps: '8-10', rest: '2 min', note: 'From squat rack' },
          { id: 'face_pulls', name: 'Cable Face Pulls', sets: 3, reps: '15-20', rest: '60 sec', note: 'Rear delt/rotator cuff health' },
          { id: 'single_arm_row', name: 'Single-Arm DB Row', sets: 3, reps: '10-12', rest: '90 sec', note: 'Unilateral strength' },
        ]
      },
      {
        title: 'Accessories',
        exercises: [
          { id: 'curls', name: 'Barbell / DB Curls', sets: 3, reps: '12-15', rest: '60 sec', note: '' },
          { id: 'hammer_curls', name: 'Hammer Curls', sets: 2, reps: '12-15', rest: '60 sec', note: '' },
        ]
      }
    ]
  },

  thursday_hiit: {
    id: 'thursday_hiit',
    day: 3,
    dayLabel: 'Thu',
    name: 'HIIT + Mobility',
    duration: '45 min',
    location: 'home',
    type: 'cardio',
    targetHR: '85-90% max HR (intervals)',
    modalities: ['Rowing', 'Running', 'Cycling'],
    structure: '5 min warmup → 4×(4 min hard / 3 min easy) → 4 min cooldown → 20 min mobility'
  },

  friday_combo: {
    id: 'friday_combo',
    day: 4,
    dayLabel: 'Fri',
    name: 'Upper Push/Pull Combo',
    duration: '45 min',
    location: 'gym',
    type: 'supersets',
    sections: [
      {
        title: 'Supersets',
        supersets: [
          {
            label: 'Superset 1',
            rest: '90 sec',
            exercises: [
              { id: 'db_bench', name: 'DB Bench Press', sets: 3, reps: '10-12', note: '' },
              { id: 'chest_supported_row', name: 'Chest-Supported Row Machine', sets: 3, reps: '10-12', note: '' },
            ]
          },
          {
            label: 'Superset 2',
            rest: '90 sec',
            exercises: [
              { id: 'arnold_press', name: 'DB Arnold Press', sets: 3, reps: '10-12', note: '' },
              { id: 'lat_pulldown', name: 'Lat Pulldown Machine', sets: 3, reps: '10-12', note: '' },
            ]
          },
          {
            label: 'Superset 3',
            rest: '60 sec',
            exercises: [
              { id: 'cable_fly', name: 'Cable Fly', sets: 3, reps: '12-15', note: '' },
              { id: 'cable_reverse_fly', name: 'Cable Reverse Fly', sets: 3, reps: '12-15', note: '' },
            ]
          },
          {
            label: 'Superset 4',
            rest: '60 sec',
            exercises: [
              { id: 'tricep_pushdown', name: 'Cable Tricep Pushdown', sets: 3, reps: '12-15', note: '' },
              { id: 'cable_curl', name: 'Cable Curl', sets: 3, reps: '12-15', note: '' },
            ]
          }
        ]
      },
      {
        title: 'Finisher',
        exercises: [
          { id: 'pushups', name: 'Ring Push-ups (or regular)', sets: 3, reps: 'to failure', rest: '30 sec', note: '' },
        ]
      }
    ]
  },

  saturday_cardio: {
    id: 'saturday_cardio',
    day: 5,
    dayLabel: 'Sat',
    name: 'Zone 2 Long Session',
    duration: '60 min',
    location: 'home',
    type: 'cardio',
    targetHR: '60-70% max HR',
    modalities: ['Long Easy Run', 'Rowing', 'Hike / Long Walk'],
    structure: '60 min continuous at zone 2'
  },

  sunday_recovery: {
    id: 'sunday_recovery',
    day: 6,
    dayLabel: 'Sun',
    name: 'Active Recovery',
    duration: '15-30 min',
    location: 'home',
    type: 'recovery',
    options: ['Gentle yoga flow', 'Easy walk + stretching', 'Ring hangs + mobility', 'Light rowing']
  }
};

const WORKOUT_ORDER = [
  'monday_push',
  'tuesday_cardio',
  'wednesday_pull',
  'thursday_hiit',
  'friday_combo',
  'saturday_cardio',
  'sunday_recovery'
];

// Get all unique lifting exercise IDs + names for trends
function getAllLiftingExercises() {
  const exercises = [];
  const seen = new Set();
  for (const wid of WORKOUT_ORDER) {
    const w = WORKOUTS[wid];
    if (!w.sections) continue;
    for (const sec of w.sections) {
      if (sec.exercises) {
        for (const ex of sec.exercises) {
          if (!seen.has(ex.id) && ex.reps !== 'to failure') {
            seen.add(ex.id);
            exercises.push({ id: ex.id, name: ex.name });
          }
        }
      }
      if (sec.supersets) {
        for (const ss of sec.supersets) {
          for (const ex of ss.exercises) {
            if (!seen.has(ex.id)) {
              seen.add(ex.id);
              exercises.push({ id: ex.id, name: ex.name });
            }
          }
        }
      }
    }
  }
  return exercises;
}
