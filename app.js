const PROGRAM_START = new Date("2026-06-15T12:00:00");
const PROGRAM_END = new Date("2026-09-06T12:00:00");
const STORAGE_KEY = "mountain-beast-v1";

const profile = {
  age: 31,
  sex: "male",
  heightIn: 65,
  startWeight: 190,
  measurements: { navel: 42, neck: 18.5, waist: 37.5, chest: 44, hips: 41, thigh: 23 }
};

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
const warmup = [
  ["Easy walk or bike", "3–5 min"],
  ["Hip circles", "10 each way"],
  ["Bodyweight good mornings", "10"],
  ["Air squats", "10"],
  ["Reverse lunges", "5 / leg"],
  ["Calf raises", "15–20"],
  ["Dead bugs", "6–8 / side"]
];

const weeks = [
  [25, "45–60 min", "0–5 lb", 3], [30, "45–60 min", "0–5 lb", 3],
  [30, "60–75 min", "5–10 lb", 3], [35, "60–75 min", "5–10 lb", 3],
  [35, "75–90 min", "10–15 lb", 3], [40, "75–90 min", "10–15 lb", 3],
  [40, "90–100 min", "10–15 lb", 4], [45, "90–100 min", "10–15 lb", 4],
  [45, "100–110 min", "15–20 lb", 4], [50, "100–110 min", "15–20 lb", 4],
  [50, "110–120 min", "20–25 lb", 4], [60, "110–120 min", "20–25 lb", 4]
];

const dayPlan = [
  { name: "Strength A", purpose: "Legs · hinge · push/pull · carries", exercises: strengthA, warmup: true },
  { name: "Zone 2 Cardio", purpose: "Build the diesel engine", dynamic: "cardio" },
  { name: "Strength B", purpose: "Hinge · single-leg · pull/press · core", exercises: strengthB, warmup: true },
  { name: "Mobility + Easy Walk", purpose: "Knee, hip, and ankle insurance", exercises: [
    ["Easy walk", "20–40 min"], ["Couch, calf, hamstring, figure-four stretches", "2 rounds"],
    ["Ankle rocks", "10 / side"], ["Deep squat hold", "30–45 sec"]
  ]},
  { name: "Mountain Circuit", purpose: "Camp strength + conditioning", exercises: circuit, dynamic: "circuit" },
  { name: "Long Walk / Hike / Ruck", purpose: "Time on feet + pack tolerance", dynamic: "long" },
  { name: "Rest", purpose: "Recover and absorb training", exercises: [["Easy movement", "Optional"], ["Sleep and hydration", "Prioritize"]] }
];

function initialState() {
  return {
    checkins: [{
      date: "2026-06-15", weight: 190, navel: 42, neck: 18.5, waist: 37.5,
      chest: 44, hips: 41, thigh: 23, notes: "Starting measurements"
    }],
    workouts: {},
    healthImport: null
  };
}

let state = loadState();

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || initialState(); }
  catch { return initialState(); }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function dateKey(date) { return date.toISOString().slice(0, 10); }
function localToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
}
function activeDate() {
  const today = localToday();
  if (today < PROGRAM_START) return PROGRAM_START;
  if (today > PROGRAM_END) return PROGRAM_END;
  return today;
}
function programDay(date = activeDate()) {
  return Math.max(0, Math.min(83, Math.round((date - PROGRAM_START) / 86400000)));
}
function currentWeek(date = activeDate()) { return Math.min(12, Math.floor(programDay(date) / 7) + 1); }
function currentDay(date = activeDate()) { return programDay(date) % 7; }
function latestCheckin() {
  return [...state.checkins].sort((a, b) => a.date.localeCompare(b.date)).at(-1);
}
function navyBodyFat(checkin = latestCheckin()) {
  if (!checkin?.navel || !checkin?.neck) return null;
  return 86.01 * Math.log10(checkin.navel - checkin.neck) - 70.041 * Math.log10(profile.heightIn) + 36.76;
}
function navyBodyFatAtNavel(navel, neck = latestCheckin().neck) {
  return 86.01 * Math.log10(navel - neck) - 70.041 * Math.log10(profile.heightIn) + 36.76;
}
function calculations() {
  const latest = latestCheckin();
  const bf = navyBodyFat(latest);
  const lean = latest.weight * (1 - bf / 100);
  const kg = latest.weight * 0.453592;
  const cm = profile.heightIn * 2.54;
  const bmr = 10 * kg + 6.25 * cm - 5 * profile.age + 5;
  const maintenance = Math.round((bmr * 1.5) / 50) * 50;
  return {
    bf, lean, maintenance,
    calories: Math.max(1600, Math.round((maintenance - 500) / 50) * 50),
    proteinLow: Math.round(lean * 0.8 / 5) * 5,
    proteinHigh: Math.round(lean / 5) * 5,
    ratio: latest.navel / profile.heightIn
  };
}
function plannedFor(date = activeDate()) {
  const week = currentWeek(date);
  const day = currentDay(date);
  const base = dayPlan[day];
  const progression = weeks[week - 1];
  let exercises = base.exercises ? [...base.exercises] : [];
  if (base.dynamic === "cardio") exercises = [
    ["Incline walk, outdoor walk, bike, elliptical, or easy stairs", `${progression[0]} min`],
    ["Effort", "Talk in short sentences; no gasping"]
  ];
  if (base.dynamic === "circuit") exercises = [...circuit, ["Rounds", `${progression[3]}`]];
  if (base.dynamic === "long") exercises = [
    ["Time on feet", progression[1]], ["Pack", progression[2]],
    ["Rule", "Do not run with the pack"], ["If knees hurt", "Reduce load before time"]
  ];
  return { ...base, exercises, week, day, progression };
}
function workoutId(date = activeDate()) { return dateKey(date); }

function renderToday() {
  const date = activeDate();
  const plan = plannedFor(date);
  const id = workoutId(date);
  const log = state.workouts[id] || {};
  const before = localToday() < PROGRAM_START;
  const after = localToday() > PROGRAM_END;
  document.querySelector("#dateLabel").textContent = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  document.querySelector("#phaseLabel").textContent = before ? "Your program begins June 15, 2026." : after ? "Phase 1 complete. Time for the Week 12 test." : `Day ${programDay(date) + 1} of 84 · Phase 1`;
  document.querySelector("#weekNumber").textContent = plan.week;
  document.querySelector("#weekRing").style.background = `conic-gradient(var(--lime) ${plan.week / 12 * 360}deg, var(--pine) 0)`;
  document.querySelector("#todayPurpose").textContent = plan.purpose;
  document.querySelector("#todayWorkout").textContent = plan.name;
  const status = document.querySelector("#todayStatus");
  status.textContent = log.completed ? "Completed" : "Planned";
  status.classList.toggle("done", !!log.completed);
  let html = "";
  if (plan.warmup) {
    html += `<details><summary>Warm-up before lifting</summary>${exerciseList(warmup)}</details>`;
  }
  html += exerciseList(plan.exercises);
  document.querySelector("#workoutContent").innerHTML = html;
  document.querySelector("#workoutNotes").value = log.notes || "";
  document.querySelector("#painInput").value = log.pain || 0;
  updatePain(log.pain || 0);
  document.querySelector("#completeWorkout").textContent = log.completed ? "Mark incomplete" : "Complete workout";

  const latest = latestCheckin();
  const calc = calculations();
  document.querySelector("#weightMetric").textContent = latest.weight.toFixed(1);
  document.querySelector("#bodyFatMetric").textContent = `${calc.bf.toFixed(1)}%`;
  const plannedDays = Math.max(1, Math.min(72, programDay(date) + Math.min(plan.day + 1, 6)));
  const completed = Object.values(state.workouts).filter(w => w.completed).length;
  document.querySelector("#adherenceMetric").textContent = `${Math.round(completed / plannedDays * 100)}%`;
  renderWeekStrip(date);
}

function exerciseList(items) {
  return `<ul class="exercise-list">${items.map(([name, dose]) => `<li><strong>${name}</strong><span>${dose}</span></li>`).join("")}</ul>`;
}

function renderWeekStrip(date) {
  const monday = new Date(PROGRAM_START);
  monday.setDate(monday.getDate() + (currentWeek(date) - 1) * 7);
  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  document.querySelector("#weekStrip").innerHTML = labels.map((label, i) => {
    const d = new Date(monday); d.setDate(d.getDate() + i);
    const done = state.workouts[dateKey(d)]?.completed;
    return `<div class="day-dot ${done ? "done" : ""} ${dateKey(d) === dateKey(date) ? "today" : ""}"><i>${done ? "✓" : d.getDate()}</i><span>${label}</span></div>`;
  }).join("");
}

function updatePain(value) {
  value = Number(value);
  document.querySelector("#painValue").textContent = `${value} / 10`;
  const guidance = value <= 2 ? "Green light: form stays normal." : value <= 4 ? "Yellow light: lower the step, lighten the pack, or choose bike over stairs." : "Red light: stop the painful movement. Sharp pain, swelling, or limping needs attention.";
  document.querySelector("#painGuidance").textContent = guidance;
  document.querySelector("#painGuidance").style.color = value <= 2 ? "var(--pine-2)" : value <= 4 ? "var(--amber)" : "var(--red)";
}

function renderPlan(block = 1) {
  const start = (block - 1) * 4;
  document.querySelector("#planList").innerHTML = weeks.slice(start, start + 4).map((w, i) => {
    const n = start + i + 1;
    const blockFocus = n <= 2 ? "Learn form and show up" : n <= 4 ? "Build rhythm" : n <= 6 ? "Add light load" : n <= 8 ? "Stronger legs" : n <= 10 ? "Mountain base" : "Finish sturdy";
    const monday = new Date(PROGRAM_START);
    monday.setDate(monday.getDate() + (n - 1) * 7);
    const days = dayPlan.map((_, dayIndex) => {
      const date = new Date(monday);
      date.setDate(date.getDate() + dayIndex);
      const plan = plannedFor(date);
      const dateLabel = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      return `<details class="plan-day">
        <summary><time>${dateLabel}</time><strong>${plan.name}</strong><span>›</span></summary>
        <div class="day-workout"><p>${plan.purpose}</p>${plan.warmup ? `<p><strong>Warm-up:</strong> 3–5 minutes plus the movement sequence.</p>` : ""}${exerciseList(plan.exercises)}</div>
      </details>`;
    }).join("");
    return `<details class="plan-week ${n === currentWeek() ? "current" : ""}" ${n === currentWeek() ? "open" : ""}>
      <summary><div><strong>Week ${n}</strong><span>${blockFocus}</span></div></summary>
      <div class="week-overview"><dl><dt>Zone 2</dt><dd>${w[0]} min</dd><dt>Friday</dt><dd>${w[3]} rounds</dd><dt>Long walk</dt><dd>${w[1]}</dd><dt>Pack</dt><dd>${w[2]}</dd></dl></div>
      <div class="week-days">${days}</div>
    </details>`;
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
  document.querySelector("#checkinHistory").innerHTML = `<article class="card"><p class="eyebrow">History</p><h2>${list.length} check-in${list.length === 1 ? "" : "s"}</h2>${list.map(c => `
    <div class="history-card"><time>${new Date(`${c.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</time>
    <div><strong>${c.weight.toFixed(1)} lb</strong><span>Navel ${c.navel}" · Neck ${c.neck}"</span></div>
    <strong>${navyBodyFat(c).toFixed(1)}%</strong></div>`).join("")}</article>`;
}

function renderProgress() {
  const c = calculations();
  document.querySelector("#currentBf").textContent = `${c.bf.toFixed(1)}%`;
  document.querySelector("#leanMass").textContent = `${c.lean.toFixed(1)} lb`;
  document.querySelector("#waistHeight").textContent = c.ratio.toFixed(2);
  document.querySelector("#calorieTarget").textContent = `${c.calories.toLocaleString()} kcal`;
  document.querySelector("#proteinTarget").textContent = `${c.proteinLow}–${c.proteinHigh} g`;
  document.querySelector("#maintenanceTarget").textContent = `~${c.maintenance.toLocaleString()} kcal`;
  const latest = latestCheckin();
  const projections = [
    ["Conservative", .5], ["Moderate", 1], ["Ambitious", 1.5]
  ];
  document.querySelector("#projectionList").innerHTML = projections.map(([label, rate]) => {
    const end = latest.weight - rate * 12;
    return `<div class="projection"><span>${label}</span><strong>${end.toFixed(0)} lb</strong><small>${rate} lb/week average</small></div>`;
  }).join("");
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
  const shirtRange = rangeForNavels([38, 40], calc.lean);
  const inferredPantNavels = [31, 32].map(targetWaist => latest.navel - (latest.waist - targetWaist));
  const pantsRange = rangeForNavels(inferredPantNavels, calc.lean);
  document.querySelector("#shirtEstimate").innerHTML = `Approximate weight range: <strong>${shirtRange}</strong>, using a 38–40 in navel target while retaining estimated lean mass. Chest fit must also approach the garment chart.`;
  document.querySelector("#pantsEstimate").innerHTML = `Approximate weight range: <strong>${pantsRange}</strong>, modeling a 31–32 in body-waist range for tagged size 30 and a similar reduction at the navel.`;
  document.querySelector("#clothingMethod").textContent = `Method: current Navy body-fat estimate → estimated lean mass (${calc.lean.toFixed(1)} lb) → target body fat from projected navel size → target weight = lean mass ÷ (1 − target body-fat fraction). Clothing cut, muscle gain, fat distribution, and brand sizing can shift these ranges substantially.`;
}

function renderChart() {
  const items = [...state.checkins].sort((a, b) => a.date.localeCompare(b.date));
  if (items.length < 2) {
    document.querySelector("#trendChart").innerHTML = `<div class="empty-chart"><strong>Your trend starts next check-in.</strong><p>One honest data point at a time.</p></div>`;
    return;
  }
  const weights = items.map(i => i.weight), navels = items.map(i => i.navel);
  const wMin = Math.min(...weights) - 2, wMax = Math.max(...weights) + 2;
  const nMin = Math.min(...navels) - 1, nMax = Math.max(...navels) + 1;
  document.querySelector("#trendChart").innerHTML = items.map(i => {
    const wh = 35 + (i.weight - wMin) / Math.max(1, wMax - wMin) * 105;
    const nh = 35 + (i.navel - nMin) / Math.max(1, nMax - nMin) * 105;
    return `<div class="chart-column"><div class="chart-bars"><i class="bar" style="height:${wh}px" title="${i.weight} lb"></i><i class="bar navel" style="height:${nh}px" title='${i.navel}" navel'></i></div><small>${i.date.slice(5)}</small></div>`;
  }).join("");
}

function navigate(target) {
  document.querySelectorAll(".view").forEach(v => v.classList.toggle("active", v.dataset.view === target));
  document.querySelectorAll(".bottom-nav a").forEach(a => a.classList.toggle("active", a.dataset.target === target));
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
  const readings = [
    vo2 ? `latest VO₂ max ${vo2.value} ${vo2.unit || ""}`.trim() : "",
    resting ? `resting heart rate ${resting.value} ${resting.unit || "bpm"}`.trim() : ""
  ].filter(Boolean);
  return `${count.toLocaleString()} relevant records stored locally from ${health.fileName}${readings.length ? `; ${readings.join(", ")}` : ""}. Imported ${new Date(health.importedAt).toLocaleDateString()}.`;
}

document.querySelectorAll(".bottom-nav a").forEach(a => a.addEventListener("click", e => {
  e.preventDefault(); history.replaceState(null, "", a.hash); navigate(a.dataset.target);
}));
document.querySelectorAll("#blockTabs button").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll("#blockTabs button").forEach(b => b.classList.toggle("active", b === button));
  renderPlan(Number(button.dataset.block));
}));
document.querySelector("#painInput").addEventListener("input", e => updatePain(e.target.value));
document.querySelector("#completeWorkout").addEventListener("click", () => {
  const id = workoutId();
  const previous = state.workouts[id] || {};
  state.workouts[id] = {
    ...previous, completed: !previous.completed,
    notes: document.querySelector("#workoutNotes").value.trim(),
    pain: Number(document.querySelector("#painInput").value)
  };
  saveState(); renderToday(); toast(state.workouts[id].completed ? "Workout completed" : "Workout reopened");
});
document.querySelector("#workoutNotes").addEventListener("change", e => {
  const id = workoutId(); state.workouts[id] = { ...(state.workouts[id] || {}), notes: e.target.value.trim(), pain: Number(document.querySelector("#painInput").value) };
  saveState();
});
document.querySelector("#checkinForm").addEventListener("submit", e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.currentTarget));
  ["weight", "navel", "neck", "waist", "chest", "hips", "thigh"].forEach(k => data[k] = Number(data[k]) || null);
  const existing = state.checkins.findIndex(c => c.date === data.date);
  if (existing >= 0) state.checkins[existing] = data; else state.checkins.push(data);
  saveState(); renderCheckins(); renderToday(); toast("Check-in saved locally");
});

const dialog = document.querySelector("#settingsDialog");
document.querySelector("#settingsButton").addEventListener("click", () => dialog.showModal());
document.querySelector("#closeSettings").addEventListener("click", () => dialog.close());
document.querySelector("#exportData").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), state }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a");
  a.href = url; a.download = `mountain-beast-backup-${dateKey(localToday())}.json`; a.click(); URL.revokeObjectURL(url);
  toast("Backup exported");
});
document.querySelector("#importData").addEventListener("change", async e => {
  const file = e.target.files[0]; if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    if (!parsed.state?.checkins || !parsed.state?.workouts) throw new Error();
    state = parsed.state; saveState(); renderAll(); dialog.close(); toast("Backup restored");
  } catch { toast("That backup file is not valid"); }
  e.target.value = "";
});
document.querySelector("#healthImport").addEventListener("change", async e => {
  const file = e.target.files[0];
  if (!file) return;
  const summary = document.querySelector("#healthImportSummary");
  summary.textContent = "Reading Apple Health records…";
  try {
    const xml = await file.text();
    const documentXml = new DOMParser().parseFromString(xml, "application/xml");
    if (documentXml.querySelector("parsererror") || !documentXml.querySelector("HealthData")) throw new Error();
    const wanted = {
      HKQuantityTypeIdentifierVO2Max: "VO₂ max",
      HKQuantityTypeIdentifierRestingHeartRate: "resting heart rate",
      HKQuantityTypeIdentifierHeartRate: "heart rate",
      HKQuantityTypeIdentifierStepCount: "steps",
      HKQuantityTypeIdentifierActiveEnergyBurned: "active energy",
      HKQuantityTypeIdentifierAppleExerciseTime: "exercise minutes",
      HKCategoryTypeIdentifierSleepAnalysis: "sleep"
    };
    const records = [...documentXml.querySelectorAll("Record")];
    const counts = {};
    const latest = {};
    records.forEach(record => {
      const type = record.getAttribute("type");
      if (!wanted[type]) return;
      counts[type] = (counts[type] || 0) + 1;
      const endDate = record.getAttribute("endDate") || "";
      if (!latest[type] || endDate > latest[type].endDate) {
        latest[type] = {
          value: record.getAttribute("value"),
          unit: record.getAttribute("unit"),
          endDate
        };
      }
    });
    const matched = Object.values(counts).reduce((sum, count) => sum + count, 0);
    state.healthImport = { fileName: file.name, importedAt: new Date().toISOString(), counts, latest };
    saveState();
    summary.textContent = matched
      ? healthSummaryText(state.healthImport)
      : "The file was valid, but no supported Apple Watch records were found.";
    toast("Apple Health import complete");
  } catch {
    summary.textContent = "Could not read that file. Choose the extracted apple_health_export/export.xml file.";
    toast("Apple Health import failed");
  }
  e.target.value = "";
});
document.querySelector("#resetData").addEventListener("click", () => {
  if (!confirm("Reset every local check-in and workout log on this device?")) return;
  state = initialState(); saveState(); renderAll(); dialog.close(); toast("Local data reset");
});

function renderAll() {
  renderToday(); renderPlan(); renderCheckins(); renderProgress();
  const target = location.hash.slice(1);
  navigate(["today", "plan", "checkin", "progress"].includes(target) ? target : "today");
  const health = state.healthImport;
  document.querySelector("#healthImportSummary").textContent = healthSummaryText(health);
}

if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("./sw.js");
renderAll();
