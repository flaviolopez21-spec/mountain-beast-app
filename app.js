const STORAGE_KEY = "mountain-beast-v1";
const DEFAULT_START = "2026-06-15";
const SESSION_TYPES = [
  "Zone 2 Walk", "VO₂ Intervals", "Tempo/Incline", "Hill Repeats",
  "Long Walk/Hike/Ruck", "Strength A", "Strength B", "Recovery Walk",
  "Mobility", "Benchmark", "Rest"
];

const DEFAULT_PROFILE = {
  age: 31, heightIn: 65, weight: 190, goalWeight: 170,
  goalComposition: "Size L shirt and size 30 pants", gymAccess: "Planet Fitness",
  hikingGoal: "Mount Rainier", injuries: "Asthma", startDate: DEFAULT_START,
  days: [1, 2, 3, 4, 5, 6]
};

function initialState() {
  return {
    setup: null,
    selectedProgram: "vo2-rebuild",
    programStarts: { "vo2-rebuild": DEFAULT_START },
    sessions: [],
    readiness: {},
    weeklyCheckins: [],
    checkins: [{ date: DEFAULT_START, weight: 190, navel: 42, neck: 18.5, waist: 37.5, chest: 44, hips: 41, thigh: 23 }],
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
  next.selectedProgram ??= "vo2-rebuild";
  next.programStarts ??= { "vo2-rebuild": next.setup?.startDate || DEFAULT_START };
  next.sessions ??= [];
  next.readiness ??= {};
  next.weeklyCheckins ??= [];
  next.checkins = Array.isArray(next.checkins) ? next.checkins : base.checkins;
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
function profile() { return { ...DEFAULT_PROFILE, ...(state.setup || {}) }; }
function activeProgram() { return PROGRAMS[state.selectedProgram] || PROGRAMS["vo2-rebuild"]; }
function dateKey(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}
function atNoon(value) { return new Date(`${value}T12:00:00`); }
function today() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
}
function startDate() { return atNoon(state.programStarts[state.selectedProgram] || profile().startDate || DEFAULT_START); }
function endDate() { const date = startDate(); date.setDate(date.getDate() + 83); return date; }
function activeDate() {
  const now = today();
  if (now < startDate()) return startDate();
  if (now > endDate()) return endDate();
  return now;
}
function dayIndex(date = activeDate()) { return Math.max(0, Math.min(83, Math.floor((date - startDate()) / 86400000))); }
function currentWeek(date = activeDate()) { return Math.floor(dayIndex(date) / 7) + 1; }
function currentDay(date = activeDate()) { return dayIndex(date) % 7; }
function planFor(date = activeDate()) {
  const week = currentWeek(date);
  return { ...activeProgram().weeks[week - 1].days[currentDay(date)], week, day: currentDay(date) + 1, weekData: activeProgram().weeks[week - 1] };
}
function latest(list) { return [...list].sort((a, b) => String(a.date).localeCompare(String(b.date))).at(-1); }

function adjustedPlan(plan, color) {
  if (color !== "yellow" && color !== "red") return plan;
  if (color === "red") {
    return {
      ...plan, title: "Recovery or full rest", type: "Recovery Walk", minutes: 20, effort: "2/10",
      warmup: [], main: ["Rest completely, or walk 10–20 minutes only if it feels restorative"],
      cooldown: ["Stop if breathing, pain, dizziness, or chest symptoms worsen"],
      adaptation: "Red day: hard work removed. Protect the next session."
    };
  }
  const factor = .65;
  return {
    ...plan,
    minutes: Math.max(10, Math.round(plan.minutes * factor)),
    main: plan.main.map(item => reducePrescription(item)),
    adaptation: "Yellow day: volume reduced about 35%. Keep the intended effort controlled."
  };
}
function reducePrescription(text) {
  return text
    .replace(/(\d+) rounds/i, (_, n) => `${Math.max(2, Math.ceil(Number(n) * .65))} rounds`)
    .replace(/(\d+)[–-](\d+) min/i, (_, a, b) => `${Math.round(Number(a) * .65)}–${Math.round(Number(b) * .65)} min`)
    .replace(/^(\d+) min/i, (_, n) => `${Math.max(10, Math.round(Number(n) * .65))} min`);
}
function currentReadiness() { return state.readiness[dateKey(activeDate())] || { color: null, note: "" }; }

function list(items) {
  if (!items?.length) return "";
  return `<ul class="exercise-list">${items.map(item => `<li><strong>${item}</strong></li>`).join("")}</ul>`;
}
function workoutDetails(plan) {
  return [
    ["Warm-up", plan.warmup],
    ["Main set", plan.main],
    ["Cool-down", plan.cooldown]
  ].filter(([, items]) => items?.length).map(([title, items]) =>
    `<section class="workout-section"><h3>${title}</h3>${list(items)}</section>`).join("") +
    `<div class="session-callouts"><div><span>Effort target</span><strong>${plan.effort}</strong></div><div><span>Planned time</span><strong>${plan.minutes} min</strong></div></div>
    <div class="victory"><span>Victory condition</span><strong>${plan.victory || plan.weekData.victory}</strong></div>`;
}

function sessionsForWeek(week) {
  const first = new Date(startDate()); first.setDate(first.getDate() + (week - 1) * 7);
  const last = new Date(first); last.setDate(last.getDate() + 6);
  return state.sessions.filter(session => {
    const date = atNoon(session.date);
    return session.programId === state.selectedProgram && date >= first && date <= last;
  });
}
function plannedCardioMinutes(week) {
  return activeProgram().weeks[week - 1].days
    .filter(day => !["Strength A", "Strength B", "Mobility", "Rest"].includes(day.type))
    .reduce((sum, day) => sum + day.minutes, 0);
}
function weeklyStats(week = currentWeek()) {
  const logs = sessionsForWeek(week);
  const cardio = logs.filter(log => !["Strength A", "Strength B", "Mobility", "Rest"].includes(log.type))
    .reduce((sum, log) => sum + Number(log.minutes || 0), 0);
  const uniqueDates = new Set(logs.filter(log => log.type !== "Rest").map(log => log.date)).size;
  const plannedSessions = activeProgram().weeks[week - 1].days.filter(day => day.type !== "Rest").length;
  return { logs, cardio, completion: Math.min(100, Math.round(uniqueDates / plannedSessions * 100)) };
}

function readinessScore() {
  const week = currentWeek();
  const stats = weeklyStats(week);
  const target = plannedCardioMinutes(week);
  const hardDone = stats.logs.some(log => ["VO₂ Intervals", "Tempo/Incline", "Hill Repeats", "Benchmark"].includes(log.type));
  const longDone = stats.logs.some(log => log.type === "Long Walk/Hike/Ruck");
  const strengthDone = stats.logs.some(log => ["Strength A", "Strength B"].includes(log.type));
  const checkin = latest(state.weeklyCheckins);
  const pains = stats.logs.map(log => Number(log.pain || 0));
  const avgPain = pains.length ? pains.reduce((a, b) => a + b, 0) / pains.length : null;
  const components = {
    completion: { label: "Weekly completion", max: 30, points: Math.round(stats.completion * .3) },
    cardio: { label: "Cardio minutes", max: 25, points: Math.min(25, Math.round(stats.cardio / Math.max(1, target) * 25)) },
    mountain: { label: "Long walk / hike", max: 15, points: longDone ? 15 : 0 },
    quality: { label: "Intervals + strength", max: 15, points: (hardDone ? 9 : 0) + (strengthDone ? 6 : 0) },
    tracking: { label: "Weekly tracking", max: 10, points: checkin && currentWeek(atNoon(checkin.date)) === week ? 10 : 0 },
    safety: { label: "Pain management", max: 5, points: avgPain == null ? 0 : Math.max(0, Math.round(5 - avgPain * .7)) }
  };
  const total = Object.values(components).reduce((sum, item) => sum + item.points, 0);
  const title = total >= 90 ? "Rainier Ready" : total >= 75 ? "Summit Weapon" : total >= 60 ? "Alpine Engine" : total >= 45 ? "Pack Mule" : total >= 25 ? "Trail Dog" : "Base Camp Builder";
  return { total, title, components, stats };
}

function renderToday() {
  const date = activeDate();
  const raw = planFor(date);
  const readiness = currentReadiness();
  const plan = adjustedPlan(raw, readiness.color);
  const matching = state.sessions.find(session => session.date === dateKey(date) && session.programId === state.selectedProgram);
  document.querySelector("#dateLabel").textContent = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  document.querySelector("#phaseLabel").textContent = `Week ${raw.week}, Day ${raw.day} · ${phaseName(raw.weekData.phase)} · ${raw.weekData.theme}`;
  document.querySelector("#weekNumber").textContent = raw.week;
  document.querySelector("#weekRing").style.background = `conic-gradient(var(--lime) ${raw.week / 12 * 360}deg, var(--pine) 0)`;
  document.querySelector("#todayPurpose").textContent = `${raw.type} · ${raw.effort}`;
  document.querySelector("#todayWorkout").textContent = plan.title;
  document.querySelector("#todayStatus").textContent = matching ? "Logged" : "Planned";
  document.querySelector("#todayStatus").classList.toggle("done", !!matching);
  document.querySelector("#adaptationBanner").textContent = plan.adaptation || "Green plan: complete the session as written.";
  document.querySelector("#adaptationBanner").className = `adaptation-banner ${readiness.color || "neutral"}`;
  document.querySelector("#workoutContent").innerHTML = workoutDetails(plan);
  document.querySelector("#workoutNotes").value = matching?.notes || "";
  document.querySelector("#readinessNote").value = readiness.note || "";
  document.querySelectorAll("[data-readiness]").forEach(button => button.classList.toggle("active", button.dataset.readiness === readiness.color));
  const status = document.querySelector("#readinessStatus");
  status.textContent = readiness.color ? `${readiness.color[0].toUpperCase()}${readiness.color.slice(1)} day` : "Not checked";
  status.className = `status-pill ${readiness.color || ""}`;
  const score = readinessScore();
  document.querySelector("#readinessScore").textContent = score.total;
  document.querySelector("#readinessRing").style.background = `conic-gradient(var(--lime) ${score.total * 3.6}deg, rgba(255,255,255,.13) 0)`;
  document.querySelector("#beastTitle").textContent = score.title;
  document.querySelector("#readinessMessage").textContent = `${score.stats.cardio} cardio min · ${score.stats.completion}% complete this week`;
  document.querySelector("#cardioMetric").textContent = score.stats.cardio;
  document.querySelector("#completionMetric").textContent = `${score.stats.completion}%`;
  document.querySelector("#vo2Metric").textContent = latestVo2().toFixed(1);
}

function phaseName(phase) { return phase === 1 ? "Build the Base" : phase === 2 ? "Build the Engine" : "Peak the Block"; }
function renderPlan(phase = 1) {
  document.querySelector("#planList").innerHTML = activeProgram().weeks.map((week, index) => ({ week, number: index + 1 }))
    .filter(item => item.week.phase === phase)
    .map(({ week, number }) => {
      const start = new Date(startDate()); start.setDate(start.getDate() + (number - 1) * 7);
      const days = week.days.map((day, i) => {
        const date = new Date(start); date.setDate(date.getDate() + i);
        return `<details class="plan-day"><summary><time>${date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</time><strong>${day.title}</strong><span>›</span></summary>
          <div class="day-workout">${workoutDetails({ ...day, weekData: week })}</div></details>`;
      }).join("");
      return `<details class="plan-week ${number === currentWeek() ? "current" : ""}" ${number === currentWeek() ? "open" : ""}>
        <summary><div><strong>Week ${number}: ${week.theme}</strong><span>${week.target} · ${activeProgram().badges[number - 1]}</span></div></summary>
        <div class="week-overview"><div class="victory"><span>Weekly victory</span><strong>${week.victory}</strong></div></div>
        <div class="week-days">${days}</div></details>`;
    }).join("");
}

function dynamicFields(type) {
  if (["Zone 2 Walk", "Tempo/Incline", "Hill Repeats", "Recovery Walk", "Benchmark"].includes(type)) return `
    <div class="form-grid"><label class="field"><span>Distance (miles)</span><input type="number" name="distance" min="0" step="0.01" /></label>
    <label class="field"><span>Elevation gain (ft)</span><input type="number" name="elevation" min="0" step="10" /></label>
    <label class="field"><span>Incline / route</span><input name="route" placeholder="6% treadmill, neighborhood loop..." /></label>
    <label class="field"><span>Average pace (min/mi)</span><input type="number" name="pace" min="0" step="0.1" /></label></div>`;
  if (type === "VO₂ Intervals") return `
    <div class="form-grid"><label class="field"><span>Rounds completed</span><input type="number" name="rounds" min="0" max="20" /></label>
    <label class="field"><span>Hard interval length (sec)</span><input type="number" name="hardSeconds" min="0" /></label>
    <label class="field"><span>Recovery length (sec)</span><input type="number" name="recoverySeconds" min="0" /></label>
    <label class="field"><span>Mode</span><select name="mode"><option>Outdoor hill</option><option>Treadmill</option><option>Bike</option><option>Elliptical</option><option>Stairs</option></select></label></div>`;
  if (type === "Long Walk/Hike/Ruck") return `
    <div class="form-grid"><label class="field"><span>Distance (miles)</span><input type="number" name="distance" min="0" step="0.1" /></label>
    <label class="field"><span>Pack weight (lb)</span><input type="number" name="packWeight" min="0" step="0.5" /></label>
    <label class="field"><span>Elevation gain (ft)</span><input type="number" name="elevation" min="0" step="10" /></label>
    <label class="field"><span>Terrain</span><select name="terrain"><option>Pavement</option><option>Rolling trail</option><option>Steep trail</option><option>Stairs</option><option>Snow</option></select></label>
    <label class="field"><span>Feet pain</span><input type="number" name="feetPain" min="0" max="10" /></label>
    <label class="field"><span>Knee/back pain</span><input type="number" name="jointPain" min="0" max="10" /></label></div>`;
  if (["Strength A", "Strength B"].includes(type)) {
    const movements = type === "Strength A" ? STRENGTH_A : STRENGTH_B;
    return `<div class="strength-log">${movements.map((movement, index) => `<div class="strength-line"><strong>${movement}</strong><input name="movement${index}" placeholder="weight × reps" /></div>`).join("")}</div>`;
  }
  return "";
}
function renderLog() {
  const form = document.querySelector("#sessionForm");
  if (!form.elements.date.value) form.elements.date.value = dateKey(activeDate());
  document.querySelector("#dynamicLogFields").innerHTML = dynamicFields(form.elements.type.value);
  const logs = [...state.sessions].filter(session => session.programId === state.selectedProgram).sort((a, b) => b.date.localeCompare(a.date));
  document.querySelector("#sessionHistory").innerHTML = `<article class="card"><p class="eyebrow">Session history</p><h2>${logs.length} logged session${logs.length === 1 ? "" : "s"}</h2>${logs.slice(0, 20).map(log => `
    <div class="history-card"><time>${atNoon(log.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</time>
    <div><strong>${log.type}</strong><span>${log.minutes} min · effort ${log.effort}/10${log.avgHr ? ` · ${log.avgHr} bpm` : ""}</span></div><strong>${log.pain || 0}/10</strong></div>`).join("")}</article>`;
}

function latestVo2() {
  const checkin = [...state.weeklyCheckins].filter(item => item.vo2).sort((a, b) => a.date.localeCompare(b.date)).at(-1);
  const health = state.healthImport?.latest?.HKQuantityTypeIdentifierVO2Max;
  return Number(checkin?.vo2 || health?.value || 28.7);
}
function latestRestingHr() {
  const checkin = [...state.weeklyCheckins].filter(item => item.restingHr).sort((a, b) => a.date.localeCompare(b.date)).at(-1);
  const health = state.healthImport?.latest?.HKQuantityTypeIdentifierRestingHeartRate;
  return Number(checkin?.restingHr || health?.value || 0);
}
function renderProgress() {
  const score = readinessScore();
  const checkin = latest(state.weeklyCheckins) || {};
  const body = latest(state.checkins) || {};
  document.querySelector("#progressScore").textContent = score.total;
  document.querySelector("#progressTitle").textContent = score.title;
  document.querySelector("#scoreBreakdown").innerHTML = Object.values(score.components).map(item =>
    `<div class="score-component"><span>${item.label}</span><strong>${item.points}/${item.max}</strong></div>`).join("");
  document.querySelector("#latestMetrics").innerHTML = [
    ["VO₂ max estimate", latestVo2().toFixed(1)],
    ["Resting HR", latestRestingHr() ? `${latestRestingHr()} bpm` : "—"],
    ["Body weight", checkin.weight || body.weight ? `${checkin.weight || body.weight} lb` : "—"],
    ["Longest walk/hike", checkin.longestDistance ? `${checkin.longestDistance} mi` : longestDistance()],
    ["Same-route average HR", checkin.routeAvgHr ? `${checkin.routeAvgHr} bpm` : "—"],
    ["Energy / sleep", checkin.energy ? `${checkin.energy}/10 · ${checkin.sleep || "—"}/10` : "—"],
    ["Confidence", checkin.confidence ? `${checkin.confidence}/10` : "—"],
    ["Breathing", checkin.breathingNotes || "No weekly note"]
  ].map(([label, value]) => `<div class="detail-row"><span>${label}</span><strong>${value}</strong></div>`).join("");
  document.querySelector("#badgeGrid").innerHTML = activeProgram().badges.map((badge, index) => {
    const stats = weeklyStats(index + 1);
    const earned = stats.completion >= 50 || (index === 0 && stats.logs.length > 0);
    return `<div class="badge ${earned ? "earned" : ""}"><span>${earned ? "✓" : index + 1}</span><strong>${badge}</strong><small>Week ${index + 1}</small></div>`;
  }).join("");
  document.querySelector("#weeklyBars").innerHTML = activeProgram().weeks.map((week, index) => {
    const stats = weeklyStats(index + 1);
    const height = Math.min(100, Math.round(stats.cardio / Math.max(1, plannedCardioMinutes(index + 1)) * 100));
    return `<div class="weekly-column"><div class="weekly-bar"><i style="height:${height}%"></i></div><strong>W${index + 1}</strong><small>${stats.cardio}m · ${stats.completion}%</small></div>`;
  }).join("");
  const form = document.querySelector("#weeklyCheckinForm");
  if (!form.elements.date.value) form.elements.date.value = dateKey(activeDate());
}
function longestDistance() {
  const max = Math.max(0, ...state.sessions.map(item => Number(item.distance || 0)), ...state.rucks.map(item => Number(item.miles || 0)));
  return max ? `${max.toFixed(1)} mi` : "—";
}

const COACH_SECTIONS = [
  ["Mission", "Raise VO₂ max by building a stronger aerobic engine for health, confidence, hiking, and longevity. Build the engine. Protect the body. Show up for 12 weeks."],
  ["Training Zones", "<strong>Zone 1:</strong> 2–3/10, very easy. <strong>Zone 2:</strong> 4–5/10, full sentences. <strong>Tempo:</strong> 6–7/10, short phrases. <strong>VO₂:</strong> 8–9/10, hard but controlled."],
  ["Heart Rate Guide", "Estimated max: 189 bpm. Recovery: 95–115. Zone 2: 115–140. Tempo: 140–160. VO₂ intervals: 160–180. These are estimates; effort and symptoms win."],
  ["Safety Rules", "Stop or back off for chest pain, dizziness, faintness, unusual shortness of breath, persistent wheezing, sharp pain, or a feeling that something is wrong. Warm up at least 10 minutes before hard intervals."],
  ["Workout Instructions", "<strong>Zone 2:</strong> controlled full-sentence pace. <strong>Intervals:</strong> hard, never a sprint. <strong>Tempo:</strong> uncomfortable but sustainable. <strong>Long day:</strong> confidence-building, not crushing."],
  ["Green / Yellow / Red", "<strong>Green:</strong> do the plan. <strong>Yellow:</strong> reduce volume 25–40%. <strong>Red:</strong> skip hard work; rest or take an easy recovery walk."],
  ["Minimum Viable Week", "One Zone 2 walk, one VO₂ session, one long walk, and one strength session. An ugly week does not end the block."],
  ["Strength Plan", `<strong>Strength A</strong><br>${STRENGTH_A.join("<br>")}<br><br><strong>Strength B</strong><br>${STRENGTH_B.join("<br>")}<br><br>Leave 2–3 reps in reserve. No grinding or maxing.`],
  ["Tracking", "Weekly: VO₂ max, resting HR, body weight, longest walk/hike, same-route average HR, energy, sleep, breathing notes, and confidence. Judge trends every 2–4 weeks."],
  ["Mindset", "The number is feedback, not identity. Every walk is a vote for your future self. You are training because you are responsible for your body now."]
];
function renderCoach() {
  document.querySelector("#coachContent").innerHTML = COACH_SECTIONS.map(([title, body], index) =>
    `<details class="coach-card" ${index === 0 ? "open" : ""}><summary>${title}<span>+</span></summary><div>${body}</div></details>`).join("");
}

function renderProgramSelectors() {
  const options = [
    `<option value="vo2-rebuild">12-Week VO₂ Max Rebuild</option>`,
    ...FUTURE_PROGRAMS.map(name => `<option disabled>${name} · coming later</option>`)
  ].join("");
  ["#programSelector", "#settingsProgramSelector"].forEach(selector => {
    const select = document.querySelector(selector);
    select.innerHTML = options;
    select.value = state.selectedProgram;
  });
  document.querySelector("#activeProgramLabel").textContent = activeProgram().shortName;
}

function showOnboarding() {
  const form = document.querySelector("#onboardingForm");
  const p = profile();
  ["heightIn", "goalWeight", "goalComposition", "gymAccess", "hikingGoal", "injuries"].forEach(key => form.elements[key].value = p[key] || "");
  form.elements.weight.value = latest(state.checkins)?.weight || p.weight;
  form.elements.startDate.value = state.programStarts[state.selectedProgram] || p.startDate;
  form.querySelectorAll('input[name="days"]').forEach(input => input.checked = p.days.includes(Number(input.value)));
  document.querySelector("#onboarding").hidden = false;
}
function navigate(target) {
  document.querySelectorAll(".view").forEach(view => view.classList.toggle("active", view.dataset.view === target));
  document.querySelectorAll(".bottom-nav a").forEach(link => link.classList.toggle("active", link.dataset.target === target));
  if (target === "today") renderToday();
  if (target === "plan") renderPlan(Number(document.querySelector("#phaseTabs .active")?.dataset.phase || 1));
  if (target === "log") renderLog();
  if (target === "progress") renderProgress();
  if (target === "coach") renderCoach();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function toast(message) {
  const el = document.querySelector("#toast");
  el.textContent = message; el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2200);
}

document.querySelector("#onboardingForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  const days = [...event.currentTarget.querySelectorAll('input[name="days"]:checked')].map(input => Number(input.value));
  state.setup = {
    ...profile(), heightIn: Number(data.heightIn), weight: Number(data.weight),
    goalWeight: Number(data.goalWeight) || null, goalComposition: data.goalComposition,
    gymAccess: data.gymAccess, hikingGoal: data.hikingGoal, injuries: data.injuries || "None",
    startDate: data.startDate, days, completed: true
  };
  state.programStarts[state.selectedProgram] = data.startDate;
  const body = latest(state.checkins);
  if (!body || Number(body.weight) !== Number(data.weight)) state.checkins.push({ date: data.startDate, weight: Number(data.weight) });
  saveState(); document.querySelector("#onboarding").hidden = true; renderAll(); toast("Training block ready");
});

document.querySelectorAll("[data-readiness]").forEach(button => button.addEventListener("click", () => {
  state.readiness[dateKey(activeDate())] = { color: button.dataset.readiness, note: document.querySelector("#readinessNote").value.trim() };
  saveState(); renderToday();
}));
document.querySelector("#readinessNote").addEventListener("change", event => {
  const current = currentReadiness();
  state.readiness[dateKey(activeDate())] = { color: current.color, note: event.target.value.trim() };
  saveState();
});
document.querySelector("#logTodayButton").addEventListener("click", () => {
  navigate("log"); history.replaceState(null, "", "#log");
  const plan = adjustedPlan(planFor(), currentReadiness().color);
  const form = document.querySelector("#sessionForm");
  form.elements.date.value = dateKey(activeDate());
  form.elements.type.value = plan.type;
  form.elements.minutes.value = plan.minutes;
  form.elements.effort.value = Number(String(plan.effort).match(/\d+/)?.[0] || 5);
  form.elements.notes.value = document.querySelector("#workoutNotes").value;
  document.querySelector("#dynamicLogFields").innerHTML = dynamicFields(plan.type);
});
document.querySelector("#sessionType").addEventListener("change", event => document.querySelector("#dynamicLogFields").innerHTML = dynamicFields(event.target.value));
document.querySelector("#sessionForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  ["minutes","effort","avgHr","maxHr","energy","confidence","pain","distance","elevation","pace","rounds","hardSeconds","recoverySeconds","packWeight","feetPain","jointPain"]
    .forEach(key => { if (key in data) data[key] = Number(data[key]) || 0; });
  data.programId = state.selectedProgram;
  data.id = `${data.date}-${data.type}-${Date.now()}`;
  state.sessions.push(data);
  if (data.type === "Long Walk/Hike/Ruck") state.rucks.push({ date: data.date, miles: data.distance, packWeight: data.packWeight, elevation: data.elevation, minutes: data.minutes, terrain: data.terrain, feetPain: data.feetPain, kneePain: data.jointPain, backPain: data.jointPain, notes: data.notes });
  saveState(); event.currentTarget.reset(); event.currentTarget.elements.date.value = dateKey(activeDate()); populateSessionTypes(); renderLog(); toast("Session saved locally");
});
document.querySelector("#weeklyCheckinForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  ["vo2","restingHr","weight","longestDistance","routeAvgHr","energy","sleep","confidence"].forEach(key => data[key] = Number(data[key]) || 0);
  data.programId = state.selectedProgram;
  const existing = state.weeklyCheckins.findIndex(item => item.date === data.date && item.programId === state.selectedProgram);
  if (existing >= 0) state.weeklyCheckins[existing] = data; else state.weeklyCheckins.push(data);
  if (data.weight) state.checkins.push({ date: data.date, weight: data.weight });
  saveState(); renderProgress(); renderToday(); toast("Weekly check-in saved");
});
document.querySelectorAll(".bottom-nav a").forEach(link => link.addEventListener("click", event => {
  event.preventDefault(); history.replaceState(null, "", link.hash); navigate(link.dataset.target);
}));
document.querySelectorAll("#phaseTabs button").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll("#phaseTabs button").forEach(item => item.classList.toggle("active", item === button));
  renderPlan(Number(button.dataset.phase));
}));
function changeProgram(value) {
  if (!PROGRAMS[value]) return;
  state.selectedProgram = value; saveState(); renderAll();
}
document.querySelector("#programSelector").addEventListener("change", event => changeProgram(event.target.value));
document.querySelector("#settingsProgramSelector").addEventListener("change", event => changeProgram(event.target.value));

const dialog = document.querySelector("#settingsDialog");
document.querySelector("#settingsButton").addEventListener("click", () => dialog.showModal());
document.querySelector("#closeSettings").addEventListener("click", () => dialog.close());
document.querySelector("#editProfile").addEventListener("click", () => { dialog.close(); showOnboarding(); });
document.querySelector("#exportData").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify({ version: 4, exportedAt: new Date().toISOString(), state }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob); const link = document.createElement("a");
  link.href = url; link.download = `mountain-beast-backup-${dateKey(today())}.json`; link.click(); URL.revokeObjectURL(url);
});
document.querySelector("#importData").addEventListener("change", async event => {
  try {
    const parsed = JSON.parse(await event.target.files[0].text());
    if (!parsed.state) throw new Error();
    state = migrate(parsed.state); saveState(); renderAll(); dialog.close(); toast("Backup restored");
  } catch { toast("Backup file is not valid"); }
  event.target.value = "";
});
document.querySelector("#healthImport").addEventListener("change", async event => {
  const file = event.target.files[0]; if (!file) return;
  try {
    const xml = new DOMParser().parseFromString(await file.text(), "application/xml");
    if (xml.querySelector("parsererror") || !xml.querySelector("HealthData")) throw new Error();
    const wanted = ["HKQuantityTypeIdentifierVO2Max","HKQuantityTypeIdentifierRestingHeartRate","HKQuantityTypeIdentifierHeartRate","HKQuantityTypeIdentifierStepCount","HKQuantityTypeIdentifierActiveEnergyBurned","HKQuantityTypeIdentifierAppleExerciseTime","HKCategoryTypeIdentifierSleepAnalysis"];
    const counts = {}, latestValues = {};
    xml.querySelectorAll("Record").forEach(record => {
      const type = record.getAttribute("type"); if (!wanted.includes(type)) return;
      counts[type] = (counts[type] || 0) + 1;
      const endDate = record.getAttribute("endDate") || "";
      if (!latestValues[type] || endDate > latestValues[type].endDate) latestValues[type] = { value: record.getAttribute("value"), unit: record.getAttribute("unit"), endDate };
    });
    state.healthImport = { fileName: file.name, importedAt: new Date().toISOString(), counts, latest: latestValues };
    saveState(); renderHealthSummary(); renderProgress(); renderToday(); toast("Apple Health imported");
  } catch { toast("Choose the extracted Apple Health export.xml file"); }
  event.target.value = "";
});
document.querySelector("#resetData").addEventListener("click", () => {
  if (!confirm("Reset all local Mountain Beast data on this device?")) return;
  state = initialState(); saveState(); dialog.close(); renderAll(); showOnboarding();
});

function populateSessionTypes() {
  const select = document.querySelector("#sessionType");
  const previous = select.value;
  select.innerHTML = SESSION_TYPES.map(type => `<option>${type}</option>`).join("");
  select.value = SESSION_TYPES.includes(previous) ? previous : planFor().type;
  document.querySelector("#dynamicLogFields").innerHTML = dynamicFields(select.value);
}
function renderHealthSummary() {
  const health = state.healthImport;
  const el = document.querySelector("#healthImportSummary");
  if (!health) { el.textContent = "No Apple Health file imported yet."; return; }
  const count = Object.values(health.counts || {}).reduce((a, b) => a + b, 0);
  el.textContent = `${count.toLocaleString()} relevant records from ${health.fileName}. Latest VO₂ max: ${latestVo2().toFixed(1)}; resting HR: ${latestRestingHr() || "—"}.`;
}
function renderAll() {
  renderProgramSelectors(); populateSessionTypes(); renderToday(); renderPlan(); renderLog(); renderProgress(); renderCoach(); renderHealthSummary();
  const target = location.hash.slice(1);
  navigate(["today","plan","log","progress","coach"].includes(target) ? target : "today");
  if (!state.setup?.completed) showOnboarding();
}

if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("./sw.js");
renderAll();
