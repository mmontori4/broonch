import { useState, useEffect, useCallback } from "react";

const REUNIONS_DATE = new Date("2026-05-21T00:00:00");
const START_DATE = new Date("2026-04-13T00:00:00");

const PHASES = [
  { weeks: [1], name: "RAMP UP", rpe: "7-8", desc: "Introduce hybrid structure. Establish baselines." },
  { weeks: [2, 3], name: "THE GRIND", rpe: "8-9", desc: "Push volume on rings and heavy compounds." },
  { weeks: [4], name: "INTENSE", rpe: "9", desc: "Add VO2 Max protocol. Maximum width focus." },
  { weeks: [5], name: "PEAK", rpe: "9-10", desc: "Final push before taper. Full effort." },
  { weeks: [6], name: "TAPER", rpe: "6-7", desc: "Maintenance only. Arrive full, not flat." },
];

const SPLIT = [
  {
    name: "PUSH + WIDTH",
    subtitle: "Heavy Push + Side Delts",
    muscles: "Chest · Shoulders · Triceps",
    exercises: [
      { name: "BB Bench Press", sets: "3×5-8", note: "Heavy compound" },
      { name: "Seated DB OHP", sets: "3×8-10", note: "Vertical push base" },
      { name: "Incline DB Press", sets: "3×10-12", note: "Upper chest shelf" },
      { name: "Cable Lateral Raise", sets: "4×15", note: "Constant tension. Width focus." },
      { name: "Tricep Cable Pushdown", sets: "3×12-15", note: "Full extension" },
    ],
  },
  {
    name: "LAT WIDTH",
    subtitle: "Ring Pulls + Lat Stretch",
    muscles: "Lats · Biceps",
    exercises: [
      { name: "Ring Pull-ups", sets: "4×Max", note: "Dead hang, full stretch" },
      { name: "Ring Rows", sets: "3×12", note: "Feet elevated" },
      { name: "DB Lat Pullovers", sets: "3×12-15", note: "Stretch-mediated hypertrophy" },
      { name: "DB Curls", sets: "3×12-15", note: "Standard or incline" },
      { name: "DB Hammer Curls", sets: "3×12", note: "Brachialis focus" },
    ],
  },
  {
    name: "THICKNESS/LEGS",
    subtitle: "BB Rows + Health Legs",
    muscles: "Back · Quads · Hamstrings",
    exercises: [
      { name: "Barbell Row (Strict)", sets: "4×6-8", note: "Mid-back thickness" },
      { name: "Chest-Supported Row", sets: "3×10-12", note: "Isolate back" },
      { name: "DB Split Squats", sets: "3×10/side", note: "Stability + health. No bracing." },
      { name: "DB Single-Leg RDL", sets: "3×12/side", note: "Posterior chain. Back health." },
      { name: "Machine Lateral Raise", sets: "3×15", note: "Maintain shoulder volume" },
    ],
  },
  {
    name: "CARDIO + WIDTH",
    subtitle: "Z2 Erg + Side Delt Mini",
    muscles: "Cardio · Side Delts",
    exercises: [
      { name: "Zone 2 Erg", sets: "60 min", note: "Talk test intensity" },
      { name: 'DB Lateral Raise', sets: '5×15-20', note: 'Frequency for width' },
      { name: 'Norwegian 4x4', sets: '4×4 min', note: 'WEEK 5+ ONLY. 90% HR.' },
    ],
  },
  {
    name: "V-TAPER SPEC",
    subtitle: "Weighted Pulls + Width",
    muscles: "Lats · Shoulders · Upper Chest",
    exercises: [
      { name: "Weighted Pull-ups", sets: "4×6-10", note: "Width specialization" },
      { name: "Lat Pulldown (Wide)", sets: "3×12-15", note: "Control the eccentric" },
      { name: "Cable Lateral Raise (Behind Back)", sets: "4×15", note: "Max stretch on delt" },
      { name: "Low-to-High Cable Fly", sets: "3×15", note: "Upper chest shelf" },
      { name: "Overhead Tricep Extension", sets: "3×12", note: "Long head focus" },
      { name: "Preacher Curls", sets: "3×12", note: "Peak contraction" },
    ],
  },
  {
    name: "PUSH B (HOME)",
    subtitle: "Ring Dips + Upper Chest",
    muscles: "Chest · Shoulders · Triceps",
    exercises: [
      { name: "Ring Dips", sets: "4×8-12", note: "Deep stretch" },
      { name: "Ring Pushups", sets: "3×Max", note: "Squeeze rings at top" },
      { name: "DB Lateral Raise", sets: "4×15-20", note: "Width finisher" },
      { name: "Overhead DB Tricep Ext", sets: "3×12", note: "Home isolation" },
    ],
  },
  {
    name: "LONG CARDIO",
    subtitle: "Aerobic Base",
    muscles: "Cardio",
    exercises: [
      { name: "Long Run or Erg", sets: "75 min", note: "Keep it easy. Zone 2." },
      { name: "Mobility/Stretching", sets: "15 min", note: "Full body recovery" },
    ],
  },
];

const CHECKIN_METRICS = [
  { key: "weight", label: "Weight (lbs)", type: "number" },
  { key: "waist", label: "Waist (inches)", type: "number" },
  { key: "shoulders", label: "Shoulders (inches)", type: "number" },
  { key: "energy", label: "Energy (1-10)", type: "number" },
  { key: "healing", label: "Healing comfort (1-10)", type: "number" },
  { key: "notes", label: "Notes / what to adjust", type: "text" },
];

function getDayNumber() {
  const now = new Date();
  const diff = Math.floor((now - START_DATE) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function getDaysRemaining() {
  const now = new Date();
  const diff = Math.ceil((REUNIONS_DATE - now) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function getWeekNumber(dayNum) {
  return Math.min(7, Math.floor(dayNum / 7) + 1);
}

function getPhase(weekNum) {
  return PHASES.find(p => p.weeks.includes(weekNum)) || PHASES[0];
}

export default function ReunionsWorkout() {
  const [view, setView] = useState("today");
  const [data, setData] = useState({ completedDays: [], checkins: [] });
  const [checkinForm, setCheckinForm] = useState({});
  const [expandedDay, setExpandedDay] = useState(null);

  useEffect(() => {
    const tryLoad = async () => {
      try {
        const result = await window.storage.get("reunions-v2");
        if (result && result.value) {
          setData(JSON.parse(result.value));
          return;
        }
      } catch {}
    };
    tryLoad();
  }, []);

  const persist = useCallback((newData) => {
    setData(newData);
    try { window.storage.set("reunions-v2", JSON.stringify(newData)).catch(() => {}); } catch {}
  }, []);

  const dayNum = getDayNumber();
  const daysLeft = getDaysRemaining();
  const weekNum = getWeekNumber(dayNum);
  const phase = getPhase(weekNum);
  const todaySplitIndex = dayNum % 7;
  const todayWorkout = SPLIT[todaySplitIndex];
  const isCompleted = data.completedDays.includes(dayNum);

  const toggleComplete = () => {
    const newCompleted = isCompleted
      ? data.completedDays.filter(d => d !== dayNum)
      : [...data.completedDays, dayNum];
    persist({ ...data, completedDays: newCompleted });
  };

  const submitCheckin = () => {
    const entry = { week: weekNum, date: new Date().toISOString(), ...checkinForm };
    persist({ ...data, checkins: [...data.checkins, entry] });
    setCheckinForm({});
    setView("today");
  };

  const completionRate = dayNum > 0
    ? Math.round((data.completedDays.filter(d => d < dayNum).length / dayNum) * 100)
    : 0;

  const vtaper = (ci) => {
    if (ci.shoulders && ci.waist) return (ci.shoulders / ci.waist).toFixed(2);
    return null;
  };

  const c = {
    bg: "#09090b", card: "#18181b", accent: "#f97316", accentDim: "#7c2d12",
    text: "#e4e4e7", dim: "#71717a", border: "#27272a", green: "#22c55e",
    greenDim: "#14532d", yellow: "#eab308", indigo: "#6366f1",
  };
  const f = "'SF Mono', 'JetBrains Mono', 'Fira Code', ui-monospace, monospace";

  const Pill = ({ color, children }) => (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: 1.5, padding: "3px 8px",
      borderRadius: 3, background: color + "20", color: color, fontFamily: f,
    }}>{children}</span>
  );

  return (
    <div style={{ fontFamily: f, background: c.bg, color: c.text, minHeight: "100vh", maxWidth: 480, margin: "0 auto", paddingBottom: 100, WebkitFontSmoothing: "antialiased" }}>

      {/* HEADER */}
      <div style={{ padding: "20px 20px 14px", borderBottom: `1px solid ${c.border}`, position: "sticky", top: 0, background: c.bg, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: c.accent, fontWeight: 700, marginBottom: 2 }}>ROAD TO REUNIONS</div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -1 }}>
              {daysLeft} <span style={{ fontSize: 13, color: c.dim, fontWeight: 400 }}>days</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: c.dim, letterSpacing: 1 }}>WK {weekNum}/6</div>
            <Pill color={c.accent}>{phase.name}</Pill>
            <div style={{ fontSize: 9, color: c.dim, marginTop: 3 }}>RPE {phase.rpe}</div>
          </div>
        </div>
        <div style={{ marginTop: 10, height: 3, background: c.border, borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.min(100, (dayNum / 42) * 100)}%`, background: `linear-gradient(90deg, ${c.accent}, ${c.green})`, borderRadius: 2, transition: "width 0.5s" }} />
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: `1px solid ${c.border}` }}>
        {["today", "plan", "check-in", "log"].map(tab => (
          <button key={tab} onClick={() => setView(tab)} style={{
            flex: 1, padding: "11px 0", background: "none", border: "none", fontFamily: f,
            color: view === tab ? c.accent : c.dim, fontSize: 10, letterSpacing: 1.5, fontWeight: view === tab ? 700 : 400,
            cursor: "pointer", borderBottom: view === tab ? `2px solid ${c.accent}` : "2px solid transparent", textTransform: "uppercase",
          }}>{tab}</button>
        ))}
      </div>

      {/* ===== TODAY ===== */}
      {view === "today" && (
        <div style={{ padding: 16 }}>
          <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 8, padding: "16px 18px", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
              <span style={{ fontSize: 10, color: c.dim, letterSpacing: 2 }}>DAY {dayNum + 1}</span>
              <Pill color={isCompleted ? c.green : c.dim}>{isCompleted ? "DONE" : "PENDING"}</Pill>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{todayWorkout.name}</div>
            <div style={{ fontSize: 12, color: c.accent }}>{todayWorkout.subtitle}</div>
            <div style={{ fontSize: 10, color: c.dim, marginTop: 4 }}>{todayWorkout.muscles}</div>
          </div>

          {todayWorkout.exercises.map((ex, ei) => (
            <div key={ei} style={{
              background: c.card, border: `1px solid ${c.border}`, borderRadius: 5,
              padding: "12px 14px", marginTop: 6,
              borderLeft: `3px solid ${c.accent}30`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{ex.name}</span>
                <span style={{ fontSize: 12, color: c.accent, fontWeight: 700 }}>{ex.sets}</span>
              </div>
              <div style={{ fontSize: 10, color: c.dim, marginTop: 3 }}>{ex.note}</div>
            </div>
          ))}

          <button onClick={toggleComplete} style={{
            width: "100%", padding: 14, marginTop: 14, border: "none", borderRadius: 8,
            background: isCompleted ? c.greenDim : c.accent, color: "#fff",
            fontSize: 13, fontWeight: 700, fontFamily: f, letterSpacing: 2, cursor: "pointer",
          }}>
            {isCompleted ? "✓ COMPLETED" : "MARK COMPLETE"}
          </button>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            {[
              { val: `${completionRate}%`, label: "ADHERENCE" },
              { val: data.completedDays.length, label: "SESSIONS" },
              { val: data.checkins.length, label: "CHECK-INS" },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1, padding: 10, background: c.card, border: `1px solid ${c.border}`,
                borderRadius: 6, textAlign: "center",
              }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{s.val}</div>
                <div style={{ fontSize: 8, color: c.dim, letterSpacing: 1, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== PLAN ===== */}
      {view === "plan" && (
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 10, color: c.dim, letterSpacing: 2, marginBottom: 8 }}>PROGRAM</div>

          <div style={{ marginBottom: 14 }}>
            {PHASES.map((p, i) => (
              <div key={i} style={{
                display: "flex", gap: 10, alignItems: "baseline",
                padding: "4px 0", fontSize: 10, color: c.dim, lineHeight: 1.6,
              }}>
                <Pill color={p === phase ? c.accent : c.dim}>{p.name}</Pill>
                <span>Wk {p.weeks[0]}-{p.weeks[p.weeks.length - 1]} · {p.desc}</span>
              </div>
            ))}
          </div>

          {SPLIT.map((day, i) => (
            <div key={i}>
              <button onClick={() => setExpandedDay(expandedDay === i ? null : i)} style={{
                width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 14px", marginBottom: 5,
                background: i === todaySplitIndex ? c.accentDim + "25" : c.card,
                border: `1px solid ${i === todaySplitIndex ? c.accent + "40" : c.border}`,
                borderRadius: 6, color: c.text, fontFamily: f, cursor: "pointer", textAlign: "left",
              }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>
                    {i === todaySplitIndex && <span style={{ color: c.accent }}>▸ </span>}{day.name}
                  </div>
                  <div style={{ fontSize: 10, color: c.dim, marginTop: 1 }}>{day.muscles}</div>
                </div>
                <span style={{ fontSize: 10, color: c.dim }}>{expandedDay === i ? "▾" : "▸"}</span>
              </button>

              {expandedDay === i && (
                <div style={{ marginBottom: 10, paddingLeft: 4 }}>
                  {day.exercises.map((ex, ei) => (
                    <div key={ei} style={{ padding: "8px 12px", borderLeft: `2px solid ${c.accent}30`, marginBottom: 3 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 11 }}>{ex.name}</span>
                        <span style={{ fontSize: 11, color: c.accent }}>{ex.sets}</span>
                      </div>
                      <div style={{ fontSize: 9, color: c.dim, marginTop: 1 }}>{ex.note}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div style={{ marginTop: 16, padding: 14, background: c.card, border: `1px solid ${c.border}`, borderRadius: 6 }}>
            <div style={{ fontSize: 10, color: c.accent, letterSpacing: 2, marginBottom: 8 }}>NUTRITION (V-TAPER FOCUS)</div>
            <div style={{ fontSize: 11, color: c.dim, lineHeight: 1.7 }}>
              <p style={{ margin: "0 0 6px" }}><strong style={{ color: c.text }}>Protein:</strong> 1g/lb minimum. Non-negotiable for muscle retention.</p>
              <p style={{ margin: "0 0 6px" }}><strong style={{ color: c.text }}>Calories:</strong> Slight deficit (200-300 below TDEE). Focus on body recomp.</p>
              <p style={{ margin: "0 0 6px" }}><strong style={{ color: c.text }}>Fiber:</strong> 30g+ daily. Crucial for post-op digestive health.</p>
              <p style={{ margin: 0 }}><strong style={{ color: c.text }}>Creatine:</strong> 5g/day.</p>
            </div>
          </div>

          <div style={{ marginTop: 10, padding: 14, background: c.card, border: `1px solid ${c.border}`, borderRadius: 6 }}>
            <div style={{ fontSize: 10, color: c.accent, letterSpacing: 2, marginBottom: 8 }}>HEALTH & STRENGTH (LEGS)</div>
            <div style={{ fontSize: 11, color: c.dim, lineHeight: 1.7 }}>
              <p style={{ margin: "0 0 6px" }}><strong style={{ color: c.text }}>Unilateral Focus:</strong> Split squats and Single-leg RDLs build stability and health without the surgical risk of heavy barbell bracing.</p>
              <p style={{ margin: "0 0 6px" }}><strong style={{ color: c.text }}>Bracing:</strong> Focus on fluid breathing throughout the set. Do NOT use the Valsalva maneuver (breath-holding).</p>
              <p style={{ margin: 0 }}><strong style={{ color: c.text }}>Progression:</strong> Add weight only when you can complete all reps with zero "pressure" at the surgical site.</p>
            </div>
          </div>
        </div>
      )}

      {/* ===== CHECK-IN ===== */}
      {view === "check-in" && (
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 10, color: c.dim, letterSpacing: 2, marginBottom: 2 }}>WEEKLY CHECK-IN</div>
          <div style={{ fontSize: 11, color: c.dim, marginBottom: 16, lineHeight: 1.5 }}>
            Same conditions each week: morning, post-bathroom, pre-food.
          </div>

          {CHECKIN_METRICS.map(m => (
            <div key={m.key} style={{ marginBottom: 10 }}>
              <label style={{ display: "block", fontSize: 9, color: c.dim, letterSpacing: 1.5, marginBottom: 4, fontFamily: f }}>
                {m.label.toUpperCase()}
              </label>
              <input
                type={m.type} value={checkinForm[m.key] || ""}
                onChange={e => setCheckinForm({ ...checkinForm, [m.key]: e.target.value })}
                style={{
                  width: "100%", padding: "11px 12px", background: c.card, border: `1px solid ${c.border}`,
                  borderRadius: 6, color: c.text, fontSize: 13, fontFamily: f, outline: "none", boxSizing: "border-box",
                }}
                placeholder={m.type === "number" ? "0" : "..."}
              />
            </div>
          ))}

          <button onClick={submitCheckin} style={{
            width: "100%", padding: 14, marginTop: 6, background: c.accent, color: "#fff",
            border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, fontFamily: f, letterSpacing: 2, cursor: "pointer",
          }}>LOG CHECK-IN</button>

          <div style={{ marginTop: 16, padding: 14, background: c.card, border: `1px solid ${c.border}`, borderRadius: 6 }}>
            <div style={{ fontSize: 10, color: c.accent, letterSpacing: 2, marginBottom: 8 }}>ITERATION RULES</div>
            <div style={{ fontSize: 11, color: c.dim, lineHeight: 1.7 }}>
              <p style={{ margin: "0 0 6px" }}><strong style={{ color: c.text }}>Waist ↓ + weight stable?</strong> Recomp working. Stay course.</p>
              <p style={{ margin: "0 0 6px" }}><strong style={{ color: c.text }}>Weight dropping &gt;2 lbs/wk?</strong> Add 200 cal.</p>
              <p style={{ margin: "0 0 6px" }}><strong style={{ color: c.text }}>Nothing moving?</strong> Cut 200 cal or add 10 min walking.</p>
              <p style={{ margin: "0 0 6px" }}><strong style={{ color: c.text }}>V-taper ratio?</strong> Shoulders÷waist. Target &gt;1.45.</p>
              <p style={{ margin: 0 }}><strong style={{ color: c.text }}>Healing comfort ↑?</strong> Unlock next leg phase.</p>
            </div>
          </div>
        </div>
      )}

      {/* ===== LOG ===== */}
      {view === "log" && (
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 10, color: c.dim, letterSpacing: 2, marginBottom: 14 }}>CHECK-IN HISTORY</div>

          {data.checkins.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: c.dim, fontSize: 11 }}>
              No check-ins yet. Do your baseline today.
            </div>
          ) : (
            [...data.checkins].reverse().map((ci, i) => {
              const vt = vtaper(ci);
              return (
                <div key={i} style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 6, padding: 14, marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <Pill color={c.accent}>WEEK {ci.week}</Pill>
                    <span style={{ fontSize: 9, color: c.dim }}>{new Date(ci.date).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    {ci.weight && <div><div style={{ fontSize: 15, fontWeight: 700 }}>{ci.weight}</div><div style={{ fontSize: 8, color: c.dim, letterSpacing: 1 }}>LBS</div></div>}
                    {ci.waist && <div><div style={{ fontSize: 15, fontWeight: 700 }}>{ci.waist}"</div><div style={{ fontSize: 8, color: c.dim, letterSpacing: 1 }}>WAIST</div></div>}
                    {ci.shoulders && <div><div style={{ fontSize: 15, fontWeight: 700 }}>{ci.shoulders}"</div><div style={{ fontSize: 8, color: c.dim, letterSpacing: 1 }}>SHLDR</div></div>}
                    {vt && <div><div style={{ fontSize: 15, fontWeight: 700, color: parseFloat(vt) >= 1.45 ? c.green : c.text }}>{vt}</div><div style={{ fontSize: 8, color: c.dim, letterSpacing: 1 }}>V-TAPER</div></div>}
                    {ci.energy && <div><div style={{ fontSize: 15, fontWeight: 700 }}>{ci.energy}/10</div><div style={{ fontSize: 8, color: c.dim, letterSpacing: 1 }}>ENERGY</div></div>}
                    {ci.healing && <div><div style={{ fontSize: 15, fontWeight: 700 }}>{ci.healing}/10</div><div style={{ fontSize: 8, color: c.dim, letterSpacing: 1 }}>HEALING</div></div>}
                  </div>
                  {ci.notes && <div style={{ fontSize: 10, color: c.dim, marginTop: 8, fontStyle: "italic" }}>{ci.notes}</div>}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
