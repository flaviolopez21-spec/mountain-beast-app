const STORAGE_KEY = "mountain-beast-v1";
const DEFAULT_START = "2026-06-15";

const defaultProfile = {
  age: 31,
  sex: "male",
  heightIn: 65,
  weight: 190,
  goalWeight: 170,
  goalComposition: "Fit a size L shirt and size 30 pants",
  gymAccess: "Planet Fitness",
  hikingGoal: "Mount Rainier",
  injuries: "None",
  startDate: DEFAULT_START,
  days: [1, 2, 3, 4, 5, 6],
  measurements: { navel: 42, neck: 18.5, waist: 37.5, chest: 44, hips: 41, thigh: 23 }
};

const warmup = [
  ["Incline walk or bike", "5 min"],
  ["Hip circles and openers", "10 each way"],
  ["Bodyweight good mornings", "10"],
  ["Bodyweight squats", "10"],
  ["Reverse lunges", "5 / leg"]
];
const strengthA = [
  ["Goblet squat", "3 × 8–10"],
  ["Romanian deadlift", "3 × 8–10"],
  ["Step-ups", "3 × 8 / leg"],
  ["Push-ups or DB bench", "3 × 8–12"],
  ["Seated row or DB row", "3 × 10–12"],
  ["Farmer carry", "4 × 30–40 sec"],
  ["Plank", "3 × 20–40 sec"]
];
const strengthB = [
  ["Trap bar or KB deadlift", "3 × 6–8"],
  ["Split squat or reverse lunge", "3 × 8 / leg"],
  ["Lat pulldown or assisted pull-up", "3 × 8–12"],
  ["DB overhead press", "3 × 8–10"],
  ["Glute bridge or hip thrust", "3 × 10–12"],
  ["Suitcase carry", "3 × 30 sec / side"],
  ["Bird dog", "3 × 6 / side"]
];
const circuit = [
  ["Step-ups", "10 / leg"],
  ["KB swings or DB RDL", "12"],
  ["Push-ups", "8–12"],
  ["Row", "12"],
  ["Woodchops or med ball slams", "10 / side"],
  ["Farmer carry", "30–45 sec"],
  ["Dead bug", "8 / side"]
];
const finishers = [
  ["Standing calf raises", "2 × 15–20"],
  ["Tibialis raises", "2 × 15–20"],
  ["Dead bug or plank", "2 controlled rounds"]
];
const weeks = [
  [25, "45–60 min", "0–5 lb", 3], [30, "45–60 min", "0–5 lb", 3],
  [30, "60–75 min", "5–10 lb", 3], [35, "60–75 min", "5–10 lb", 3],
  [35, "75–90 min", "10–15 lb", 3], [40, "75–90 min", "10–15 lb", 3],
  [40, "90–100 min", "10–15 lb", 4], [45, "90–100 min", "10–15 lb", 4],
  [45, "100–110 min", "15–20 lb", 4], [50, "100–110 min", "15–20 lb", 4],
  [50, "110–120 min", "20–25 lb", 4], [60, "110–120 min", "20–25 lb", 4]
];

const sessionTemplates = [
  { key: "strengthA", name: "Strength A", purpose: "Lower body · hinge · push/pull · carries", priority: 1 },
  { key: "zone2", name: "Zone 2 Cardio", purpose: "Build the diesel engine", priority: 4 },
  { key: "strengthB", name: "Strength B", purpose: "Hinge · single-leg · pull/press · core", priority: 2 },
  { key: "mobility", name: "Mobility + Easy Walk", purpose: "Knee, hip, and ankle insurance", priority: 6 },
  { key: "circuit", name: "Mountain Circuit", purpose: "Camp strength + conditioning", priority: 5 },
  { key: "long", name: "Long Walk / Hike / Ruck", purpose: "Time on feet + pack tolerance", priority: 3 }
];

function initialState() {
  return {
    setup: null,
    checkins: [{
      date: DEFAULT_START, weight: 190, navel: 42, neck: 18.5, waist: 37.5,
      chest: 44, hips: 41, thigh: 23, notes: "Starting measurements"
    }],
    workouts: {},
    exerciseHistory: {},
    rucks: [],
    habits: {},
    healthImport: null
  };
}

function migrate(raw) {
  const base = initialState();
  const next = raw && typeof raw === "object" ? raw : base;
  next.setup ??= null;
  next.checkins = Array.isArray(next.checkins) && next.checkins.length ? next.checkins : base.checkins;
  next.workouts ??= {};
  next.exerciseHistory ??= {};
  next.rucks ??= [];
  next.habits ??= {};
  next.healthImport ??= null;
  return next;
}

let state = loadState();

function loadState() {
  try { return migrate(JSON.parse(localStorage.getItem(STORAGE_KEY))); }
  catch { return initialState(); }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function profile() { return { ...defaultProfile, ...(state.setup || {}) }; }
function dateAtNoon(value) {
  const text = value instanceof Date ? dateKey(value) : value;
  return new Date(`${text}T12:00:00`);
}
function dateKey(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}
function localToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
}
function programStart() { return dateAtNoon(profile().startDate); }
function programEnd() {
  const end = programStart();
  end.setDate(end.getDate() + 83);
  return end;
}
function activeDate() {
  const today = localToday();
  if (today < programStart()) return programStart();
  if (today > programEnd()) return programEnd();
  return today;
}
function programDay(date = activeDate()) {
  return Math.max(0, Math.min(83, Math.round((date - programStart()) / 86400000)));
}
function currentWeek(date = activeDate()) { return Math.min(12, Math.floor(programDay(date) / 7) + 1); }
function latestCheckin() {
  return [...state.checkins].sort((a, b) => a.date.localeCompare(b.date)).at(-1);
}
function weekMonday(week) {
  const start = programStart();
  const monday = new Date(start);
  monday.setDate(start.getDate() + (week - 1) * 7);
  return monday;
}
function dayOffset(date) { return Math.round((date - weekMonday(currentWeek(date))) / 86400000); }

function weeklySchedule() {
  const days = [...new Set(profile().days.map(Number))];
  const orderedDays = [1, 2, 3, 4, 5, 6, 0].filter(day => days.includes(day));
  const count = Math.max(3, orderedDays.length);
  const selected = [...sessionTemplates].sort((a, b) => a.priority - b.priority).slice(0, Math.min(6, count));
  const originalOrder = sessionTemplates.filter(item => selected.some(choice => choice.key === item.key));
  const assignments = {};
  orderedDays.slice(0, originalOrder.length).forEach((day, index) => assignments[day] = originalOrder[index]);
  return assignments;
}

function sessionForDate(date) {
  const template = weeklySchedule()[date.getDay()];
  if (!template) return { key: "recovery", name: "Recovery Day", purpose: "Recover, walk, and prepare for the next session" };
  return template;
}

function plannedFor(date = activeDate()) {
  const week = currentWeek(date);
  const progression = weeks[week - 1];
  const base = sessionForDate(date);
  const sections = [];
  if (["strengthA", "strengthB", "circuit"].includes(base.key)) sections.push(["Warm-up", warmup]);
  if (base.key === "strengthA") {
    sections.push(["Strength", strengthA], ["Finish", finishers]);
  } else if (base.key === "strengthB") {
    sections.push(["Strength", strengthB], ["Finish", finishers]);
  } else if (base.key === "zone2") {
    sections.push(["Conditioning", [
      ["Incline treadmill, bike, elliptical, or outdoor walk", `${progression[0]} min Zone 2`],
      ["Intensity", "Talk in short sentences; no gasping"],
      ["Incline target", `${Math.min(12, 3 + week)}% if form and heart rate stay controlled`]
    ]], ["Mobility", [["Calf and hip-flexor stretch", "2 × 30 sec"], ["Ankle rocks", "10 / side"]]]);
  } else if (base.key === "mobility") {
    sections.push(["Easy movement", [["Easy walk", "20–40 min"]]], ["Mobility", [
      ["Couch, calf, hamstring, figure-four stretches", "2 rounds"],
      ["Ankle rocks", "10 / side"], ["Deep squat hold", "30–45 sec"]
    ]]);
  } else if (base.key === "circuit") {
    sections.push(["Mountain circuit", circuit], ["Target", [["Rounds", `${progression[3]}`], ["Rest", "60–90 sec as needed"]]]);
  } else if (base.key === "long") {
    sections.push(["Hike / ruck", [
      ["Time on feet", progression[1]], ["Pack", progression[2]],
      ["Terrain", "Use hills when possible"], ["Rule", "Do not run with the pack"]
    ]], ["Finish", [["Feet, knees, and back check", "Record pain before adding load"], ["Calf and hip stretch", "5 min"]]]);
  } else {
    sections.push(["Recovery", [["Easy walk", "10–30 min optional"], ["Sleep and hydration", "Prioritize"], ["Mobility", "Only what feels restorative"]]]);
  }
  return { ...base, sections, week, progression, day: dayOffset(date) + 1 };
}

function navyBodyFat(checkin = latestCheckin()) {
  const p = profile();
  if (!checkin?.navel || !checkin?.neck || !p.heightIn) return null;
  return 86.01 * Math.log10(checkin.navel - checkin.neck) - 70.041 * Math.log10(p.heightIn) + 36.76;
}
function navyBodyFatAtNavel(navel, neck = latestCheckin().neck) {
  return 86.01 * Math.log10(navel - neck) - 70.041 * Math.log10(profile().heightIn) + 36.76;
}
function calculations() {
  const p = profile();
  const latest = latestCheckin();
  const bf = navyBodyFat(latest);
  const lean = bf == null ? latest.weight * .72 : latest.weight * (1 - bf / 100);
  const kg = latest.weight * 0.453592;
  const cm = p.heightIn * 2.54;
  const bmr = 10 * kg + 6.25 * cm - 5 * p.age + 5;
  const maintenance = Math.round((bmr * 1.5) / 50) * 50;
  return {
    bf, lean, maintenance,
    calories: Math.max(1600, Math.round((maintenance - 500) / 50) * 50),
    proteinLow: Math.round(lean * .8 / 5) * 5,
    proteinHigh: Math.round(lean / 5) * 5,
    ratio: latest.navel / p.heightIn
  };
}

function lastExercise(name) {
  return (state.exerciseHistory[name] || []).slice().sort((a, b) => b.date.localeCompare(a.date))[0];
}
function movementTarget(name, prescribed) {
  const last = lastExercise(name);
  if (!last?.weight) return prescribed;
  return `${last.weight}–${Number(last.weight) + 5} lb · ${prescribed.replace("×", "x")}`;
}
function movementHistoryText(name) {
  const history = (state.exerciseHistory[name] || []).slice().sort((a, b) => a.date.localeCompare(b.date));
  if (!history.length) return "No history yet. Log today’s weight and reps to create a baseline.";
  const last = history[0];
  const first = history.at(-1);
  const change = Number(last.weight || 0) - Number(first.weight || 0);
  return `Last: ${last.weight || "bodyweight"} lb × ${last.reps || "logged reps"}${history.length > 1 ? ` · Trend: ${change >= 0 ? "+" : ""}${change} lb across ${history.length} sessions` : ""}`;
}
function movementRows(items) {
  return items.map(([name, dose]) => {
    const key = encodeURIComponent(name);
    return `<details class="movement-row">
      <summary><div><strong>${name}</strong><small>${dose}</small></div><span>${movementTarget(name, dose)}</span></summary>
      <div class="movement-log">
        <label class="field"><span>Weight (lb)</span><input type="number" step="0.5" min="0" data-movement="${key}" data-kind="weight" /></label>
        <label class="field"><span>Best reps</span><input type="number" min="0" data-movement="${key}" data-kind="reps" /></label>
        <div class="movement-history">${movementHistoryText(name)}</div>
      </div>
    </details>`;
  }).join("");
}

function renderWorkoutSections(plan) {
  return plan.sections.map(([title, items]) => {
    const loggable = ["Strength", "Mountain circuit"].includes(title);
    return `<section class="workout-section"><h3>${title}</h3>${loggable ? movementRows(items) : exerciseList(items)}</section>`;
  }).join("");
}
function exerciseList(items) {
  return `<ul class="exercise-list">${items.map(([name, dose]) => `<li><strong>${name}</strong><span>${dose}</span></li>`).join("")}</ul>`;
}

function renderToday() {
  const date = activeDate();
  const plan = plannedFor(date);
  const id = dateKey(date);
  const log = state.workouts[id] || {};
  const before = localToday() < programStart();
  const after = localToday() > programEnd();
  document.querySelector("#dateLabel").textContent = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  document.querySelector("#phaseLabel").textContent = before
    ? `Your personalized plan begins ${programStart().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.`
    : after ? "Phase 1 complete. Review readiness before Phase 2." : `Week ${plan.week}, Day ${plan.day} · ${profile().hikingGoal}`;
  document.querySelector("#weekNumber").textContent = plan.week;
  document.querySelector("#weekRing").style.background = `conic-gradient(var(--lime) ${plan.week / 12 * 360}deg, var(--pine) 0)`;
  document.querySelector("#todayPurpose").textContent = `Today: Week ${plan.week}, Day ${plan.day}`;
  document.querySelector("#todayWorkout").textContent = plan.name;
  const status = document.querySelector("#todayStatus");
  status.textContent = log.completed ? "Completed" : "Planned";
  status.classList.toggle("done", !!log.completed);
  document.querySelector("#workoutContent").innerHTML = renderWorkoutSections(plan);
  document.querySelector("#ruckToday").innerHTML = plan.key === "long"
    ? `<div class="pace-note"><strong>Trail prescription:</strong> ${plan.progression[1]}, ${plan.progression[2]} pack. Log miles, elevation, pace, terrain, and pain in Check-in.</div>` : "";
  document.querySelector("#workoutNotes").value = log.notes || "";
  document.querySelector("#painInput").value = log.pain || 0;
  updatePain(log.pain || 0);
  document.querySelector("#completeWorkout").textContent = log.completed ? "Mark incomplete" : "Complete workout";
  const latest = latestCheckin();
  const calc = calculations();
  document.querySelector("#weightMetric").textContent = latest.weight.toFixed(1);
  document.querySelector("#bodyFatMetric").textContent = calc.bf == null ? "—" : `${calc.bf.toFixed(1)}%`;
  const readiness = readinessScore();
  document.querySelector("#adherenceMetric").textContent = `${readiness.components.adherence.score}%`;
  renderReadiness(readiness);
  renderWeekStrip(date);
  renderHabits(date);
}

function renderWeekStrip(date) {
  const monday = weekMonday(currentWeek(date));
  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  document.querySelector("#weekStrip").innerHTML = labels.map((label, i) => {
    const d = new Date(monday); d.setDate(d.getDate() + i);
    const done = state.workouts[dateKey(d)]?.completed;
    const session = sessionForDate(d);
    return `<div class="day-dot ${done ? "done" : ""} ${dateKey(d) === dateKey(date) ? "today" : ""}" title="${session.name}"><i>${done ? "✓" : d.getDate()}</i><span>${label}</span></div>`;
  }).join("");
}

function painAdvice(value) {
  const injuries = profile().injuries.toLowerCase();
  if (value >= 5) return "Red light: use the recovery session and stop any sharp or worsening movement.";
  if (injuries.includes("knee")) return value >= 3 ? "Yellow: swap lunges for controlled step-ups or leg press; reduce pack weight." : "Knee flag: keep step height controlled and monitor downhill pain.";
  if (injuries.includes("shin")) return value >= 3 ? "Yellow: replace running or stairs with cycling or easy incline walking." : "Shin flag: progress incline and duration gradually.";
  if (injuries.includes("back")) return value >= 3 ? "Yellow: avoid heavy hinges today; use supported rows and glute bridges." : "Back flag: brace, keep hinges light, and stop if symptoms spread.";
  return value <= 2 ? "Green light: train normally with clean form." : "Yellow light: reduce load or volume and choose the friendliest variation.";
}
function updatePain(value) {
  value = Number(value);
  document.querySelector("#painValue").textContent = `${value} / 10`;
  document.querySelector("#painGuidance").textContent = painAdvice(value);
  document.querySelector("#painGuidance").style.color = value <= 2 ? "var(--pine-2)" : value <= 4 ? "var(--amber)" : "var(--red)";
}

function renderPlan(block = 1) {
  const start = (block - 1) * 4;
  document.querySelector("#plan .section-heading .eyebrow").textContent =
    `${programStart().toLocaleDateString("en-US", { month: "long", day: "numeric" })} – ${programEnd().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
  document.querySelector("#planList").innerHTML = weeks.slice(start, start + 4).map((w, i) => {
    const n = start + i + 1;
    const focus = n <= 2 ? "Learn form and show up" : n <= 4 ? "Build rhythm" : n <= 6 ? "Add light load" : n <= 8 ? "Stronger legs" : n <= 10 ? "Mountain base" : "Finish sturdy";
    const monday = weekMonday(n);
    const days = Array.from({ length: 7 }, (_, dayIndex) => {
      const date = new Date(monday); date.setDate(date.getDate() + dayIndex);
      const plan = plannedFor(date);
      const label = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      return `<details class="plan-day"><summary><time>${label}</time><strong>${plan.name}</strong><span>›</span></summary>
        <div class="day-workout"><p>${plan.purpose}</p>${plan.sections.map(([title, items]) => `<p><strong>${title}</strong></p>${exerciseList(items)}`).join("")}</div></details>`;
    }).join("");
    return `<details class="plan-week ${n === currentWeek() ? "current" : ""}" ${n === currentWeek() ? "open" : ""}>
      <summary><div><strong>Week ${n}</strong><span>${focus}</span></div></summary>
      <div class="week-overview"><dl><dt>Zone 2</dt><dd>${w[0]} min</dd><dt>Friday circuit</dt><dd>${w[3]} rounds</dd><dt>Long session</dt><dd>${w[1]}</dd><dt>Pack</dt><dd>${w[2]}</dd></dl></div>
      <div class="week-days">${days}</div></details>`;
  }).join("");
}

function renderCheckins() {
  const form = document.querySelector("#checkinForm");
  const latest = latestCheckin();
  if (!form.elements.date.value) form.elements.date.value = dateKey(activeDate());
  ["weight", "navel", "neck", "waist", "chest", "hips", "thigh"].forEach(key => {
    if (!form.elements[key].value && latest[key]) form.elements[key].value = latest[key];
  });
  const list = [...state.checkins].sort((a, b) => b.date.localeCompare(a.date));
  document.querySelector("#checkinHistory").innerHTML = `<article class="card"><p class="eyebrow">Body history</p><h2>${list.length} check-in${list.length === 1 ? "" : "s"}</h2>${list.map(c => {
    const bf = navyBodyFat(c);
    return `<div class="history-card"><time>${dateAtNoon(c.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</time>
      <div><strong>${Number(c.weight).toFixed(1)} lb</strong><span>Navel ${c.navel || "—"}" · Neck ${c.neck || "—"}"</span></div>
      <strong>${bf == null ? "—" : `${bf.toFixed(1)}%`}</strong></div>`;
  }).join("")}</article>`;
  const ruckForm = document.querySelector("#ruckForm");
  if (!ruckForm.elements.date.value) ruckForm.elements.date.value = dateKey(activeDate());
  renderRucks();
}

function renderRucks() {
  const rucks = [...state.rucks].sort((a, b) => b.date.localeCompare(a.date));
  document.querySelector("#ruckHistory").innerHTML = `<article class="card"><p class="eyebrow">Ruck progression</p><h2>${rucks.length ? `${rucks.length} trail logs` : "Your first trail log starts here"}</h2>${rucks.map(r => {
    const pace = r.miles ? r.minutes / r.miles : 0;
    const maxPain = Math.max(r.feetPain || 0, r.kneePain || 0, r.backPain || 0);
    return `<div class="history-card"><time>${dateAtNoon(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</time>
      <div><strong>${r.miles} mi · ${r.packWeight} lb</strong><span>${r.elevation || 0} ft · ${pace.toFixed(1)} min/mi · ${r.terrain}</span></div><strong>${maxPain}/10</strong></div>`;
  }).join("")}</article>`;
}

function renderProgress() {
  const c = calculations();
  const readiness = readinessScore();
  document.querySelector("#progressReadiness").textContent = readiness.total;
  document.querySelector("#progressTitle").textContent = readiness.title;
  document.querySelector("#scoreBreakdown").innerHTML = Object.values(readiness.components)
    .map(item => `<div class="score-component"><span>${item.label}</span><strong>${item.points}/${item.max}</strong></div>`).join("");
  document.querySelector("#currentBf").textContent = c.bf == null ? "—" : `${c.bf.toFixed(1)}%`;
  document.querySelector("#leanMass").textContent = `${c.lean.toFixed(1)} lb`;
  document.querySelector("#waistHeight").textContent = c.ratio.toFixed(2);
  document.querySelector("#calorieTarget").textContent = `${c.calories.toLocaleString()} kcal`;
  document.querySelector("#proteinTarget").textContent = `${c.proteinLow}–${c.proteinHigh} g`;
  document.querySelector("#maintenanceTarget").textContent = `~${c.maintenance.toLocaleString()} kcal`;
  const latest = latestCheckin();
  document.querySelector("#projectionList").innerHTML = [["Conservative", .5], ["Moderate", 1], ["Ambitious", 1.5]].map(([label, rate]) =>
    `<div class="projection"><span>${label}</span><strong>${(latest.weight - rate * 12).toFixed(0)} lb</strong><small>${rate} lb/week average</small></div>`).join("");
  renderClothingEstimates(c);
  renderChart();
}

function weightAtNavel(navel, leanMass) {
  const targetBf = navyBodyFatAtNavel(navel);
  return leanMass / (1 - targetBf / 100);
}
function rangeForNavels(navels, leanMass) {
  const values = navels.map(navel => weightAtNavel(navel, leanMass)).sort((a, b) => a - b);
  return `${Math.round(values[0])}–${Math.round(values.at(-1))} lb`;
}
function renderClothingEstimates(calc) {
  const latest = latestCheckin();
  if (!latest.navel || !latest.neck || !latest.waist) {
    document.querySelector("#shirtEstimate").textContent = "Add neck, navel, and waist measurements to calculate a range.";
    document.querySelector("#pantsEstimate").textContent = "Add neck, navel, and waist measurements to calculate a range.";
    document.querySelector("#clothingMethod").textContent = "Ranges require circumference measurements and remain estimates.";
    return;
  }
  const shirtRange = rangeForNavels([38, 40], calc.lean);
  const pantNavels = [31, 32].map(target => latest.navel - (latest.waist - target));
  const pantsRange = rangeForNavels(pantNavels, calc.lean);
  document.querySelector("#shirtEstimate").innerHTML = `Approximate range: <strong>${shirtRange}</strong>, modeling a 38–40 in navel while retaining current estimated lean mass.`;
  document.querySelector("#pantsEstimate").innerHTML = `Approximate range: <strong>${pantsRange}</strong>, modeling a 31–32 in body waist for a tagged size 30.`;
  document.querySelector("#clothingMethod").textContent = `Method: Navy body-fat estimate → lean mass (${calc.lean.toFixed(1)} lb) → projected body fat from target navel → weight = lean mass ÷ (1 − body-fat fraction). Brand cut and fat distribution can move the result.`;
}
function renderChart() {
  const items = [...state.checkins].sort((a, b) => a.date.localeCompare(b.date));
  if (items.length < 2) {
    document.querySelector("#trendChart").innerHTML = `<div class="empty-chart"><strong>Your trend starts next check-in.</strong><p>One honest data point at a time.</p></div>`;
    return;
  }
  const weights = items.map(i => i.weight), navels = items.map(i => i.navel).filter(Boolean);
  const wMin = Math.min(...weights) - 2, wMax = Math.max(...weights) + 2;
  const nMin = Math.min(...navels) - 1, nMax = Math.max(...navels) + 1;
  document.querySelector("#trendChart").innerHTML = items.map(i => {
    const wh = 35 + (i.weight - wMin) / Math.max(1, wMax - wMin) * 105;
    const nh = i.navel ? 35 + (i.navel - nMin) / Math.max(1, nMax - nMin) * 105 : 0;
    return `<div class="chart-column"><div class="chart-bars"><i class="bar" style="height:${wh}px" title="${i.weight} lb"></i>${i.navel ? `<i class="bar navel" style="height:${nh}px" title='${i.navel}" navel'></i>` : ""}</div><small>${i.date.slice(5)}</small></div>`;
  }).join("");
}

function currentWeekDates() {
  const start = weekMonday(currentWeek());
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return dateKey(d); });
}
function readinessScore() {
  const dates = currentWeekDates();
  const scheduled = dates.filter(key => sessionForDate(dateAtNoon(key)).key !== "recovery");
  const completed = scheduled.filter(key => state.workouts[key]?.completed);
  const adherenceRatio = completed.length / Math.max(1, scheduled.length);
  const cardioTarget = plannedFor(dates.map(dateAtNoon).find(d => sessionForDate(d).key === "zone2") || activeDate()).progression[0];
  const cardioDone = completed.reduce((sum, key) => sum + Number(state.workouts[key]?.cardioMinutes || (sessionForDate(dateAtNoon(key)).key === "zone2" ? cardioTarget : 0)), 0);
  const weekRucks = state.rucks.filter(r => dates.includes(r.date));
  const strengthEntries = Object.values(state.exerciseHistory).flat().filter(entry => dates.includes(entry.date));
  const checkins = [...state.checkins].sort((a, b) => a.date.localeCompare(b.date));
  const weightChange = checkins.length > 1 ? checkins[0].weight - checkins.at(-1).weight : 0;
  const painValues = completed.map(key => Number(state.workouts[key]?.pain || 0)).concat(weekRucks.flatMap(r => [r.feetPain || 0, r.kneePain || 0, r.backPain || 0]));
  const avgPain = painValues.length ? painValues.reduce((a, b) => a + b, 0) / painValues.length : 0;
  const incline = completed.some(key => ["zone2", "long"].includes(sessionForDate(dateAtNoon(key)).key));
  const components = {
    adherence: { label: "Training completion", max: 25, points: Math.round(adherenceRatio * 25), score: Math.round(adherenceRatio * 100) },
    cardio: { label: "Zone 2 cardio", max: 20, points: Math.min(20, Math.round(cardioDone / Math.max(1, cardioTarget) * 20)) },
    ruck: { label: "Long hike / ruck", max: 15, points: weekRucks.length ? 15 : completed.some(key => sessionForDate(dateAtNoon(key)).key === "long") ? 12 : 0 },
    strength: { label: "Leg strength logging", max: 15, points: Math.min(15, strengthEntries.length * 3) },
    weight: { label: "Weight trend", max: 10, points: checkins.length < 2 ? 0 : Math.max(0, Math.min(10, Math.round(5 + weightChange * 2))) },
    pain: { label: "Pain management", max: 10, points: painValues.length ? Math.max(0, Math.round(10 - avgPain * 1.5)) : 0 },
    incline: { label: "Incline / stair work", max: 5, points: incline ? 5 : 0 }
  };
  const total = Object.values(components).reduce((sum, item) => sum + item.points, 0);
  const titles = total >= 90 ? "Rainier Ready" : total >= 75 ? "Summit Weapon" : total >= 60 ? "Alpine Engine" : total >= 45 ? "Pack Mule" : total >= 25 ? "Trail Dog" : "Base Camp Builder";
  return { total, title: titles, components, avgPain };
}
function renderReadiness(result) {
  document.querySelector("#readinessScore").textContent = result.total;
  document.querySelector("#readinessRing").style.background = `conic-gradient(var(--lime) ${result.total * 3.6}deg, rgba(255,255,255,.13) 0)`;
  document.querySelector("#beastTitle").textContent = result.title;
  document.querySelector("#readinessMessage").textContent = result.total < 25 ? "Complete today’s prescription to start building your engine." : `This week: ${result.components.adherence.score}% adherence · pain average ${result.avgPain.toFixed(1)}/10.`;
}

function habitStreak(name) {
  let streak = 0;
  const cursor = new Date(activeDate());
  for (let i = 0; i < 365; i++) {
    if (state.habits[dateKey(cursor)]?.[name]) streak++;
    else if (i > 0) break;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
function trainingStreak() {
  const keys = Object.keys(state.workouts).filter(key => state.workouts[key].completed).sort().reverse();
  return keys.length;
}
function renderHabits(date) {
  const key = dateKey(date);
  const day = state.habits[key] || {};
  document.querySelectorAll("[data-habit]").forEach(input => input.checked = !!day[input.dataset.habit]);
  document.querySelector("#nutritionNote").value = day.note || "";
  document.querySelector("#streakRow").innerHTML = [
    ["Training", trainingStreak()], ["Protein", habitStreak("protein")],
    ["Mobility", habitStreak("mobility")], ["Saturday hike", state.rucks.length]
  ].map(([label, count]) => `<span class="streak-chip">${label}: ${count}</span>`).join("");
}

function showOnboarding(edit = false) {
  const form = document.querySelector("#onboardingForm");
  const p = profile();
  form.elements.heightIn.value = p.heightIn;
  form.elements.weight.value = latestCheckin().weight || p.weight;
  form.elements.goalWeight.value = p.goalWeight || "";
  form.elements.goalComposition.value = p.goalComposition || "";
  form.elements.gymAccess.value = p.gymAccess;
  form.elements.hikingGoal.value = p.hikingGoal;
  form.elements.startDate.value = p.startDate;
  form.elements.injuries.value = p.injuries || "";
  form.querySelectorAll('input[name="days"]').forEach(input => input.checked = p.days.includes(Number(input.value)));
  document.querySelector("#onboarding").hidden = false;
  document.querySelector("#onboarding").dataset.edit = edit ? "true" : "false";
}

function navigate(target) {
  document.querySelectorAll(".view").forEach(v => v.classList.toggle("active", v.dataset.view === target));
  document.querySelectorAll(".bottom-nav a").forEach(a => a.classList.toggle("active", a.dataset.target === target));
  if (target === "today") renderToday();
  if (target === "checkin") renderCheckins();
  if (target === "progress") renderProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function toast(message) {
  const el = document.querySelector("#toast");
  el.textContent = message; el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2200);
}
function healthSummaryText(health) {
  if (!health) return "No Apple Health file imported yet.";
  const count = Object.values(health.counts || {}).reduce((sum, value) => sum + value, 0);
  const vo2 = health.latest?.HKQuantityTypeIdentifierVO2Max;
  const resting = health.latest?.HKQuantityTypeIdentifierRestingHeartRate;
  const readings = [vo2 ? `VO₂ max ${vo2.value}` : "", resting ? `resting HR ${resting.value}` : ""].filter(Boolean);
  return `${count.toLocaleString()} relevant records from ${health.fileName}${readings.length ? `; latest ${readings.join(", ")}` : ""}.`;
}

document.querySelector("#onboardingForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  const days = [...event.currentTarget.querySelectorAll('input[name="days"]:checked')].map(input => Number(input.value));
  if (days.length < 3) return toast("Choose at least three available training days");
  state.setup = {
    ...profile(),
    heightIn: Number(data.heightIn), weight: Number(data.weight), goalWeight: Number(data.goalWeight) || null,
    goalComposition: data.goalComposition.trim(), gymAccess: data.gymAccess, hikingGoal: data.hikingGoal,
    injuries: data.injuries.trim() || "None", startDate: data.startDate, days, completed: true
  };
  const latest = latestCheckin();
  if (Number(data.weight) !== Number(latest.weight)) {
    state.checkins.push({ ...latest, date: data.startDate, weight: Number(data.weight), notes: "Onboarding starting weight" });
  }
  saveState();
  document.querySelector("#onboarding").hidden = true;
  renderAll();
  toast("Your personalized plan is ready");
});

document.querySelectorAll(".bottom-nav a").forEach(a => a.addEventListener("click", event => {
  event.preventDefault(); history.replaceState(null, "", a.hash); navigate(a.dataset.target);
}));
document.querySelectorAll("#blockTabs button").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll("#blockTabs button").forEach(b => b.classList.toggle("active", b === button));
  renderPlan(Number(button.dataset.block));
}));
document.querySelector("#painInput").addEventListener("input", event => updatePain(event.target.value));
document.querySelector("#completeWorkout").addEventListener("click", () => {
  const id = dateKey(activeDate());
  const previous = state.workouts[id] || {};
  const plan = plannedFor();
  const exerciseLogs = {};
  document.querySelectorAll("[data-movement]").forEach(input => {
    const name = decodeURIComponent(input.dataset.movement);
    exerciseLogs[name] ??= {};
    exerciseLogs[name][input.dataset.kind] = input.value;
  });
  if (!previous.completed) {
    Object.entries(exerciseLogs).forEach(([name, values]) => {
      if (!values.weight && !values.reps) return;
      state.exerciseHistory[name] ??= [];
      state.exerciseHistory[name].push({ date: id, weight: Number(values.weight) || 0, reps: Number(values.reps) || 0 });
    });
  }
  state.workouts[id] = {
    ...previous, completed: !previous.completed, type: plan.key,
    cardioMinutes: plan.key === "zone2" ? plan.progression[0] : previous.cardioMinutes || 0,
    notes: document.querySelector("#workoutNotes").value.trim(),
    pain: Number(document.querySelector("#painInput").value), exercises: exerciseLogs
  };
  saveState(); renderToday(); toast(state.workouts[id].completed ? "Workout completed" : "Workout reopened");
});
document.querySelector("#workoutNotes").addEventListener("change", event => {
  const id = dateKey(activeDate());
  state.workouts[id] = { ...(state.workouts[id] || {}), notes: event.target.value.trim(), pain: Number(document.querySelector("#painInput").value) };
  saveState();
});
document.querySelector("#habitGrid").addEventListener("change", event => {
  if (!event.target.dataset.habit) return;
  const key = dateKey(activeDate());
  state.habits[key] ??= {};
  state.habits[key][event.target.dataset.habit] = event.target.checked;
  saveState(); renderHabits(activeDate());
});
document.querySelector("#nutritionNote").addEventListener("change", event => {
  const key = dateKey(activeDate());
  state.habits[key] ??= {};
  state.habits[key].note = event.target.value.trim();
  saveState();
});
document.querySelector("#checkinForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  ["weight", "navel", "neck", "waist", "chest", "hips", "thigh"].forEach(key => data[key] = Number(data[key]) || null);
  const existing = state.checkins.findIndex(c => c.date === data.date);
  if (existing >= 0) state.checkins[existing] = data; else state.checkins.push(data);
  saveState(); renderCheckins(); renderToday(); toast("Check-in saved locally");
});
document.querySelector("#ruckForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  ["packWeight", "miles", "elevation", "minutes", "difficulty", "feetPain", "kneePain", "backPain"].forEach(key => data[key] = Number(data[key]) || 0);
  const existing = state.rucks.findIndex(r => r.date === data.date);
  if (existing >= 0) state.rucks[existing] = data; else state.rucks.push(data);
  saveState(); renderRucks(); renderToday(); toast("Hike / ruck saved");
});

const dialog = document.querySelector("#settingsDialog");
document.querySelector("#settingsButton").addEventListener("click", () => dialog.showModal());
document.querySelector("#closeSettings").addEventListener("click", () => dialog.close());
document.querySelector("#editProfile").addEventListener("click", () => { dialog.close(); showOnboarding(true); });
document.querySelector("#exportData").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify({ version: 2, exportedAt: new Date().toISOString(), state }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a");
  a.href = url; a.download = `mountain-beast-backup-${dateKey(localToday())}.json`; a.click(); URL.revokeObjectURL(url);
  toast("Private backup exported");
});
document.querySelector("#importData").addEventListener("change", async event => {
  const file = event.target.files[0]; if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    if (!parsed.state?.checkins || !parsed.state?.workouts) throw new Error();
    state = migrate(parsed.state); saveState(); renderAll(); dialog.close(); toast("Backup restored");
  } catch { toast("That backup file is not valid"); }
  event.target.value = "";
});
document.querySelector("#healthImport").addEventListener("change", async event => {
  const file = event.target.files[0]; if (!file) return;
  const summary = document.querySelector("#healthImportSummary");
  summary.textContent = "Reading Apple Health records…";
  try {
    const xml = await file.text();
    const documentXml = new DOMParser().parseFromString(xml, "application/xml");
    if (documentXml.querySelector("parsererror") || !documentXml.querySelector("HealthData")) throw new Error();
    const wanted = [
      "HKQuantityTypeIdentifierVO2Max", "HKQuantityTypeIdentifierRestingHeartRate", "HKQuantityTypeIdentifierHeartRate",
      "HKQuantityTypeIdentifierStepCount", "HKQuantityTypeIdentifierActiveEnergyBurned",
      "HKQuantityTypeIdentifierAppleExerciseTime", "HKCategoryTypeIdentifierSleepAnalysis"
    ];
    const counts = {}, latest = {};
    documentXml.querySelectorAll("Record").forEach(record => {
      const type = record.getAttribute("type");
      if (!wanted.includes(type)) return;
      counts[type] = (counts[type] || 0) + 1;
      const endDate = record.getAttribute("endDate") || "";
      if (!latest[type] || endDate > latest[type].endDate) latest[type] = { value: record.getAttribute("value"), unit: record.getAttribute("unit"), endDate };
    });
    state.healthImport = { fileName: file.name, importedAt: new Date().toISOString(), counts, latest };
    saveState(); summary.textContent = healthSummaryText(state.healthImport); toast("Apple Health import complete");
  } catch {
    summary.textContent = "Could not read that file. Choose apple_health_export/export.xml.";
    toast("Apple Health import failed");
  }
  event.target.value = "";
});
document.querySelector("#resetData").addEventListener("click", () => {
  if (!confirm("Reset every local profile, check-in, workout, habit, and trail log on this device?")) return;
  state = initialState(); saveState(); dialog.close(); renderAll(); showOnboarding(); toast("Local data reset");
});

function renderAll() {
  renderToday(); renderPlan(); renderCheckins(); renderProgress();
  const target = location.hash.slice(1);
  navigate(["today", "plan", "checkin", "progress"].includes(target) ? target : "today");
  document.querySelector("#healthImportSummary").textContent = healthSummaryText(state.healthImport);
  if (!state.setup?.completed) showOnboarding();
}

if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("./sw.js");
renderAll();
