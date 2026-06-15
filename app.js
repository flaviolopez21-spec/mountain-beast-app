const STORAGE_KEY = "mountain-beast-v1";
const DEFAULT_START = "2026-06-15";
const APP_VERSION = "0.6.1";
const APP_UPDATED = "June 15, 2026";
const SESSION_TYPES = [
  "Zone 2 Walk", "VO₂ Intervals", "Tempo/Incline", "Hill Repeats",
  "Long Walk/Hike/Ruck", "Strength A", "Strength B", "Recovery Walk",
  "Mobility", "Benchmark", "Rest"
];

const BADGE_META = [
  ["spark", "The first session is logged. The engine has turned over."],
  ["boot", "You returned and proved the first day was not a fluke."],
  ["trail", "Your first full build week is taking shape."],
  ["moon", "You absorbed the work instead of chasing exhaustion."],
  ["piston", "The aerobic engine is ready for a larger workload."],
  ["hill", "Inclines are becoming terrain, not a threat."],
  ["stopwatch", "Longer controlled intervals are now part of the toolkit."],
  ["shield", "You protected recovery and kept the block intact."],
  ["four", "Four-minute efforts unlocked with discipline."],
  ["lungs", "A complete VO₂ session, controlled from start to finish."],
  ["peak", "The strongest week of the block is within reach."],
  ["flag", "Twelve weeks of deliberate work rebuilt the mountain engine."]
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
    healthImport: null,
    meta: {
      lastSavedAt: null, lastBackupAt: null, lastTab: "today", lastOpenedDate: null, todayNotes: {},
      badgeUnlocksShown: {}, badgeUnlockedAt: {}, timer: null
    }
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
  next.meta ??= {};
  next.meta.lastSavedAt ??= null;
  next.meta.lastBackupAt ??= null;
  next.meta.lastTab ??= "today";
  next.meta.lastOpenedDate ??= null;
  next.meta.todayNotes ??= {};
  next.meta.badgeUnlocksShown ??= {};
  next.meta.badgeUnlockedAt ??= {};
  next.meta.timer ??= null;
  return next;
}

let state = loadState();
function loadState() {
  try { return migrate(JSON.parse(localStorage.getItem(STORAGE_KEY))); }
  catch { return initialState(); }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function savedLocally(message = "Saved locally ✓") {
  state.meta.lastSavedAt = new Date().toISOString();
  saveState();
  renderSavedState();
  toast(message);
}
function formatSavedTime(value) {
  if (!value) return "Not saved yet";
  return `Last saved: ${new Date(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
}
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
      ...plan, originalMinutes: plan.minutes, title: "Recovery or full rest", type: "Recovery Walk", minutes: 20, effort: "2/10",
      warmup: [], main: ["Rest completely, or walk 10–20 minutes only if it feels restorative"],
      cooldown: ["Stop if breathing, pain, dizziness, or chest symptoms worsen"],
      adaptation: "Red day: hard work removed. Protect the next session."
    };
  }
  const factor = .65;
  return {
    ...plan,
    originalMinutes: plan.minutes,
    minutes: Math.max(10, Math.round(plan.minutes * factor)),
    main: plan.main.map(item => reducePrescription(item)),
    adaptation: "Keep the same effort target. Do less work and finish with energy left."
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
  const chassisTypes = ["Strength A", "Strength B", "Mobility"];
  const chassis = logs.filter(log => chassisTypes.includes(log.type)).length;
  const plannedChassis = activeProgram().weeks[week - 1].days.filter(day => chassisTypes.includes(day.type)).length;
  return { logs, cardio, uniqueDates, plannedSessions, chassis, plannedChassis, completion: Math.min(100, Math.round(uniqueDates / plannedSessions * 100)) };
}
function badgeEarned(week) {
  const stats = weeklyStats(week);
  return stats.completion >= 50 || (week === 1 && stats.logs.length > 0);
}
function earnedBadgeWeeks() {
  return new Set(activeProgram().badges.map((_, index) => index + 1).filter(badgeEarned));
}
function programMetaBucket(key) {
  state.meta[key][state.selectedProgram] ??= {};
  return state.meta[key][state.selectedProgram];
}
function badgeRequirement(week) {
  return week === 1 ? "Log your first training session." : "Complete at least 50% of the planned sessions for this week.";
}
function badgeProgress(week) {
  const stats = weeklyStats(week);
  const required = week === 1 ? 1 : Math.ceil(stats.plannedSessions * .5);
  const completed = week === 1 ? Math.min(1, stats.logs.filter(log => log.type !== "Rest").length) : Math.min(required, stats.uniqueDates);
  return { completed, required, percent: Math.min(100, Math.round(completed / Math.max(1, required) * 100)) };
}
function badgeUnlockDate(week) {
  return programMetaBucket("badgeUnlockedAt")[week] || null;
}
function syncBadgeUnlockDates() {
  const bucket = programMetaBucket("badgeUnlockedAt");
  let changed = false;
  earnedBadgeWeeks().forEach(week => {
    if (bucket[week]) return;
    const logs = sessionsForWeek(week).filter(log => log.type !== "Rest").sort((a, b) => a.date.localeCompare(b.date));
    bucket[week] = logs.at(-1)?.date || dateKey(today());
    changed = true;
  });
  if (changed) saveState();
}
function badgeIcon(kind) {
  const common = `viewBox="0 0 64 64" role="img" aria-hidden="true"`;
  const icons = {
    spark: `<svg ${common}><path d="M34 7 18 34h13l-3 23 18-31H33z"/><path class="detail" d="M12 48h13M41 15h10"/></svg>`,
    boot: `<svg ${common}><path d="M19 10h18v24l12 7c5 3 4 12-3 13H20c-7 0-10-8-5-13l7-7z"/><path class="detail" d="M21 44h26M23 18h13"/></svg>`,
    trail: `<svg ${common}><path d="m7 50 17-25 9 12 8-17 16 30z"/><path class="detail" d="M31 53c-8-8 9-11 1-19"/></svg>`,
    moon: `<svg ${common}><path d="M45 46A22 22 0 0 1 29 8a23 23 0 1 0 16 38z"/><path class="detail" d="m46 14 2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/></svg>`,
    piston: `<svg ${common}><path d="M18 10h28v15H18zM24 25h16v15H24zM29 40h6v14H21v-7h8z"/><path class="detail" d="M14 15h36"/></svg>`,
    hill: `<svg ${common}><path d="M5 51 31 15l28 36z"/><path class="detail" d="m22 28 9 8 8-10M14 51l12-13"/></svg>`,
    stopwatch: `<svg ${common}><circle cx="32" cy="35" r="20"/><path class="detail" d="M32 35V21M25 7h14M32 7v8M48 18l5-5"/></svg>`,
    shield: `<svg ${common}><path d="M32 6 53 14v16c0 14-9 23-21 29C20 53 11 44 11 30V14z"/><path class="detail" d="m22 32 7 7 14-16"/></svg>`,
    four: `<svg ${common}><path d="m8 48 19-33 8 14 8-14 13 33z"/><text x="32" y="47" text-anchor="middle">4</text></svg>`,
    lungs: `<svg ${common}><path d="M29 28c-6-13-13-12-17 1L8 46c-2 9 11 9 21 2zM35 28c6-13 13-12 17 1l4 17c2 9-11 9-21 2z"/><path class="detail" d="M32 8v39M32 22l-8-7M32 22l8-7"/></svg>`,
    peak: `<svg ${common}><path d="m5 52 19-28 8 10 10-20 17 38z"/><path class="detail" d="m35 28 7-14 7 15M12 52h40"/></svg>`,
    flag: `<svg ${common}><path d="M17 56V9"/><path d="M19 11h30l-7 10 7 10H19z"/><path class="detail" d="M9 56h23M23 45l9-15 11 18"/></svg>`
  };
  return icons[kind] || icons.peak;
}
function badgeMarkup(week, earned, featured = false) {
  const name = activeProgram().badges[week - 1];
  const [kind, description] = BADGE_META[week - 1];
  const progress = badgeProgress(week);
  const current = week === currentWeek() && !earned;
  return `<button type="button" class="badge ${earned ? "earned" : current ? "in-progress" : "locked"} ${featured ? "featured" : ""}" data-badge-week="${week}" ${featured ? 'tabindex="-1"' : ""} aria-label="Week ${week}: ${name}. ${earned ? "Unlocked" : current ? "In progress" : "Locked"}">
    <div class="badge-patch">${badgeIcon(kind)}<span class="badge-week">W${week}</span>${earned ? '<i class="badge-check">✓</i>' : '<i class="badge-lock" aria-label="Locked"></i>'}</div>
    <div class="badge-copy"><small>${earned ? "Unlocked" : current ? `${progress.percent}% in progress` : `Unlock in Week ${week}`}</small><strong>${name}</strong><p>${description}</p></div>
  </button>`;
}
function setRingProgress(selector, degrees) {
  const ring = document.querySelector(selector);
  if (!ring.style.getPropertyValue("--ring-progress")) ring.style.setProperty("--ring-progress", "0deg");
  requestAnimationFrame(() => ring.style.setProperty("--ring-progress", `${degrees}deg`));
}
function pulseRing(selector) {
  const ring = document.querySelector(selector);
  ring.classList.remove("celebrate");
  requestAnimationFrame(() => ring.classList.add("celebrate"));
  setTimeout(() => ring.classList.remove("celebrate"), 700);
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
  const programLogs = state.sessions.filter(session => session.programId === state.selectedProgram);
  return { total, title, components, stats, hasBaseline: programLogs.length >= 3 };
}

function renderToday() {
  const date = activeDate();
  const raw = planFor(date);
  const readiness = currentReadiness();
  const plan = adjustedPlan(raw, readiness.color);
  const matching = state.sessions.find(session =>
    session.date === dateKey(date) &&
    session.programId === state.selectedProgram &&
    (session.status || session.type === raw.type || session.plannedType === raw.type)
  );
  const completed = matching?.status === "completed" || (matching && !matching.status);
  document.querySelector("#dateLabel").textContent = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  document.querySelector("#phaseLabel").textContent = `Week ${raw.week}, Day ${raw.day} · ${phaseName(raw.weekData.phase)} · ${raw.weekData.theme}`;
  document.querySelector("#headerWeekLabel").textContent = `Week ${raw.week} of 12`;
  document.querySelector("#activeProgramLabel").textContent = `Current Mission: ${activeProgram().name}`;
  const readinessName = readiness.color ? readiness.color[0].toUpperCase() + readiness.color.slice(1) : "Green";
  const headerToday = document.querySelector("#headerTodayLabel");
  if (headerToday) headerToday.textContent = `Today: ${plan.type} · ${readinessName} · ${plan.minutes ? `${plan.minutes} min` : plan.main[0]}`;
  document.querySelector("#weekNumber").textContent = raw.week;
  setRingProgress("#weekRing", raw.week / 12 * 360);
  document.querySelector("#todayPurpose").textContent = `Week ${raw.week}, Day ${raw.day} · ${raw.type}`;
  document.querySelector("#todayWorkout").textContent = plan.title;
  document.querySelector("#todayStatus").textContent = matching?.status === "skipped" ? "Protected day" : completed ? "Completed today" : raw.title;
  document.querySelector("#todayStatus").classList.toggle("done", !!matching);
  document.querySelector("#adaptationBanner").innerHTML = readiness.color === "yellow"
    ? `<div class="adaptation-comparison"><div><span>Original</span><strong>${plan.originalMinutes} min</strong></div><div><span>Today</span><strong>${plan.minutes} min</strong></div><div><span>Effort</span><strong>${plan.effort}</strong></div></div><div class="adaptation-message"><strong>Adjustment: Yellow day, reduced about 35%.</strong> Goal: ${plan.adaptation}</div>`
    : readiness.color === "red"
      ? `<div class="adaptation-comparison"><div><span>Original</span><strong>${plan.originalMinutes} min</strong></div><div><span>Today</span><strong>Rest / ${plan.minutes} min easy</strong></div><div><span>Effort</span><strong>${plan.effort}</strong></div></div><div class="adaptation-message">${plan.adaptation}</div>`
      : `<div class="adaptation-comparison"><div><span>Original</span><strong>${raw.minutes} min</strong></div><div><span>Today</span><strong>${raw.minutes} min</strong></div><div><span>Adjustment</span><strong>Full plan</strong></div></div><div class="adaptation-message">Green day: keep the effort controlled and complete the plan as written.</div>`;
  document.querySelector("#adaptationBanner").className = `adaptation-banner ${readiness.color || "neutral"}`;
  document.querySelector("#workoutContent").innerHTML = workoutDetails(plan);
  document.querySelector("#workoutNotes").value = matching?.notes || state.meta.todayNotes[dateKey(date)] || "";
  document.querySelector("#readinessNote").value = readiness.note || "";
  document.querySelectorAll("[data-readiness]").forEach(button => {
    const selected = button.dataset.readiness === readiness.color;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  const status = document.querySelector("#readinessStatus");
  status.textContent = readiness.color ? `${readiness.color[0].toUpperCase()}${readiness.color.slice(1)} day` : "Not checked";
  status.className = `status-pill ${readiness.color || ""}`;
  const score = readinessScore();
  document.querySelector("#readinessScore").textContent = score.hasBaseline ? score.total : "…";
  document.querySelector("#readinessScale").style.display = score.hasBaseline ? "" : "none";
  setRingProgress("#readinessRing", score.hasBaseline ? score.total * 3.6 : 0);
  document.querySelector("#beastTitle").textContent = score.hasBaseline ? score.title : "Building baseline...";
  document.querySelector("#readinessMessage").textContent = score.hasBaseline
    ? `${score.stats.cardio} cardio min · ${score.stats.completion}% complete this week`
    : `${state.sessions.filter(session => session.programId === state.selectedProgram).length}/3 sessions logged`;
  document.querySelector("#cardioMetric").textContent = score.stats.cardio;
  document.querySelector("#completionMetric").textContent = `${score.stats.completion}%`;
  document.querySelector("#vo2Metric").textContent = latestVo2().toFixed(1);
  document.querySelector("#completeTodayButton").textContent = completed ? "Completed today ✓" : "Complete Session";
  document.querySelector("#completeTodayButton").disabled = completed;
  document.querySelector("#completeTodayButton").classList.toggle("completed", completed);
  document.querySelector("#todayCompletionStatus").textContent = matching?.status === "skipped"
    ? "Protected the streak. Tomorrow is still alive."
    : completed ? "Session complete. Nice work." : "";
  renderCompletionRecap(matching, raw, plan, readiness);
  document.querySelector("#intervalTimerButton").hidden = raw.type !== "VO₂ Intervals";
  document.querySelector("#miniWorkoutText").textContent = `Today: ${plan.title} · ${plan.minutes} min · ${readiness.color ? readiness.color[0].toUpperCase() + readiness.color.slice(1) : "Green"}`;
  document.querySelector("#miniWorkout").hidden = false;
  renderSavedState();
}

function renderCompletionRecap(session, raw, plan, readiness) {
  const recap = document.querySelector("#completionRecap");
  if (!recap) return;
  if (!session || session.status !== "completed") {
    recap.hidden = true;
    return;
  }
  const stats = weeklyStats(raw.week);
  const readinessName = readiness.color ? readiness.color[0].toUpperCase() + readiness.color.slice(1) : "Green";
  const adjustment = plan.originalMinutes
    ? `${readinessName} day: ${plan.minutes} from ${plan.originalMinutes} min`
    : `${readinessName} day: full plan`;
  const progress = badgeProgress(raw.week);
  const content = document.querySelector("#completionRecapContent");
  if (!content) return;
  content.innerHTML = [
    ["Session", session.plannedType || session.type],
    ["Training time", `${session.minutes || 0} min`],
    ["Adjustment", adjustment],
    ["Readiness", readinessName],
    ["Notes", session.notes ? "Saved locally ✓" : "No notes added"],
    ["Engine", `+${["Strength A","Strength B","Mobility","Rest"].includes(session.type) ? 0 : session.minutes || 0} min`],
    ["Week progress", `${stats.uniqueDates} / ${stats.plannedSessions} sessions`],
    ["Badge progress", `${progress.completed} / ${progress.required}`]
  ].map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("");
  recap.hidden = false;
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
  if (type === "Zone 2 Walk") return `
    <div class="form-grid"><label class="field"><span>Duration (minutes)</span><input type="number" name="minutes" min="1" max="600" required /></label>
    <label class="field"><span>Distance (miles)</span><input type="number" name="distance" min="0" step="0.01" /></label>
    <label class="field"><span>Average HR</span><input type="number" name="avgHr" min="40" max="220" /></label>
    <label class="field"><span>Talk-test rating</span><select name="talkTest"><option>Full sentences</option><option>Short sentences</option><option>Short phrases only</option><option>Too hard for Zone 2</option></select></label>
    <label class="field"><span>Route / incline</span><input name="route" placeholder="Outdoor loop, 5% treadmill..." /></label>
    <label class="field"><span>Effort (1–10)</span><input type="number" name="effort" min="1" max="10" required /></label></div>`;
  if (type === "VO₂ Intervals") return `
    <div class="form-grid"><label class="field"><span>Total duration (minutes)</span><input type="number" name="minutes" min="1" max="300" required /></label>
    <label class="field"><span>Rounds completed</span><input type="number" name="rounds" min="0" max="20" /></label>
    <label class="field"><span>Hard interval length (sec)</span><input type="number" name="hardSeconds" min="0" /></label>
    <label class="field"><span>Recovery length (sec)</span><input type="number" name="recoverySeconds" min="0" /></label>
    <label class="field"><span>Average HR</span><input type="number" name="avgHr" min="40" max="220" /></label>
    <label class="field"><span>Max HR</span><input type="number" name="maxHr" min="40" max="230" /></label>
    <label class="field"><span>Controlled finish?</span><select name="controlledFinish"><option>Yes — could repeat one</option><option>Yes — correctly spent</option><option>No — went too hard</option><option>Stopped early</option></select></label>
    <label class="field"><span>Effort (1–10)</span><input type="number" name="effort" min="1" max="10" required /></label></div>`;
  if (type === "Long Walk/Hike/Ruck") return `
    <div class="form-grid"><label class="field"><span>Duration (minutes)</span><input type="number" name="minutes" min="1" max="1440" required /></label>
    <label class="field"><span>Miles</span><input type="number" name="distance" min="0" step="0.1" /></label>
    <label class="field"><span>Pack weight (lb)</span><input type="number" name="packWeight" min="0" step="0.5" /></label>
    <label class="field"><span>Elevation gain (ft)</span><input type="number" name="elevation" min="0" step="10" /></label>
    <label class="field"><span>Terrain</span><select name="terrain"><option>Pavement</option><option>Rolling trail</option><option>Steep trail</option><option>Stairs</option><option>Snow</option></select></label>
    <label class="field"><span>Average HR</span><input type="number" name="avgHr" min="40" max="220" /></label>
    <label class="field"><span>Effort (1–10)</span><input type="number" name="effort" min="1" max="10" required /></label>
    <label class="field"><span>Pain notes</span><input name="painNotes" placeholder="Feet, knee, back, hot spots..." /></label></div>`;
  if (["Strength A", "Strength B"].includes(type)) {
    const movements = type === "Strength A" ? STRENGTH_A : STRENGTH_B;
    return `<div class="form-grid"><label class="field"><span>Duration (minutes)</span><input type="number" name="minutes" min="1" max="300" required /></label>
      <label class="field"><span>Session effort (1–10)</span><input type="number" name="effort" min="1" max="10" required /></label></div>
      <div class="strength-log">${movements.map((movement, index) => `<div class="strength-line"><strong>${movement.split("—")[0].trim()}</strong>
        <label class="field"><span>Sets</span><input type="number" name="sets${index}" min="0" /></label>
        <label class="field"><span>Reps</span><input type="number" name="reps${index}" min="0" /></label>
        <label class="field"><span>Weight</span><input type="number" name="weight${index}" min="0" step="0.5" /></label>
        <label class="field"><span>RPE</span><input type="number" name="rpe${index}" min="1" max="10" /></label></div>`).join("")}</div>`;
  }
  if (["Recovery Walk", "Mobility"].includes(type)) return `
    <div class="form-grid"><label class="field"><span>Duration (minutes)</span><input type="number" name="minutes" min="1" max="300" required /></label>
    <label class="field"><span>Body area</span><input name="bodyArea" placeholder="Hips, calves, full body..." /></label>
    <label class="field"><span>Effort (1–10)</span><input type="number" name="effort" min="1" max="10" required /></label>
    <label class="field"><span>Recovery notes</span><input name="recoveryNotes" placeholder="What felt better or tight?" /></label></div>`;
  if (["Tempo/Incline", "Hill Repeats", "Benchmark"].includes(type)) return `
    <div class="form-grid"><label class="field"><span>Duration (minutes)</span><input type="number" name="minutes" min="1" max="600" required /></label>
    <label class="field"><span>Distance (miles)</span><input type="number" name="distance" min="0" step="0.01" /></label>
    <label class="field"><span>Elevation gain (ft)</span><input type="number" name="elevation" min="0" step="10" /></label>
    <label class="field"><span>Average HR</span><input type="number" name="avgHr" min="40" max="220" /></label>
    <label class="field"><span>Max HR</span><input type="number" name="maxHr" min="40" max="230" /></label>
    <label class="field"><span>Route / incline</span><input name="route" /></label>
    <label class="field"><span>Effort (1–10)</span><input type="number" name="effort" min="1" max="10" required /></label></div>`;
  return `<div class="form-grid"><label class="field"><span>Duration (minutes)</span><input type="number" name="minutes" min="0" max="1440" value="0" required /></label>
    <label class="field"><span>Effort (1–10)</span><input type="number" name="effort" min="1" max="10" value="1" required /></label></div>`;
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
  syncBadgeUnlockDates();
  const score = readinessScore();
  const checkin = latest(state.weeklyCheckins) || {};
  const body = latest(state.checkins) || {};
  const scoreCard = document.querySelector("#progressScore").closest(".readiness-detail");
  scoreCard.classList.toggle("baseline", !score.hasBaseline);
  document.querySelector("#progressScore").textContent = score.hasBaseline ? score.total : "Building baseline...";
  document.querySelector("#progressTitle").textContent = score.hasBaseline ? score.title : `${state.sessions.filter(session => session.programId === state.selectedProgram).length}/3 sessions logged`;
  document.querySelector("#scoreBreakdown").innerHTML = score.hasBaseline
    ? Object.values(score.components).map(item => `<div class="score-component"><span>${item.label}</span><strong>${item.points}/${item.max}</strong></div>`).join("")
    : `<div class="pace-note">Mountain Readiness appears after three sessions so an empty week never looks like a failing score.</div>`;
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
  document.querySelector("#badgeGrid").innerHTML = activeProgram().badges
    .map((_, index) => badgeMarkup(index + 1, badgeEarned(index + 1))).join("");
  document.querySelector("#weeklyBars").innerHTML = activeProgram().weeks.map((week, index) => {
    const stats = weeklyStats(index + 1);
    const height = Math.min(100, Math.round(stats.cardio / Math.max(1, plannedCardioMinutes(index + 1)) * 100));
    return `<div class="weekly-column"><div class="weekly-bar"><i style="height:${height}%"></i></div><strong>W${index + 1}</strong><small>${stats.cardio}m · ${stats.completion}%</small></div>`;
  }).join("");
  renderSystemRings();
  renderWeeklySummary();
  const form = document.querySelector("#weeklyCheckinForm");
  if (!form.elements.date.value) form.elements.date.value = dateKey(activeDate());
}

function renderSystemRings() {
  if (!document.querySelector("#engineRing")) return;
  const week = currentWeek();
  const stats = weeklyStats(week);
  const cardioTarget = plannedCardioMinutes(week);
  const chassisTarget = Math.max(1, stats.plannedChassis);
  const values = [
    ["#engineRing", Math.min(100, stats.cardio / Math.max(1, cardioTarget) * 100), "#engineRingValue", stats.cardio, "#engineRingLabel", `${stats.cardio} / ${cardioTarget} cardio min`],
    ["#chassisRing", Math.min(100, stats.chassis / chassisTarget * 100), "#chassisRingValue", stats.chassis, "#chassisRingLabel", `${stats.chassis} / ${chassisTarget} durability session${chassisTarget === 1 ? "" : "s"}`],
    ["#consistencyRing", Math.min(100, stats.uniqueDates / Math.max(1, stats.plannedSessions) * 100), "#consistencyRingValue", stats.uniqueDates, "#consistencyRingLabel", `${stats.uniqueDates} / ${stats.plannedSessions} planned sessions`]
  ];
  values.forEach(([ring, percent, valueEl, value, labelEl, label]) => {
    setRingProgress(ring, percent * 3.6);
    document.querySelector(valueEl).textContent = value;
    document.querySelector(labelEl).textContent = label;
    document.querySelector(ring).setAttribute("aria-label", label);
  });
}

function renderWeeklySummary() {
  const week = currentWeek();
  const stats = weeklyStats(week);
  const planned = plannedCardioMinutes(week);
  const workouts = new Set(stats.logs.filter(log => log.type !== "Rest").map(log => log.date)).size;
  const vo2Count = stats.logs.filter(log => log.type === "VO₂ Intervals").length;
  const longDone = stats.logs.some(log => log.type === "Long Walk/Hike/Ruck");
  const pains = stats.logs.map(log => Number(log.pain || 0));
  const averagePain = pains.length ? (pains.reduce((sum, value) => sum + value, 0) / pains.length).toFixed(1) : "—";
  const currentCheckin = [...state.weeklyCheckins]
    .filter(item => item.programId === state.selectedProgram && currentWeek(atNoon(item.date)) === week)
    .sort((a, b) => a.date.localeCompare(b.date)).at(-1);
  const sessionConfidence = stats.logs.map(log => Number(log.confidence || 0)).filter(Boolean);
  const confidence = currentCheckin?.confidence || (sessionConfidence.length
    ? (sessionConfidence.reduce((sum, value) => sum + value, 0) / sessionConfidence.length).toFixed(1) : "—");
  const badgeUnlocked = badgeEarned(week);
  const badge = activeProgram().badges[week - 1];
  document.querySelector("#weeklyBadge").textContent = badgeUnlocked ? badge : "Badge locked";
  document.querySelector("#weeklyBadge").classList.toggle("done", badgeUnlocked);
  document.querySelector("#weeklySummary").innerHTML = [
    ["Cardio", `${stats.cardio} / ${planned} min`],
    ["Workouts", `${workouts} / 6`],
    ["VO₂ sessions", vo2Count],
    ["Long walk / hike", longDone ? "Completed" : "Not yet"],
    ["Average pain", averagePain === "—" ? "—" : `${averagePain}/10`],
    ["Confidence", confidence === "—" ? "—" : `${confidence}/10`],
    ["Completion", `${stats.completion}%`],
    ["Unlocked badge", badgeUnlocked ? badge : "Keep building"]
  ].map(([label, value]) => `<div class="summary-item"><span>${label}</span><strong>${value}</strong></div>`).join("");
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
let updateMiniWorkout = () => {};
function navigate(target) {
  document.querySelectorAll(".view").forEach(view => view.classList.toggle("active", view.dataset.view === target));
  document.querySelectorAll(".bottom-nav a").forEach(link => {
    const active = link.dataset.target === target;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  if (target === "today") renderToday();
  if (target === "plan") renderPlan(Number(document.querySelector("#phaseTabs .active")?.dataset.phase || 1));
  if (target === "log") renderLog();
  if (target === "progress") renderProgress();
  if (target === "coach") renderCoach();
  state.meta.lastTab = target;
  state.meta.lastOpenedDate = dateKey(today());
  saveState();
  updateMiniWorkout();
  window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}
function toast(message) {
  const el = document.querySelector("#toast");
  el.textContent = message; el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2200);
}
function showReward(badgeWeek = null) {
  const overlay = document.querySelector("#rewardOverlay");
  const art = document.querySelector("#rewardArt");
  if (badgeWeek) {
    document.querySelector("#rewardEyebrow").textContent = `Week ${badgeWeek} patch unlocked`;
    document.querySelector("#rewardTitle").textContent = activeProgram().badges[badgeWeek - 1];
    document.querySelector("#rewardMessage").textContent = BADGE_META[badgeWeek - 1][1];
    art.innerHTML = badgeMarkup(badgeWeek, true, true);
  } else {
    const readiness = currentReadiness().color || "green";
    const copy = readiness === "yellow"
      ? "Yellow day handled correctly. Consistency over ego."
      : readiness === "red" ? "You protected the streak and lived to train tomorrow." : "Another vote for future you.";
    document.querySelector("#rewardEyebrow").textContent = "Training logged";
    document.querySelector("#rewardTitle").textContent = "Session complete. Engine built.";
    document.querySelector("#rewardMessage").textContent = `${copy} Week ${currentWeek()} progress updated.`;
    art.innerHTML = `<div class="completion-mark"><svg viewBox="0 0 80 80" aria-hidden="true"><path d="m13 62 22-35 11 15 9-18 13 38z"/><path class="detail" d="m28 50 8 8 18-22"/></svg></div>`;
  }
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add("visible"));
  document.querySelector("#rewardDone").focus();
}
function closeReward() {
  const overlay = document.querySelector("#rewardOverlay");
  overlay.classList.remove("visible");
  setTimeout(() => { overlay.hidden = true; }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180);
}
function showNewBadge(before) {
  syncBadgeUnlockDates();
  const shown = programMetaBucket("badgeUnlocksShown");
  const newlyEarned = [...earnedBadgeWeeks()].find(week => !before.has(week) && !shown[week]);
  if (newlyEarned) {
    shown[newlyEarned] = true;
    saveState();
    showReward(newlyEarned);
  }
  return newlyEarned;
}

function showBadgeDetails(week) {
  const overlay = document.querySelector("#badgeDetailOverlay");
  if (!overlay) return;
  const earned = badgeEarned(week);
  const current = week === currentWeek() && !earned;
  const [kind, description] = BADGE_META[week - 1];
  const progress = badgeProgress(week);
  const unlockDate = badgeUnlockDate(week);
  document.querySelector("#badgeDetailArt").innerHTML = badgeMarkup(week, earned, true);
  document.querySelector("#badgeDetailStatus").textContent = earned ? `Week ${week} · Unlocked` : current ? `Week ${week} · In progress` : `Week ${week} · Locked`;
  document.querySelector("#badgeDetailTitle").textContent = activeProgram().badges[week - 1];
  document.querySelector("#badgeDetailDescription").textContent = description;
  document.querySelector("#badgeDetailFacts").innerHTML = [
    ["Requirement", badgeRequirement(week)],
    ["Progress", `${progress.completed} / ${progress.required} sessions (${progress.percent}%)`],
    ["Unlock date", unlockDate ? atNoon(unlockDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Not unlocked yet"]
  ].map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("");
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add("visible"));
  document.querySelector("#badgeDetailDone").focus();
}
function closeBadgeDetails() {
  const overlay = document.querySelector("#badgeDetailOverlay");
  if (!overlay) return;
  overlay.classList.remove("visible");
  setTimeout(() => { overlay.hidden = true; }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180);
}

function renderSavedState() {
  const saved = document.querySelector("#lastSavedToday");
  if (saved) saved.textContent = formatSavedTime(state.meta.lastSavedAt);
  document.querySelector("#appVersion").textContent = `Mountain Beast v${APP_VERSION}`;
  document.querySelector("#appUpdated").textContent = `Last app update: ${APP_UPDATED}`;

  const reminder = document.querySelector("#backupReminder");
  const backupTime = state.meta.lastBackupAt ? new Date(state.meta.lastBackupAt) : null;
  const days = backupTime ? Math.floor((Date.now() - backupTime.getTime()) / 86400000) : Infinity;
  reminder.classList.toggle("fresh", days < 7);
  reminder.textContent = days < 7
    ? `Your data lives on this device. Private backup exported ${days === 0 ? "today" : `${days} day${days === 1 ? "" : "s"} ago`}.`
    : "Your data lives on this device. You haven’t backed up in 7 days. Export a private backup.";
}

function upsertTodaySession(status) {
  const date = dateKey(activeDate());
  const raw = planFor();
  const plan = adjustedPlan(raw, currentReadiness().color);
  const index = state.sessions.findIndex(session =>
    session.date === date &&
    session.programId === state.selectedProgram &&
    (session.status || session.type === raw.type || session.plannedType === raw.type)
  );
  const existing = index >= 0 ? state.sessions[index] : null;
  const session = {
    ...(existing || {}),
    id: existing?.id || `${date}-${raw.type}-${Date.now()}`,
    date,
    type: status === "skipped" ? "Rest" : plan.type,
    plannedType: raw.type,
    minutes: status === "skipped" ? 0 : plan.minutes,
    effort: status === "skipped" ? 0 : Number(String(plan.effort).match(/\d+/)?.[0] || 5),
    notes: document.querySelector("#workoutNotes").value.trim(),
    pain: Number(existing?.pain || 0),
    confidence: Number(existing?.confidence || 0),
    breathing: existing?.breathing || "Normal",
    programId: state.selectedProgram,
    status
  };
  if (index >= 0) state.sessions[index] = session;
  else state.sessions.push(session);
  state.meta.todayNotes[date] = session.notes;
}

const timerState = {
  intervalId: null, remaining: 0, running: false,
  phases: [], phaseIndex: 0, totalRounds: 1, kind: null,
  deadline: null, totalSeconds: 0
};

function timerText(seconds) {
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
function firstMinutes(items, fallback) {
  const match = (items || []).join(" ").match(/(\d+)\s*min/i);
  return match ? Number(match[1]) : fallback;
}
function intervalPhases(plan) {
  const text = (plan.main || []).join(" ");
  const rounds = Number(text.match(/(\d+)\s*round/i)?.[1] || 5);
  const hardMatch = text.match(/(\d+)\s*(min|sec)[^+]*hard/i);
  const easyMatch = text.match(/\+\s*(\d+)\s*(min|sec)\s*(easy|recovery)/i);
  const toSeconds = match => match ? Number(match[1]) * (match[2].toLowerCase() === "min" ? 60 : 1) : 60;
  const hard = toSeconds(hardMatch);
  const easy = easyMatch ? toSeconds(easyMatch) : 120;
  const phases = [];
  for (let round = 1; round <= rounds; round += 1) {
    phases.push({ label: "Hard interval", seconds: hard, round });
    phases.push({ label: "Easy recovery", seconds: easy, round });
  }
  return { phases, rounds };
}
function renderTimer() {
  const phase = timerState.phases[timerState.phaseIndex];
  const next = timerState.phases[timerState.phaseIndex + 1];
  const completedSeconds = timerState.phases.slice(0, timerState.phaseIndex).reduce((sum, item) => sum + item.seconds, 0);
  const phaseElapsed = phase ? Math.max(0, phase.seconds - timerState.remaining) : 0;
  const percent = timerState.totalSeconds ? Math.min(100, Math.round((completedSeconds + phaseElapsed) / timerState.totalSeconds * 100)) : 0;
  document.querySelector("#timerPhase").textContent = phase?.label || "Timer complete";
  document.querySelector("#timerDisplay").textContent = timerText(timerState.remaining);
  document.querySelector("#timerRound").textContent = timerState.totalRounds > 1
    ? `Round ${phase?.round || 1} of ${timerState.totalRounds}` : "";
  const nextLabel = document.querySelector("#timerNext");
  if (nextLabel) nextLabel.textContent = next ? `Next: ${timerText(next.seconds)} ${next.label.toLowerCase()}` : phase ? "Final phase" : "Ready to log";
  const progress = document.querySelector("#timerProgress");
  if (progress) progress.style.width = `${percent}%`;
  document.querySelector("#timerPause").textContent = timerState.running ? "Pause" : "Resume";
  document.querySelector("#timerPause").disabled = !phase;
  const panel = document.querySelector("#timerPanel");
  panel.classList.toggle("hard-phase", timerState.running && phase?.label === "Hard interval");
  panel.classList.toggle("easy-phase", timerState.running && phase?.label === "Easy recovery");
  const finish = document.querySelector("#timerFinish");
  if (finish) finish.hidden = !!phase;
}
function persistTimer() {
  state.meta.timer = timerState.phases.length ? {
    kind: timerState.kind, phases: timerState.phases, phaseIndex: timerState.phaseIndex,
    remaining: timerState.remaining, running: timerState.running, totalRounds: timerState.totalRounds,
    deadline: timerState.deadline, totalSeconds: timerState.totalSeconds,
    programId: state.selectedProgram, date: dateKey(activeDate())
  } : null;
  saveState();
}
function stopTimer(hide = true, clear = false) {
  clearInterval(timerState.intervalId);
  timerState.intervalId = null;
  timerState.running = false;
  timerState.deadline = null;
  if (clear) {
    Object.assign(timerState, { remaining: 0, phases: [], phaseIndex: 0, totalRounds: 1, kind: null, totalSeconds: 0 });
    state.meta.timer = null;
    saveState();
    const finish = document.querySelector("#timerFinish");
    if (finish) finish.hidden = true;
  } else {
    persistTimer();
  }
  if (hide) document.querySelector("#timerPanel").hidden = true;
}
function reconcileTimer() {
  if (!timerState.running || !timerState.deadline) return;
  let remaining = Math.ceil((timerState.deadline - Date.now()) / 1000);
  while (remaining <= 0) {
    const overrun = Math.abs(remaining);
    timerState.phaseIndex += 1;
    const next = timerState.phases[timerState.phaseIndex];
    if (!next) {
      clearInterval(timerState.intervalId);
      timerState.intervalId = null;
      timerState.running = false;
      timerState.deadline = null;
      timerState.remaining = 0;
      persistTimer();
      renderTimer();
      toast("Timer complete ✓");
      return;
    }
    remaining = next.seconds - overrun;
    timerState.deadline = Date.now() + Math.max(0, remaining) * 1000;
    persistTimer();
  }
  timerState.remaining = remaining;
}
function tickTimer() {
  reconcileTimer();
  renderTimer();
}
function startTimer(kind) {
  stopTimer(false);
  const plan = adjustedPlan(planFor(), currentReadiness().color);
  let phases;
  let totalRounds = 1;
  if (kind === "interval") {
    const parsed = intervalPhases(plan);
    phases = parsed.phases;
    totalRounds = parsed.rounds;
  } else {
    const minutes = kind === "warmup"
      ? firstMinutes(plan.warmup, 5)
      : kind === "cooldown" ? firstMinutes(plan.cooldown, 5) : plan.minutes;
    phases = [{
      label: kind === "warmup" ? "Warm-up" : kind === "cooldown" ? "Cool-down" : "Main workout",
      seconds: minutes * 60,
      round: 1
    }];
  }
  const totalSeconds = phases.reduce((sum, phase) => sum + phase.seconds, 0);
  Object.assign(timerState, {
    kind, phases, phaseIndex: 0, remaining: phases[0].seconds, running: true, totalRounds,
    deadline: Date.now() + phases[0].seconds * 1000, totalSeconds
  });
  document.querySelector("#timerPanel").hidden = false;
  const finish = document.querySelector("#timerFinish");
  if (finish) finish.hidden = true;
  persistTimer();
  renderTimer();
  timerState.intervalId = setInterval(tickTimer, 1000);
}
function resetTimer() {
  if (timerState.kind) startTimer(timerState.kind);
}
function restoreTimer() {
  const saved = state.meta.timer;
  if (!saved || saved.programId !== state.selectedProgram || saved.date !== dateKey(activeDate())) return;
  clearInterval(timerState.intervalId);
  Object.assign(timerState, saved, { intervalId: null });
  document.querySelector("#timerPanel").hidden = false;
  if (timerState.running) {
    reconcileTimer();
    if (timerState.running) timerState.intervalId = setInterval(tickTimer, 1000);
  }
  renderTimer();
}

function bootstrapApp() {
const bottomNav = document.querySelector("#bottomNav");
if (!bottomNav) {
  console.error("Mountain Beast could not start: bottom navigation is missing.");
  return;
}
document.querySelectorAll(".reward-overlay").forEach(overlay => {
  overlay.hidden = true;
  overlay.classList.remove("visible");
});
const settingsDialog = document.querySelector("#settingsDialog");
if (settingsDialog?.open) settingsDialog.close();
function fallbackNavigate(target) {
  document.querySelectorAll(".view").forEach(view => view.classList.toggle("active", view.dataset.view === target));
  document.querySelectorAll(".bottom-nav a").forEach(link => link.classList.toggle("active", link.dataset.target === target));
  window.scrollTo({ top: 0, behavior: "auto" });
}

let lastScrollY = window.scrollY;
let scrollFrame = null;
let navExpandLockUntil = 0;

function setNavCompact(compact) {
  bottomNav.classList.toggle("compact", compact);
}

function expandNavForInteraction() {
  navExpandLockUntil = Date.now() + 900;
  setNavCompact(false);
}

function updateNavForScroll() {
  scrollFrame = null;
  const currentY = Math.max(0, window.scrollY);
  const delta = currentY - lastScrollY;
  const nearTop = currentY <= 40;

  if (nearTop || delta < -4) {
    setNavCompact(false);
  } else if (currentY > 80 && delta > 4 && Date.now() > navExpandLockUntil) {
    setNavCompact(true);
  }
  lastScrollY = currentY;
  updateMiniWorkout();
}

updateMiniWorkout = function updateMiniWorkoutView() {
  const mini = document.querySelector("#miniWorkout");
  const card = document.querySelector("#todayWorkoutCard");
  if (!mini || !card) return;
  const todayView = document.querySelector('[data-view="today"]').classList.contains("active");
  const workoutPassed = card.getBoundingClientRect().bottom < 120;
  mini.classList.toggle("visible", todayView && workoutPassed && window.scrollY > 100);
};

window.addEventListener("scroll", () => {
  if (scrollFrame == null) scrollFrame = requestAnimationFrame(updateNavForScroll);
}, { passive: true });
bottomNav.addEventListener("pointerdown", expandNavForInteraction);
bottomNav.addEventListener("focusin", expandNavForInteraction);
bottomNav.addEventListener("keydown", expandNavForInteraction);

document.querySelector("#onboardingForm")?.addEventListener("submit", event => {
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
  document.querySelector("#onboarding").hidden = true;
  savedLocally("Training block ready ✓");
  renderAll();
});

document.querySelectorAll("[data-readiness]").forEach(button => button.addEventListener("click", () => {
  state.readiness[dateKey(activeDate())] = { color: button.dataset.readiness, note: document.querySelector("#readinessNote").value.trim() };
  savedLocally();
  renderToday();
}));
document.querySelector("#readinessNote")?.addEventListener("change", event => {
  const current = currentReadiness();
  state.readiness[dateKey(activeDate())] = { color: current.color, note: event.target.value.trim() };
  savedLocally();
});
let noteSaveTimer = null;
document.querySelector("#workoutNotes")?.addEventListener("input", event => {
  state.meta.todayNotes[dateKey(activeDate())] = event.target.value;
  saveState();
  clearTimeout(noteSaveTimer);
  noteSaveTimer = setTimeout(() => savedLocally(), 700);
});
document.querySelector("#workoutNotes")?.addEventListener("change", event => {
  clearTimeout(noteSaveTimer);
  state.meta.todayNotes[dateKey(activeDate())] = event.target.value.trim();
  savedLocally();
});
document.querySelector("#completeTodayButton")?.addEventListener("click", () => {
  const earnedBefore = earnedBadgeWeeks();
  upsertTodaySession("completed");
  savedLocally("Session complete ✓");
  renderToday();
  renderProgress();
  pulseRing("#weekRing");
  pulseRing("#readinessRing");
  if (!showNewBadge(earnedBefore)) showReward();
});
document.querySelector("#reduceTodayButton")?.addEventListener("click", () => {
  state.readiness[dateKey(activeDate())] = { color: "yellow", note: document.querySelector("#readinessNote").value.trim() };
  savedLocally("Yellow version ready ✓");
  renderToday();
});
document.querySelector("#skipTodayButton")?.addEventListener("click", () => {
  upsertTodaySession("skipped");
  savedLocally("Protected the streak ✓");
  renderToday();
  renderProgress();
});
document.querySelectorAll("[data-timer-kind]").forEach(button => button.addEventListener("click", () => startTimer(button.dataset.timerKind)));
document.querySelector("#timerPause")?.addEventListener("click", () => {
  if (timerState.running) {
    reconcileTimer();
    clearInterval(timerState.intervalId);
    timerState.intervalId = null;
    timerState.running = false;
    timerState.deadline = null;
  } else if (timerState.remaining > 0) {
    timerState.running = true;
    timerState.deadline = Date.now() + timerState.remaining * 1000;
    timerState.intervalId = setInterval(tickTimer, 1000);
  }
  persistTimer();
  renderTimer();
});
document.querySelector("#timerReset")?.addEventListener("click", resetTimer);
document.querySelector("#timerStop")?.addEventListener("click", () => stopTimer(true, true));
document.querySelector("#timerFinish")?.addEventListener("click", () => {
  stopTimer(true, true);
  document.querySelector("#logTodayButton").click();
});
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && timerState.running) {
    reconcileTimer();
    renderTimer();
  }
});
document.querySelector("#miniWorkout")?.addEventListener("click", () => {
  expandNavForInteraction();
  document.querySelector("#todayWorkoutCard").scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start"
  });
});
document.querySelector("#rewardClose")?.addEventListener("click", closeReward);
document.querySelector("#rewardDone")?.addEventListener("click", closeReward);
document.querySelector("#rewardOverlay")?.addEventListener("click", event => {
  if (event.target === event.currentTarget) closeReward();
});
document.querySelector("#badgeGrid")?.addEventListener("click", event => {
  const badge = event.target.closest("[data-badge-week]");
  if (badge) showBadgeDetails(Number(badge.dataset.badgeWeek));
});
document.querySelector("#badgeDetailClose")?.addEventListener("click", closeBadgeDetails);
document.querySelector("#badgeDetailDone")?.addEventListener("click", closeBadgeDetails);
document.querySelector("#badgeDetailOverlay")?.addEventListener("click", event => {
  if (event.target === event.currentTarget) closeBadgeDetails();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !document.querySelector("#rewardOverlay").hidden) closeReward();
  if (event.key === "Escape" && !document.querySelector("#badgeDetailOverlay").hidden) closeBadgeDetails();
});
document.querySelector("#logTodayButton")?.addEventListener("click", () => {
  navigate("log"); history.replaceState(null, "", "#log");
  const plan = adjustedPlan(planFor(), currentReadiness().color);
  const form = document.querySelector("#sessionForm");
  form.elements.date.value = dateKey(activeDate());
  form.elements.type.value = plan.type;
  document.querySelector("#dynamicLogFields").innerHTML = dynamicFields(plan.type);
  form.elements.minutes.value = plan.minutes;
  form.elements.effort.value = Number(String(plan.effort).match(/\d+/)?.[0] || 5);
  form.elements.notes.value = document.querySelector("#workoutNotes").value;
});
document.querySelector("#sessionType")?.addEventListener("change", event => document.querySelector("#dynamicLogFields").innerHTML = dynamicFields(event.target.value));
document.querySelector("#sessionForm")?.addEventListener("submit", event => {
  event.preventDefault();
  const earnedBefore = earnedBadgeWeeks();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  ["minutes","effort","avgHr","maxHr","energy","confidence","pain","distance","elevation","pace","rounds","hardSeconds","recoverySeconds","packWeight","feetPain","jointPain"]
    .forEach(key => { if (key in data) data[key] = Number(data[key]) || 0; });
  Object.keys(data).filter(key => /^(sets|reps|weight|rpe)\d+$/.test(key))
    .forEach(key => data[key] = Number(data[key]) || 0);
  data.programId = state.selectedProgram;
  data.id = `${data.date}-${data.type}-${Date.now()}`;
  state.sessions.push(data);
  if (data.type === "Long Walk/Hike/Ruck") state.rucks.push({ date: data.date, miles: data.distance, packWeight: data.packWeight, elevation: data.elevation, minutes: data.minutes, terrain: data.terrain, pain: data.pain, notes: data.painNotes || data.notes });
  event.currentTarget.reset();
  event.currentTarget.elements.date.value = dateKey(activeDate());
  populateSessionTypes();
  savedLocally("Session saved locally ✓");
  renderLog(); renderProgress(); renderToday();
  showNewBadge(earnedBefore);
});
document.querySelector("#weeklyCheckinForm")?.addEventListener("submit", event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  ["vo2","restingHr","weight","longestDistance","routeAvgHr","energy","sleep","confidence"].forEach(key => data[key] = Number(data[key]) || 0);
  data.programId = state.selectedProgram;
  const existing = state.weeklyCheckins.findIndex(item => item.date === data.date && item.programId === state.selectedProgram);
  if (existing >= 0) state.weeklyCheckins[existing] = data; else state.weeklyCheckins.push(data);
  if (data.weight) state.checkins.push({ date: data.date, weight: data.weight });
  savedLocally("Weekly check-in saved ✓");
  renderProgress(); renderToday();
});
bottomNav.addEventListener("click", event => {
  const link = event.target.closest("a[data-target]");
  if (!link || !bottomNav.contains(link)) return;
  event.preventDefault();
  expandNavForInteraction();
  history.replaceState(null, "", link.hash);
  try {
    navigate(link.dataset.target);
  } catch (error) {
    console.error("Mountain Beast tab render failed; using basic navigation.", error);
    fallbackNavigate(link.dataset.target);
  }
});
document.querySelectorAll("#phaseTabs button").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll("#phaseTabs button").forEach(item => item.classList.toggle("active", item === button));
  renderPlan(Number(button.dataset.phase));
}));
function changeProgram(value) {
  if (!PROGRAMS[value]) return;
  state.selectedProgram = value; savedLocally(); renderAll();
}
document.querySelector("#programSelector")?.addEventListener("change", event => changeProgram(event.target.value));
document.querySelector("#settingsProgramSelector")?.addEventListener("change", event => changeProgram(event.target.value));

const dialog = document.querySelector("#settingsDialog");
document.querySelector("#settingsButton")?.addEventListener("click", () => dialog?.showModal());
document.querySelector("#closeSettings")?.addEventListener("click", () => dialog?.close());
document.querySelector("#editProfile")?.addEventListener("click", () => { dialog?.close(); showOnboarding(); });
document.querySelector("#exportData")?.addEventListener("click", () => {
  state.meta.lastBackupAt = new Date().toISOString();
  state.meta.lastSavedAt = state.meta.lastBackupAt;
  saveState();
  renderSavedState();
  const blob = new Blob([JSON.stringify({ version: 5, exportedAt: state.meta.lastBackupAt, state }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob); const link = document.createElement("a");
  link.href = url; link.download = `mountain-beast-backup-${dateKey(today())}.json`; link.click(); URL.revokeObjectURL(url);
  toast("Private backup exported ✓");
});
document.querySelector("#importData")?.addEventListener("change", async event => {
  try {
    const parsed = JSON.parse(await event.target.files[0].text());
    if (!parsed.state) throw new Error();
    state = migrate(parsed.state); savedLocally("Backup restored ✓"); renderAll(); dialog.close();
  } catch { toast("Backup file is not valid"); }
  event.target.value = "";
});
document.querySelector("#healthImport")?.addEventListener("change", async event => {
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
    savedLocally("Apple Health imported ✓"); renderHealthSummary(); renderProgress(); renderToday();
  } catch { toast("Choose the extracted Apple Health export.xml file"); }
  event.target.value = "";
});
document.querySelector("#resetData")?.addEventListener("click", () => {
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
  restoreTimer();
  renderSavedState();
  const todayKey = dateKey(today());
  const sameDay = state.meta.lastOpenedDate === todayKey;
  const remembered = ["today","plan","log","progress","coach"].includes(state.meta.lastTab) ? state.meta.lastTab : "today";
  const target = sameDay ? remembered : "today";
  history.replaceState(null, "", `#${target}`);
  navigate(target);
  if (!state.setup?.completed) showOnboarding();
}

let waitingWorker = null;
let serviceWorkerRegistration = null;
function showUpdateBanner(worker) {
  waitingWorker = worker;
  const banner = document.querySelector("#updateBanner");
  if (banner) banner.hidden = false;
}
async function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
  const registration = await navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" });
  serviceWorkerRegistration = registration;
  if (registration.waiting && navigator.serviceWorker.controller) showUpdateBanner(registration.waiting);
  registration.addEventListener("updatefound", () => {
    const worker = registration.installing;
    worker?.addEventListener("statechange", () => {
      if (worker.state === "installed" && navigator.serviceWorker.controller) {
        showUpdateBanner(registration.waiting || worker);
      }
    });
  });
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    document.querySelector("#updateBanner")?.setAttribute("hidden", "");
    location.reload();
  }, { once: true });
  registration.update().catch(() => {});
}
document.querySelector("#updateNow")?.addEventListener("click", async event => {
  const button = event.currentTarget;
  button.disabled = true;
  button.textContent = "Updating…";
  const banner = document.querySelector("#updateBanner");
  if (banner) banner.style.pointerEvents = "none";

  try {
    const registration = serviceWorkerRegistration || await navigator.serviceWorker.getRegistration();
    const worker = waitingWorker || registration?.waiting;
    if (worker) {
      worker.postMessage({ type: "SKIP_WAITING" });
      setTimeout(() => location.reload(), 1800);
      return;
    }
    await registration?.update();
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      setTimeout(() => location.reload(), 1800);
      return;
    }
  } catch (error) {
    console.warn("Mountain Beast update check failed; reloading directly.", error);
  }

  const freshUrl = new URL(location.href);
  freshUrl.searchParams.set("mb-update", Date.now());
  location.replace(freshUrl.href);
});
registerServiceWorker().catch(error => console.warn("Service worker registration failed.", error));
try {
  renderAll();
} catch (error) {
  console.error("Mountain Beast startup render failed; enabling basic tab navigation.", error);
  fallbackNavigate(["today","plan","log","progress","coach"].includes(location.hash.slice(1)) ? location.hash.slice(1) : "today");
}
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrapApp, { once: true });
} else {
  bootstrapApp();
}
