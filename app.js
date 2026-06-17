const VO2_BADGES = [
  "Started the Engine", "Showed Up Again", "First Build Week", "Smart Deload",
  "Engine Builder", "Hill Strong", "Longer Intervals Unlocked", "Absorbed the Work",
  "4-Minute Engine", "Full VO₂ Session", "Peak Week", "Purpose Engine Rebuilt"
];
const S = (type, title, minutes, effort, warmup = [], main = [], cooldown = [], victory = "") => ({
  type, title, minutes, effort, warmup, main, cooldown, victory
});
const WEEK = (phase, theme, target, victory, sessions) => ({
  phase, theme, target, victory,
  days: sessions.map(([type, title, minutes, effort, warmup = [], main = [], cooldown = []]) =>
    S(type, title, minutes, effort, warmup, main, cooldown)
  )
});
const VO2_WEEKS = [
  WEEK(1, "Start clean", "150–170 min", "Complete the week without feeling destroyed.", [
    ["Zone 2 Walk","Zone 2 walk",30,"4/10",[],["Comfortable outdoor walk; full-sentence pace"],["2–5 min easy"]],
    ["Strength A","Strength A",30,"5/10",["5 min easy"],["Leg press or goblet squat 3×5","DB bench or push-ups 3×5","Seated cable row 3×8","RDL or hamstring curl 3×8","Plank 3×20–40 sec"],["Optional 10 min easy walk"]],
    ["VO₂ Intervals","VO₂ intro intervals",30,"8/10",["10 min easy"],["5 rounds: 1 min hard + 2 min easy"],["5–10 min easy"]],
    ["Recovery Walk","Recovery walk",25,"2–3/10",[],["20–30 min very easy"],["Light mobility"]],
    ["Tempo/Incline","Incline or hill walk",25,"5–6/10",["5 min easy"],["15 min controlled incline/hills"],["5 min easy"]],
    ["Long Walk/Hike/Ruck","Long walk or easy hike",55,"4/10",[],["50–60 min easy; no pack or tiny day pack"],["Feet and joint check"]],
    ["Rest","Rest",0,"Rest",[],["Full rest"],[]]
  ]),
  WEEK(1, "Repeat and settle in", "170–190 min", "Same workouts feel slightly less intimidating.", [
    ["Zone 2 Walk","Zone 2 walk",35,"4–5/10",[],["35 min full-sentence pace"],["Easy finish"]],
    ["Strength A","Strength A",30,"5/10",["5 min easy"],["Strength A; leave 2–3 reps in reserve"],["Easy walk optional"]],
    ["VO₂ Intervals","VO₂ intervals",33,"8/10",["10 min easy"],["6 rounds: 1 min hard + 2 min easy"],["5–10 min easy"]],
    ["Recovery Walk","Recovery walk",27,"2–3/10",[],["25–30 min very easy"],["Light mobility"]],
    ["Tempo/Incline","Incline or hill walk",30,"5–6/10",["5 min easy"],["20 min controlled incline/hills"],["5 min easy"]],
    ["Long Walk/Hike/Ruck","Long walk or easy hike",65,"4/10",[],["60–70 min easy"],["Feet and joint check"]],
    ["Rest","Rest",0,"Rest",[],["Full rest"],[]]
  ]),
  WEEK(1, "First real build week", "190–215 min", "Breathing gets hard, but you stay in control.", [
    ["Zone 2 Walk","Zone 2 walk",40,"4–5/10",[],["40 min controlled"],["Easy finish"]],
    ["Strength A","Strength A",35,"5/10",["5 min easy"],["Strength A; clean reps only"],["Mobility"]],
    ["VO₂ Intervals","VO₂ intervals",35,"8/10",["10 min easy"],["5 rounds: 90 sec hard + 2 min easy"],["5–10 min easy"]],
    ["Recovery Walk","Recovery walk",30,"2–3/10",[],["25–35 min easy"],["Light mobility"]],
    ["Tempo/Incline","Tempo incline walk",30,"6–7/10",["10 min easy"],["15 min steady strong"],["5 min easy"]],
    ["Long Walk/Hike/Ruck","Long walk or easy hike",72,"4/10",[],["70–75 min easy"],["Feet and joint check"]],
    ["Rest","Rest",0,"Rest",[],["Full rest"],[]]
  ]),
  WEEK(1, "Deload and absorb", "145–170 min", "Finish the week fresher than you started.", [
    ["Zone 2 Walk","Zone 2 walk",32,"4/10",[],["30–35 min easy"],["Easy finish"]],
    ["Mobility","Light strength or mobility",25,"3–4/10",["5 min easy"],["Reduce normal strength volume by 40–50%"],["Mobility"]],
    ["VO₂ Intervals","Easy VO₂ practice",27,"7–8/10",["10 min easy"],["4 rounds: 1 min hard + 2 min easy"],["5–10 min easy"]],
    ["Recovery Walk","Recovery walk",25,"2–3/10",[],["20–30 min easy"],["Light mobility"]],
    ["Tempo/Incline","Easy hills or incline",25,"4–5/10",["5 min easy"],["15 min easy hills"],["5 min easy"]],
    ["Long Walk/Hike/Ruck","Long walk",60,"4/10",[],["55–65 min easy"],["Finish fresh"]],
    ["Rest","Rest",0,"Rest",[],["Full rest"],[]]
  ]),
  WEEK(2, "Step into real intervals", "210–235 min", "Complete 2-minute intervals without sprinting.", [
    ["Zone 2 Walk","Zone 2 walk",42,"4–5/10",[],["40–45 min controlled"],["Easy finish"]],
    ["Strength A","Strength A",35,"5/10",["5 min easy"],["Strength A; 2–3 reps in reserve"],["Mobility"]],
    ["VO₂ Intervals","VO₂ intervals",38,"8–9/10",["10–12 min easy"],["4 rounds: 2 min hard + 3 min easy"],["8–10 min easy"]],
    ["Recovery Walk","Recovery walk",30,"2–3/10",[],["25–35 min easy"],["Light mobility"]],
    ["Tempo/Incline","Tempo incline walk",30,"6–7/10",["10 min easy"],["15 min strong steady"],["5 min easy"]],
    ["Long Walk/Hike/Ruck","Long walk or hike",80,"4/10",[],["75–85 min easy; optional 5–10 lb pack"],["Joint check"]],
    ["Rest","Rest",0,"Rest",[],["Full rest"],[]]
  ]),
  WEEK(2, "More time under control", "230–255 min", "Feel stronger on hills.", [
    ["Zone 2 Walk","Zone 2 walk",45,"4–5/10",[],["45 min controlled"],["Easy finish"]],
    ["Strength B","Strength A or B",35,"5/10",["5 min easy"],["Choose Strength A or B; clean reps"],["Mobility"]],
    ["VO₂ Intervals","VO₂ intervals",43,"8–9/10",["10–12 min easy"],["5 rounds: 2 min hard + 3 min easy"],["8–10 min easy"]],
    ["Recovery Walk","Recovery walk",30,"2–3/10",[],["30 min easy"],["Light mobility"]],
    ["Hill Repeats","Hill repeats",35,"6–8/10",["10 min easy"],["6 rounds: 1 min uphill strong + 2 min easy"],["5–10 min easy"]],
    ["Long Walk/Hike/Ruck","Long walk or hike",87,"4/10",[],["85–90 min easy; optional 5–10 lb pack"],["Joint check"]],
    ["Rest","Rest",0,"Rest",[],["Full rest"],[]]
  ]),
  WEEK(2, "First big confidence week", "245–270 min", "Prove you can handle longer hard work.", [
    ["Zone 2 Walk","Zone 2 walk",47,"4–5/10",[],["45–50 min controlled"],["Easy finish"]],
    ["Strength B","Strength A or B",35,"5/10",["5 min easy"],["Choose Strength A or B"],["Mobility"]],
    ["VO₂ Intervals","VO₂ intervals",44,"8–9/10",["12 min easy"],["4 rounds: 3 min hard + 3 min easy"],["8–10 min easy"]],
    ["Recovery Walk","Recovery walk",32,"2–3/10",[],["30–35 min easy"],["Light mobility"]],
    ["Tempo/Incline","Tempo incline walk",35,"6–7/10",["10 min easy"],["20 min steady strong"],["5 min easy"]],
    ["Long Walk/Hike/Ruck","Long walk or hike",95,"4/10",[],["90–100 min easy; 5–10 lb only if joints feel good"],["Joint check"]],
    ["Rest","Rest",0,"Rest",[],["Full rest"],[]]
  ]),
  WEEK(2, "Deload and lock it in", "185–215 min", "Feel hungry for the next phase, not beaten down.", [
    ["Zone 2 Walk","Zone 2 walk",37,"4/10",[],["35–40 min easy"],["Easy finish"]],
    ["Mobility","Light strength or mobility",25,"3–4/10",["5 min easy"],["Reduce volume by 40–50%"],["Mobility"]],
    ["VO₂ Intervals","Controlled intervals",38,"8/10",["10 min easy"],["4 rounds: 2 min hard + 3 min easy"],["8–10 min easy"]],
    ["Recovery Walk","Recovery walk",27,"2–3/10",[],["25–30 min easy"],["Light mobility"]],
    ["Tempo/Incline","Easy incline walk",27,"4–5/10",["5 min easy"],["15–20 min easy incline"],["5 min easy"]],
    ["Long Walk/Hike/Ruck","Long walk",75,"4/10",[],["70–80 min easy"],["Finish fresh"]],
    ["Rest","Rest",0,"Rest",[],["Full rest"],[]]
  ]),
  WEEK(3, "Enter the 4-minute phase", "255–285 min", "Finish 4-minute intervals with discipline, not panic.", [
    ["Zone 2 Walk","Zone 2 walk",50,"4–5/10",[],["50 min controlled"],["Easy finish"]],
    ["Strength A","Strength A",35,"5/10",["5 min easy"],["Strength A; no grinding"],["Mobility"]],
    ["VO₂ Intervals","4-minute VO₂ intervals",42,"8–9/10",["12 min easy"],["3 rounds: 4 min hard + 3 min easy"],["8–10 min easy"]],
    ["Recovery Walk","Recovery walk",32,"2–3/10",[],["30–35 min easy"],["Light mobility"]],
    ["Tempo/Incline","Tempo incline walk",35,"6–7/10",["10 min easy"],["20 min steady strong"],["5 min easy"]],
    ["Long Walk/Hike/Ruck","Long walk or hike",105,"4/10",[],["100–110 min easy; 10–15 lb only if joints feel good"],["Joint check"]],
    ["Rest","Rest",0,"Rest",[],["Full rest"],[]]
  ]),
  WEEK(3, "Full VO₂ max work", "280–310 min", "Complete the hardest clean week of the block.", [
    ["Zone 2 Walk","Zone 2 walk",52,"4–5/10",[],["50–55 min controlled"],["Easy finish"]],
    ["Strength B","Strength A or B",35,"5/10",["5 min easy"],["Choose Strength A or B"],["Mobility"]],
    ["VO₂ Intervals","Full VO₂ session",50,"8–9/10",["12–15 min easy"],["4 rounds: 4 min hard + 3 min easy"],["8–10 min easy"]],
    ["Recovery Walk","Recovery walk",35,"2–3/10",[],["30–40 min easy"],["Light mobility"]],
    ["Tempo/Incline","Hill or incline tempo",37,"6–7/10",["10 min easy"],["20–25 min strong controlled"],["5 min easy"]],
    ["Long Walk/Hike/Ruck","Long walk or hike",115,"4/10",[],["110–120 min easy; 10–15 lb only if ready"],["Joint check"]],
    ["Rest","Rest",0,"Rest",[],["Full rest"],[]]
  ]),
  WEEK(3, "Strongest week", "290–320 min", "Complete the strongest week without extra ego work.", [
    ["Zone 2 Walk","Zone 2 walk",57,"4–5/10",[],["55–60 min controlled"],["Easy finish"]],
    ["Strength A","Light Strength A",32,"4–5/10",["5 min easy"],["Strength A lighter than normal"],["Mobility"]],
    ["VO₂ Intervals","Peak VO₂ intervals",52,"8–9/10",["12–15 min easy"],["4 rounds: 4 min hard + 3 min easy"],["10 min easy"]],
    ["Recovery Walk","Recovery walk",32,"2–3/10",[],["30–35 min easy"],["Light mobility"]],
    ["Tempo/Incline","Tempo incline walk",40,"6–7/10",["10 min easy"],["25 min steady strong"],["5 min easy"]],
    ["Long Walk/Hike/Ruck","Long walk or hike",120,"4/10",[],["120 min easy and controlled"],["Joint check"]],
    ["Rest","Rest",0,"Rest",[],["Full rest"],[]]
  ]),
  WEEK(3, "Test and celebrate", "180–230 min", "Beat Week 1 in pace, HR, distance, confidence, or VO₂ max.", [
    ["Zone 2 Walk","Zone 2 walk",40,"4/10",[],["35–45 min easy"],["Easy finish"]],
    ["Mobility","Light strength or mobility",25,"3–4/10",["5 min easy"],["Light support work only"],["Mobility"]],
    ["VO₂ Intervals","Final VO₂ session",43,"8–9/10",["12 min easy"],["3 rounds: 4 min hard + 3 min easy"],["10 min easy"]],
    ["Recovery Walk","Recovery walk",27,"2–3/10",[],["25–30 min easy"],["Light mobility"]],
    ["Recovery Walk","Easy walk",25,"2–3/10",[],["20–30 min easy"],["Finish fresh"]],
    ["Benchmark","Benchmark day",30,"7–9/10",["10–12 min progressive"],["Choose: 30-min same-route walk; 12-min run/walk; or 90-min confidence hike"],["10 min easy; record distance, HR, effort, confidence"]],
    ["Rest","Full rest",0,"Rest",[],["Celebrate and recover"],[]]
  ])
];
const STRENGTH_A = ["Leg press or goblet squat — 3×5","DB bench press or push-ups — 3×5","Seated cable row — 3×8","RDL or hamstring curl — 3×8","Plank — 3×20–40 sec"];
const STRENGTH_B = ["Trap bar deadlift, RDL, or hinge machine — 3×5","Split squat or step-up — 2×8/leg","Lat pulldown — 3×8","DB shoulder press — 3×5","Dead bug — 3×8/side"];
const PROGRAMS = {
  "vo2-rebuild": {
    id: "vo2-rebuild",
    name: "12-Week VO₂ Max Rebuild",
    shortName: "VO₂ Max Rebuild",
    weeks: VO2_WEEKS,
    badges: VO2_BADGES
  }
};
const FUTURE_PROGRAMS = ["5K Builder", "Strength Base", "Rainier Hiking Prep", "Ruck Builder", "Health + Longevity", "Conditioning", "Maintenance Mode"];

const STORAGE_KEY = "mountain-beast-v1";
const DEFAULT_START = "2026-06-15";
const APP_VERSION = "0.9.7";
const APP_UPDATED = "June 16, 2026";
const SESSION_TYPES = [
  "Zone 2 Walk", "VO₂ Intervals", "Tempo/Incline", "Hill Repeats",
  "Long Walk/Hike/Ruck", "Strength A", "Strength B", "Recovery Walk",
  "Mobility", "Benchmark", "Rest"
];

const ICON_REGISTRY = {
  walk: '<path d="M7 34c7 0 10-4 13-12l4-10 5 10c2 5 7 8 16 10l-2 8H17c-6 0-9-2-10-6Z"/><path d="M17 32h27M24 14l-7-4"/>',
  interval: '<circle cx="26" cy="27" r="17"/><path d="M26 27V16M20 5h12M26 5v5M40 13l4-4M12 42l-5 5M40 42l5 5"/>',
  hill: '<path d="M5 41 22 20l8 9 8-16 11 28Z"/><path d="m17 29 5-9 6 7M9 41h38"/>',
  strength: '<path d="M14 20v16M8 23v10M38 20v16M44 23v10M14 28h24"/><path d="M5 26v4M47 26v4"/>',
  hike: '<path d="m5 42 16-23 7 9 8-15 13 29Z"/><path d="M15 42c2-8 9-9 10-17"/><rect x="33" y="22" width="9" height="13" rx="2"/>',
  recovery: '<path d="M42 9C22 10 10 21 10 38c12 3 25-1 32-12 4-6 4-12 0-17Z"/><path d="M11 39c9-9 18-15 29-22M28 27v10"/>',
  benchmark: '<path d="M14 46V7M16 9h25l-6 8 6 8H16M7 46h20"/>',
  dumbbell: '<path d="M15 21v10M10 23v6M37 21v10M42 23v6M15 26h22"/><path d="M7 25v2M45 25v2"/>',
  machine: '<rect x="9" y="8" width="34" height="36" rx="7"/><path d="M17 17h18M17 35h18M21 17v18M31 17v18"/><circle cx="37" cy="13" r="2"/>',
  hinge: '<path d="M10 13h32M14 13v27M38 13v27M10 40h32"/><path d="m19 29 7-10 7 10M26 19v17"/>',
  squat: '<path d="M10 37h32M14 31h24l4 6H10Z"/><path d="M18 31V19h16v12M22 19v-6h8v6"/>',
  step: '<path d="M8 41h36V29H31V19H19V9H8Z"/><path d="m28 37 8-8M36 29h-6M36 29v6"/>',
  singleLeg: '<path d="M8 39h36M15 31h13l5-9 7 9"/><circle cx="15" cy="31" r="3"/><circle cx="40" cy="31" r="3"/>',
  push: '<path d="M8 37h36M13 26h26v7H13z"/><path d="M19 26v-8M33 26v-8M15 18h8M29 18h8"/>',
  pull: '<path d="M8 12h36M14 12v28M38 12v28"/><path d="M20 22h12M26 22v14M21 31l5 5 5-5"/>',
  core: '<path d="M26 7 40 14v11c0 10-6 17-14 21-8-4-14-11-14-21V14Z"/><path d="M20 20h12M20 27h12M23 34h6"/>',
  mobility: '<circle cx="26" cy="26" r="17"/><path d="M26 14v24M14 26h24M18 18l16 16M34 18 18 34"/>'
};

function getIcon(key, className = "exercise-icon") {
  const paths = ICON_REGISTRY[key] || ICON_REGISTRY.strength;
  return `<svg class="${className}" viewBox="0 0 52 52" aria-hidden="true" focusable="false">${paths}</svg>`;
}
function sessionIcon(type, className = "") {
  const key = type === "Zone 2 Walk" ? "walk"
    : type === "VO₂ Intervals" ? "interval"
      : ["Tempo/Incline", "Hill Repeats"].includes(type) ? "hill"
        : ["Strength A", "Strength B"].includes(type) ? "strength"
          : type === "Long Walk/Hike/Ruck" ? "hike"
            : ["Recovery Walk", "Mobility", "Rest"].includes(type) ? "recovery"
              : "benchmark";
  return getIcon(key, `session-icon ${className}`.trim());
}

const EXERCISES = [
  { name: "Goblet Squat", aliases: ["goblet squat"], iconKey: "squat", cue: "Keep the weight close and control the bottom.", equipment: "Dumbbell or kettlebell", setup: "Hold the weight close to your chest with feet about shoulder-width.", steps: ["Brace before you descend.", "Sit between your hips while knees track over toes.", "Drive through the whole foot and stand tall."], mistakes: "Heels lifting, knees collapsing inward, or the weight drifting away.", substitutions: "Leg press, bodyweight box squat" },
  { name: "Leg Press", aliases: ["leg press"], iconKey: "machine", cue: "Use controlled depth and whole-foot pressure.", equipment: "Leg press machine", setup: "Place feet flat on the platform, about hip to shoulder-width.", steps: ["Lower under control.", "Stop before your hips tuck or low back rounds.", "Press through the whole foot."], mistakes: "Locking knees hard, letting hips lift, or going too deep.", substitutions: "Goblet squat, box squat" },
  { name: "Romanian Deadlift", aliases: ["romanian deadlift", "rdl"], iconKey: "hinge", cue: "Push the hips back and keep the weight close.", equipment: "Dumbbells, barbell, or Smith machine", setup: "Stand tall with soft knees and the weight close to your thighs.", steps: ["Brace and send the hips backward.", "Lower until the hamstrings feel loaded while the spine stays long.", "Drive the hips forward to stand."], mistakes: "Squatting the movement, rounding the back, or reaching weights away.", substitutions: "Hamstring curl, cable pull-through" },
  { name: "Hamstring Curl", aliases: ["hamstring curl"], iconKey: "machine", cue: "Move smoothly without lifting the hips.", equipment: "Hamstring curl machine", setup: "Line the machine pivot near your knee joint and secure yourself.", steps: ["Curl smoothly.", "Pause briefly at the squeeze.", "Lower with control."], mistakes: "Using momentum, lifting the hips, or rushing the lowering phase.", substitutions: "Romanian deadlift, stability-ball curl" },
  { name: "Step-up", aliases: ["step-up", "step up"], iconKey: "step", cue: "Use the front leg, not a bounce from the back foot.", equipment: "Box, bench, or step", setup: "Place your whole foot on a stable step.", steps: ["Drive through the working leg.", "Stand tall at the top.", "Step down with control."], mistakes: "Pushing off the back foot, letting the knee collapse, or using a box that is too high.", substitutions: "Split squat, leg press" },
  { name: "Split Squat", aliases: ["split squat"], iconKey: "singleLeg", cue: "Control the descent and stay balanced.", equipment: "Bodyweight or dumbbells", setup: "Use a stable staggered stance.", steps: ["Lower straight down.", "Keep the front foot planted.", "Drive through the front leg."], mistakes: "Front heel lifting, wobbling, or turning it into a jumping lunge.", substitutions: "Step-up, leg press" },
  { name: "Push-up", aliases: ["push-up", "push up", "push-ups", "push ups"], iconKey: "push", cue: "Keep ribs down and move as one piece.", equipment: "Bodyweight", setup: "Place hands under the shoulders with the body in a straight line.", steps: ["Brace the body like a plank.", "Lower the chest toward the floor.", "Press away while staying rigid."], mistakes: "Hips sagging, elbows flaring hard, or using half reps.", substitutions: "Incline push-up, dumbbell bench press" },
  { name: "Dumbbell Bench Press", aliases: ["dumbbell bench press", "db bench press", "db bench"], iconKey: "dumbbell", cue: "Control the bottom and keep the shoulders packed.", equipment: "Dumbbells and bench", setup: "Lie on the bench with feet planted and dumbbells controlled.", steps: ["Lower the dumbbells under control.", "Keep the wrists stacked.", "Press up without crashing the weights together."], mistakes: "Bouncing reps, flaring elbows, or losing wrist position.", substitutions: "Push-up, machine chest press" },
  { name: "Cable Row", aliases: ["cable row", "seated cable row"], iconKey: "pull", cue: "Pull with the back, not just the arms.", equipment: "Cable row machine", setup: "Sit tall with a neutral spine and arms extended.", steps: ["Pull the elbows back.", "Squeeze the shoulder blades lightly.", "Return under control."], mistakes: "Leaning back too much, shrugging, or jerking the weight.", substitutions: "Dumbbell row, machine row" },
  { name: "Lat Pulldown", aliases: ["lat pulldown"], iconKey: "pull", cue: "Drive the elbows down.", equipment: "Lat pulldown machine", setup: "Sit tall, grip the bar, and secure the thighs.", steps: ["Pull the bar toward the upper chest.", "Keep the ribs controlled.", "Return slowly."], mistakes: "Pulling behind the neck, swinging the body, or shrugging.", substitutions: "Assisted pull-up, cable row" },
  { name: "Dumbbell Shoulder Press", aliases: ["dumbbell shoulder press", "db shoulder press"], iconKey: "dumbbell", cue: "Press up without arching hard.", equipment: "Dumbbells", setup: "Sit or stand tall with dumbbells at shoulder height.", steps: ["Brace with the ribs down.", "Press overhead.", "Lower under control."], mistakes: "Overarching the back, flaring the ribs, or bouncing reps.", substitutions: "Machine shoulder press, landmine press" },
  { name: "Plank", aliases: ["plank"], iconKey: "core", cue: "Hold a straight line from shoulders to ankles.", equipment: "Bodyweight", setup: "Place elbows under the shoulders with the body straight.", steps: ["Brace the abs.", "Squeeze the glutes lightly.", "Breathe behind the brace."], mistakes: "Hips sagging, hips too high, or holding the breath.", substitutions: "Incline plank, dead bug" },
  { name: "Dead Bug", aliases: ["dead bug"], iconKey: "core", cue: "Move slowly while the ribs stay down.", equipment: "Bodyweight", setup: "Lie on your back with arms up and knees bent.", steps: ["Press the low back gently toward the floor.", "Extend the opposite arm and leg.", "Return slowly and switch."], mistakes: "The back arching, rushing, or losing control.", substitutions: "Plank, heel taps" }
].map(exercise => ({ illustrationKey: null, imagePath: null, ...exercise }));

function exerciseMedia(exercise, large = false) {
  const icon = getIcon(exercise.iconKey, `exercise-icon${large ? " large" : ""}`);
  if (!exercise.imagePath) return `<span class="exercise-media${large ? " large" : ""}">${icon}</span>`;
  return `<span class="exercise-media${large ? " large" : ""}">
    <img src="${exercise.imagePath}" alt="" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false" />
    <span class="exercise-icon-fallback" hidden>${icon}</span>
  </span>`;
}
function exerciseMatches(text) {
  const normalized = text.toLowerCase();
  return EXERCISES.filter(exercise => exercise.aliases.some(alias => normalized.includes(alias)));
}
function exerciseHelperMarkup(exercise, compact = false) {
  return `<details class="exercise-helper${compact ? " compact" : ""}">
    <summary>${exerciseMedia(exercise)}<span><strong>${exercise.name}</strong><small>${exercise.cue}</small></span><i>How to</i></summary>
    <div class="exercise-guide">
      <header class="exercise-guide-header">${exerciseMedia(exercise, true)}<div><h3>${exercise.name}</h3><span>Equipment · ${exercise.equipment}</span></div></header>
      <div class="exercise-guide-section"><h4>Setup</h4><p>${exercise.setup}</p><h4>How to do it</h4><ol>${exercise.steps.map(step => `<li>${step}</li>`).join("")}</ol></div>
      <div class="exercise-guide-section"><h4>Key cue</h4><p>${exercise.cue}</p><h4>Common mistakes</h4><p>${exercise.mistakes}</p><h4>Alternatives</h4><p>${exercise.substitutions}</p></div>
    </div>
  </details>`;
}

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
  ["flag", "Twelve weeks of deliberate work rebuilt your training engine."]
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
    weeklyNotes: {},
    adaptive: { adjustments: {}, decisions: {} },
    healthImport: null,
    meta: {
      lastSavedAt: null, lastBackupAt: null, lastBackupSessionCount: 0, lastTab: "today", lastOpenedDate: null, todayNotes: {},
      badgeUnlocksShown: {}, badgeUnlockedAt: {}, timer: null
    }
  };
}

function migrate(raw) {
  const base = initialState();
  const next = raw && typeof raw === "object" ? raw : base;
  next.setup ??= null;
  if (next.setup?.hikingGoal === "General beast mode") next.setup.hikingGoal = "Health + Mountain";
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
  next.weeklyNotes ??= {};
  next.adaptive ??= {};
  next.adaptive.adjustments ??= {};
  next.adaptive.decisions ??= {};
  next.healthImport ??= null;
  next.meta ??= {};
  next.meta.lastSavedAt ??= null;
  next.meta.lastBackupAt ??= null;
  next.meta.lastBackupSessionCount ??= 0;
  next.meta.lastTab ??= "today";
  next.meta.lastOpenedDate ??= null;
  next.meta.todayNotes ??= {};
  next.meta.badgeUnlocksShown ??= {};
  next.meta.badgeUnlockedAt ??= {};
  next.meta.timer ??= null;
  return dedupeSessions(next);
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
function trainingForText() {
  const goal = profile().hikingGoal || "Health + Mountain";
  if (/rainier|backpack|snow|mountain/i.test(goal)) return "Mountain · Health · Forever";
  if (/5k/i.test(goal)) return "5K · Health · Forever";
  if (/strength/i.test(goal)) return "Strength · Health · Life";
  if (/condition/i.test(goal)) return "Conditioning · Health · Life";
  if (/longevity/i.test(goal)) return "Health · Longevity · Forever";
  return "Health · Mountain · Forever";
}
function dateKey(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}
function atNoon(value) { return new Date(`${value}T12:00:00`); }
function syncDateControl(input) {
  if (!input) return;
  const display = input.closest(".date-control")?.querySelector(".date-display");
  if (!display) return;
  display.textContent = input.value
    ? atNoon(input.value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Choose date";
}
function syncDateControls(root = document) {
  root.querySelectorAll(".date-control input[type='date']").forEach(syncDateControl);
}
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
function adaptiveProgramBucket(key) {
  state.adaptive[key][state.selectedProgram] ??= {};
  return state.adaptive[key][state.selectedProgram];
}
function adjustmentForWeek(week) {
  return adaptiveProgramBucket("adjustments")[week] || null;
}
function applyPlanAdjustment(plan, week, day) {
  const adjustment = adjustmentForWeek(week);
  if (!adjustment || adjustment.day !== day || adjustment.type !== plan.type) return plan;
  const next = { ...plan, adaptiveNote: adjustment.label, baselineMinutes: plan.minutes };
  if (adjustment.variable === "duration") next.minutes = Math.max(10, plan.minutes + adjustment.amount);
  if (adjustment.variable === "rounds") {
    next.main = plan.main.map(item =>
      item.replace(/(\d+) rounds/i, (_, rounds) => `${Math.max(2, Number(rounds) + adjustment.amount)} rounds`)
    );
  }
  if (adjustment.variable === "weight") {
    next.main = [...plan.main, `Progression note: ${adjustment.amount < 0 ? "reduce working weight about 10%" : `add up to ${adjustment.amount} lb to one clean movement only`}`];
  }
  return next;
}
function planFor(date = activeDate()) {
  const week = currentWeek(date);
  const dayIndexInWeek = currentDay(date);
  const baseline = activeProgram().weeks[week - 1].days[dayIndexInWeek];
  return {
    ...applyPlanAdjustment(baseline, week, dayIndexInWeek),
    week, day: dayIndexInWeek + 1, weekData: activeProgram().weeks[week - 1]
  };
}
function latest(list) { return [...list].sort((a, b) => String(a.date).localeCompare(String(b.date))).at(-1); }
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}
function csvValue(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
function slugify(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}
function programStartFor(appState, programId) {
  return atNoon(appState.programStarts?.[programId] || appState.setup?.startDate || DEFAULT_START);
}
function plannedInfoForState(appState, dateValue, programId = appState.selectedProgram || "vo2-rebuild") {
  const program = PROGRAMS[programId] || PROGRAMS["vo2-rebuild"];
  const date = atNoon(typeof dateValue === "string" ? dateValue : dateKey(dateValue));
  const start = programStartFor(appState, programId);
  const index = Math.max(0, Math.min(83, Math.floor((date - start) / 86400000)));
  const weekNumber = Math.floor(index / 7) + 1;
  const dayNumber = index % 7 + 1;
  const plan = program.weeks[weekNumber - 1]?.days[dayNumber - 1] || program.weeks[0].days[0];
  return { program, plan, weekNumber, dayNumber };
}
function plannedSessionId(date, programId, weekNumber, dayNumber, sessionType) {
  return `${date}__${programId}__week-${weekNumber}__day-${dayNumber}__${slugify(sessionType)}`;
}
function plannedSessionIdFor(date, programId = state.selectedProgram) {
  const info = plannedInfoForState(state, date, programId);
  return plannedSessionId(date, programId, info.weekNumber, info.dayNumber, info.plan.type);
}
function manualSessionId(date, sessionType) {
  return `${date}__manual__${Date.now()}__${slugify(sessionType)}`;
}
function sessionTypeOf(session) {
  return session?.sessionType || session?.plannedType || session?.type || "";
}
function plannedSessionFor(date = dateKey(activeDate()), programId = state.selectedProgram) {
  const id = plannedSessionIdFor(date, programId);
  return state.sessions.find(session => session.id === id) || null;
}
function bestValue(...values) {
  return values.find(value => value !== undefined && value !== null && value !== "") ?? "";
}
function bestNumber(...values) {
  const value = values.find(item => item !== undefined && item !== null && item !== "" && !Number.isNaN(Number(item)));
  return value === undefined ? 0 : Number(value) || 0;
}
function mergedNotes(a = "", b = "") {
  const first = String(a || "").trim();
  const second = String(b || "").trim();
  if (!first) return second;
  if (!second || first === second) return first;
  if (first.includes(second)) return first;
  if (second.includes(first)) return second;
  return first.length >= second.length ? `${first}\n\n${second}` : `${second}\n\n${first}`;
}
function strongerStatus(a, b) {
  const rank = { planned: 0, skipped: 1, reduced: 2, completed: 3 };
  return (rank[b] ?? 0) >= (rank[a] ?? 0) ? b : a;
}
function normalizeSessionRecord(record, appState = state) {
  const next = { ...record };
  const date = next.date || dateKey(activeDate());
  const programId = next.programId || appState.selectedProgram || "vo2-rebuild";
  const info = plannedInfoForState(appState, date, programId);
  const existingType = sessionTypeOf(next);
  const appearsPlanned = next.source === "planned" || (
    next.source !== "manual" &&
    existingType === info.plan.type
  );
  const source = appearsPlanned ? "planned" : "manual";
  const sessionType = source === "planned" ? info.plan.type : (existingType || next.type || "Manual session");
  const id = source === "planned"
    ? plannedSessionId(date, programId, info.weekNumber, info.dayNumber, sessionType)
    : (next.id || manualSessionId(date, sessionType));
  const minutes = bestNumber(next.duration, next.minutes);
  const averageHR = bestNumber(next.averageHR, next.avgHr);
  const now = new Date().toISOString();
  return {
    ...next,
    id,
    date,
    programId,
    weekNumber: source === "planned" ? info.weekNumber : bestNumber(next.weekNumber),
    dayNumber: source === "planned" ? info.dayNumber : bestNumber(next.dayNumber),
    source,
    status: next.status || (source === "planned" ? "completed" : "completed"),
    sessionType,
    type: next.type || sessionType,
    plannedType: source === "planned" ? sessionType : next.plannedType,
    readinessColor: next.readinessColor || next.readiness || "",
    duration: minutes,
    minutes,
    distance: bestNumber(next.distance),
    averageHR,
    avgHr: averageHR,
    maxHR: bestNumber(next.maxHR, next.maxHr),
    maxHr: bestNumber(next.maxHr, next.maxHR),
    effort: bestNumber(next.effort),
    pain: bestNumber(next.pain),
    breathing: next.breathing || "Normal",
    notes: String(next.notes || "").trim(),
    createdAt: next.createdAt || now,
    updatedAt: next.updatedAt || next.createdAt || now
  };
}
function mergeSessionRecords(a, b, appState = state) {
  const first = normalizeSessionRecord(a, appState);
  const second = normalizeSessionRecord(b, appState);
  const merged = { ...first, ...second };
  ["duration", "minutes", "distance", "averageHR", "avgHr", "maxHR", "maxHr", "effort", "pain", "energy", "confidence", "rounds", "hardSeconds", "recoverySeconds", "packWeight", "elevation"].forEach(key => {
    merged[key] = bestNumber(second[key], first[key]);
  });
  merged.status = strongerStatus(first.status, second.status);
  merged.readinessColor = bestValue(second.readinessColor, first.readinessColor);
  merged.breathing = bestValue(second.breathing, first.breathing, "Normal");
  merged.notes = mergedNotes(first.notes, second.notes);
  merged.createdAt = [first.createdAt, second.createdAt].filter(Boolean).sort()[0] || new Date().toISOString();
  merged.updatedAt = [first.updatedAt, second.updatedAt, new Date().toISOString()].filter(Boolean).sort().at(-1);
  return normalizeSessionRecord(merged, appState);
}
function dedupeSessions(appState) {
  const seen = new Map();
  const output = [];
  for (const item of Array.isArray(appState.sessions) ? appState.sessions : []) {
    const normalized = normalizeSessionRecord(item, appState);
    const key = normalized.source === "planned" ? normalized.id : normalized.id || manualSessionId(normalized.date, normalized.sessionType);
    if (normalized.source === "planned" && seen.has(key)) {
      output[seen.get(key)] = mergeSessionRecords(output[seen.get(key)], normalized, appState);
    } else {
      seen.set(key, output.length);
      output.push(normalized);
    }
  }
  appState.sessions = output.sort((a, b) => String(a.date).localeCompare(String(b.date)) || String(a.createdAt).localeCompare(String(b.createdAt)));
  return appState;
}
function upsertSession(record) {
  const normalized = normalizeSessionRecord(record);
  const existingIndex = state.sessions.findIndex(session => session.id === normalized.id);
  if (existingIndex >= 0) {
    state.sessions[existingIndex] = mergeSessionRecords(state.sessions[existingIndex], {
      ...normalized,
      updatedAt: new Date().toISOString()
    });
    return state.sessions[existingIndex];
  }
  state.sessions.push({ ...normalized, createdAt: normalized.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() });
  return state.sessions.at(-1);
}

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
  return `<div class="exercise-list">${items.map(item => {
    const helpers = exerciseMatches(item);
    return `<div class="prescription-item"><strong>${item}</strong>${helpers.length
      ? `<div class="inline-exercise-helpers">${helpers.map(exercise => exerciseHelperMarkup(exercise, true)).join("")}</div>`
      : ""}</div>`;
  }).join("")}</div>`;
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
    .map((day, index) => applyPlanAdjustment(day, week, index))
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
function completedSessions(logs) {
  return logs.filter(log => log.status !== "skipped" && log.type !== "Rest");
}
function sessionsBetween(from, to) {
  return state.sessions.filter(session => {
    if (session.programId !== state.selectedProgram) return false;
    const date = atNoon(session.date);
    return date >= from && date <= to;
  });
}
function recentSessions(days, end = activeDate()) {
  const from = new Date(end);
  from.setDate(from.getDate() - days + 1);
  return sessionsBetween(from, end);
}
function textHasSafetyFlag(log) {
  const text = `${log.notes || ""} ${log.painNotes || ""} ${log.recoveryNotes || ""}`.toLowerCase();
  return /(knee|shin|ankle|back pain|sharp pain|wheez|asthma|chest tight|breath)/.test(text);
}
function hasBreathingFlag(log) {
  return (log.breathing && log.breathing !== "Normal") || textHasSafetyFlag(log);
}
function trainingLoad(logs) {
  return completedSessions(logs).reduce((total, log) => {
    const minutes = Number(log.minutes || 0);
    const hardBonus = ["VO₂ Intervals", "Tempo/Incline", "Hill Repeats", "Benchmark"].includes(log.type) ? 20 : 0;
    const strengthBonus = ["Strength A", "Strength B"].includes(log.type) ? 15 : 0;
    return total + minutes + hardBonus + strengthBonus;
  }, 0);
}
function strengthSignal(logs) {
  const strength = completedSessions(logs).filter(log => ["Strength A", "Strength B"].includes(log.type));
  if (!strength.length) return "none";
  const failed = strength.filter(log => /missed reps|failed|could not finish/i.test(log.notes || ""));
  if (failed.length >= 2) return "deload";
  const latestStrength = strength.at(-1);
  const rpes = Object.entries(latestStrength)
    .filter(([key, value]) => /^rpe\d+$/.test(key) && Number(value))
    .map(([, value]) => Number(value));
  const maxRpe = rpes.length ? Math.max(...rpes) : Number(latestStrength.effort || 0);
  const readiness = state.readiness[latestStrength.date]?.color;
  if (maxRpe && maxRpe <= 7 && Number(latestStrength.pain || 0) <= 2 && readiness === "green") return "increase";
  if (maxRpe >= 8 || failed.length) return "hold";
  return "none";
}
function weightTrend() {
  const cutoff = new Date(activeDate());
  cutoff.setDate(cutoff.getDate() - 13);
  const entries = state.checkins
    .filter(item => Number(item.weight) && atNoon(item.date) >= cutoff)
    .sort((a, b) => a.date.localeCompare(b.date));
  if (entries.length < 3) return "Not enough weight data yet.";
  const midpoint = new Date(activeDate());
  midpoint.setDate(midpoint.getDate() - 6);
  const older = entries.filter(item => atNoon(item.date) < midpoint);
  const newer = entries.filter(item => atNoon(item.date) >= midpoint);
  if (!older.length || !newer.length) return "Not enough weight data yet.";
  const average = list => list.reduce((sum, item) => sum + Number(item.weight), 0) / list.length;
  const change = average(newer) - average(older);
  if (change <= -.4) return "Trend weight is moving down slowly.";
  if (Math.abs(change) < 1) return "Trend weight is stable.";
  return "Trend weight moved up slightly; keep watching the weekly average.";
}
function targetDayForType(week, type) {
  const days = activeProgram().weeks[week - 1]?.days || [];
  const exact = days.findIndex(day => day.type === type);
  if (exact >= 0) return exact;
  return days.findIndex(day => type.startsWith("Strength") && day.type.startsWith("Strength"));
}
function buildWeeklyReview(sourceWeek = currentWeek()) {
  const stats = weeklyStats(sourceWeek);
  const completed = completedSessions(stats.logs);
  const last14 = completedSessions(recentSessions(14));
  const recent7 = completedSessions(recentSessions(7));
  const priorEnd = new Date(activeDate()); priorEnd.setDate(priorEnd.getDate() - 7);
  const prior7 = completedSessions(recentSessions(7, priorEnd));
  const loadRising = trainingLoad(prior7) > 0 && trainingLoad(recent7) > trainingLoad(prior7) * 1.25;
  const skipped = stats.logs.filter(log => log.status === "skipped").length;
  const enough = stats.logs.length >= 3 || sourceWeek < currentWeek();
  const painFlags = last14.filter(log => Number(log.pain || 0) >= 3 || textHasSafetyFlag(log));
  const breathingFlags = last14.filter(hasBreathingFlag);
  const vo2Struggles = completed.filter(log =>
    log.type === "VO₂ Intervals" &&
    (Number(log.effort || 0) >= 9 || /No|Stopped/i.test(log.controlledFinish || ""))
  );
  const cleanZone2 = completed.filter(log =>
    log.type === "Zone 2 Walk" && Number(log.pain || 0) <= 2 &&
    Number(log.effort || 0) <= 5 && !hasBreathingFlag(log)
  );
  const cleanLong = last14.filter(log =>
    log.type === "Long Walk/Hike/Ruck" && Number(log.pain || 0) <= 2 && !hasBreathingFlag(log)
  );
  const strength = strengthSignal(last14);
  const targetWeek = sourceWeek + 1;
  const phaseReview = sourceWeek % 4 === 0;
  const bodyTrend = weightTrend();
  let meaning = stats.completion >= 80 ? "Consistency is building without needing a dramatic jump."
    : stats.completion >= 50 ? "The week is moving forward. Repeating quality work matters more than forcing progression."
      : "The best progression right now is making the next week easier to complete.";
  if (painFlags.length || breathingFlags.length) meaning = "Recovery signals outrank progression. Holding steady protects the block.";
  if (phaseReview) meaning += " This is a four-week phase review, so the longer trend matters more than one session.";

  let suggestion = null;
  let suggestionText = "Keep the next week exactly as written.";
  if (!enough) {
    suggestionText = "Keep logging. A suggestion appears after at least three entries for the week.";
  } else if (targetWeek > 12) {
    suggestionText = "Finish the block as written and use the final benchmark before choosing the next mission.";
  } else if (painFlags.length || breathingFlags.length) {
    suggestionText = "Hold progression next week. Keep the baseline plan and use Yellow or Red when symptoms call for it.";
  } else if (strength === "deload") {
    const type = activeProgram().weeks[targetWeek - 1].days.find(day => day.type.startsWith("Strength"))?.type;
    const day = type ? targetDayForType(targetWeek, type) : -1;
    if (day >= 0) {
      suggestion = { targetWeek, day, type, variable: "weight", amount: -10, label: "Strength: 10% working-weight deload", reason: "Two recent strength notes indicated failed work." };
      suggestionText = "Deload working weight about 10% for the next strength session. Keep the planned sets and reps.";
    }
  } else if (vo2Struggles.length) {
    const day = targetDayForType(targetWeek, "VO₂ Intervals");
    if (day >= 0) {
      suggestion = { targetWeek, day, type: "VO₂ Intervals", variable: "rounds", amount: -1, label: "VO₂ intervals: one fewer round", reason: "Recent intervals finished at the limit." };
      suggestionText = "Reduce the next VO₂ session by one round, then rebuild from a controlled finish.";
    }
  } else if (strength === "hold") {
    suggestionText = "Repeat the same strength weight next time. Keep the rest of the baseline week as written.";
  } else if (loadRising) {
    suggestionText = "Hold the baseline plan next week. Recent training load rose enough that absorbing the work is the progression.";
  } else if (stats.completion < 50 || skipped >= 2) {
    const day = targetDayForType(targetWeek, "Zone 2 Walk");
    if (day >= 0) {
      suggestion = { targetWeek, day, type: "Zone 2 Walk", variable: "duration", amount: -5, label: "Monday Zone 2 -5 min", reason: "A smaller first step should make the week easier to complete." };
      suggestionText = "Trim five minutes from Monday Zone 2 and keep every other session unchanged.";
    }
  } else if (strength === "increase") {
    const type = activeProgram().weeks[targetWeek - 1].days.find(day => day.type.startsWith("Strength"))?.type;
    const day = type ? targetDayForType(targetWeek, type) : -1;
    if (day >= 0) {
      suggestion = { targetWeek, day, type, variable: "weight", amount: 5, label: "Strength: one movement +5 lb", reason: "The last Green strength session was clean at RPE 7 or lower." };
      suggestionText = "Add up to five pounds to one clean strength movement only. Keep everything else unchanged.";
    }
  } else if (cleanZone2.length) {
    const day = targetDayForType(targetWeek, "Zone 2 Walk");
    if (day >= 0) {
      suggestion = { targetWeek, day, type: "Zone 2 Walk", variable: "duration", amount: 5, label: "Monday Zone 2 +5 min", reason: "Recent Zone 2 work was completed cleanly with low pain." };
      suggestionText = "Add five minutes to Monday Zone 2 and keep intervals unchanged.";
    }
  } else if (sourceWeek % 2 === 0 && cleanLong.length) {
    const day = targetDayForType(targetWeek, "Long Walk/Hike/Ruck");
    if (day >= 0) {
      suggestion = { targetWeek, day, type: "Long Walk/Hike/Ruck", variable: "duration", amount: 5, label: "Long walk/hike +5 min", reason: "The 14-day long-session trend is clean." };
      suggestionText = "Add five minutes to the long session. Keep pack weight, incline, and pace unchanged.";
    }
  }

  const reviewId = `${state.selectedProgram}-week-${sourceWeek}`;
  return {
    id: reviewId,
    sourceWeek,
    targetWeek,
    enough,
    phaseReview,
    what: `${completed.length} of ${stats.plannedSessions} sessions completed${skipped ? `, ${skipped} protected/skipped` : ""}. ${bodyTrend}`,
    meaning,
    suggestion,
    suggestionText,
    details: `Reviewed completion, the last 7–14 days of training load, readiness, pain, breathing notes, controlled finishes, and trend weight. Only one variable can change at a time.`
  };
}
function nextBestMove() {
  const readiness = currentReadiness();
  const recent = recentSessions(7);
  const previousEnd = new Date(activeDate()); previousEnd.setDate(previousEnd.getDate() - 7);
  const previous = recentSessions(7, previousEnd);
  const safety = completedSessions(recent).some(log => Number(log.pain || 0) >= 3 || hasBreathingFlag(log));
  const skipped = recent.filter(log => log.status === "skipped").length;
  const loadRising = trainingLoad(previous) > 0 && trainingLoad(recent) > trainingLoad(previous) * 1.25;
  const raw = planFor();
  if (readiness.color === "red") return { tone: "red", message: "Recover today. Rest or take the easy recovery option.", why: "Red readiness removes progression and hard work." };
  if (readiness.color === "yellow") return { tone: "yellow", message: "Use the Yellow version. Keep the same easy effort and do less.", why: "Today’s readiness check is the only daily adjustment." };
  if (safety) return { tone: "yellow", message: "Hold progression. Pain or breathing notes appeared recently.", why: "The written workout stays intact; use Yellow or Red if those signals are present today." };
  if (skipped >= 2) return { tone: "neutral", message: "Protect the streak: aim for the 20-minute minimum version.", why: "Recent missed sessions suggest that a smaller win may be more useful than extra load." };
  if (loadRising) return { tone: "neutral", message: "Do the plan today, but add nothing extra.", why: "Your recent training load rose more than usual, so the engine needs time to absorb it." };
  if (raw.type.startsWith("Strength") && strengthSignal(recent) === "increase") {
    return { tone: "green", message: "Strength is ready for one small increase, not a full-session jump.", why: "The last Green strength session was clean, low-pain, and RPE 7 or lower." };
  }
  if (!readiness.color) return { tone: "neutral", message: "Check readiness, then follow the written plan.", why: "Daily changes only come from Green, Yellow, or Red readiness." };
  return { tone: "green", message: "Do the plan today. Green day, normal load.", why: "Recent logs do not show a reason to reduce or progress today." };
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
function weeklyNotesBucket() {
  state.weeklyNotes[state.selectedProgram] ??= {};
  return state.weeklyNotes[state.selectedProgram];
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
  const title = total >= 90 ? "Goal Ready" : total >= 75 ? "Performance Ready" : total >= 60 ? "Engine Building" : total >= 45 ? "Capacity Growing" : total >= 25 ? "Consistency Building" : "Foundation Builder";
  const programLogs = state.sessions.filter(session => session.programId === state.selectedProgram);
  return { total, title, components, stats, hasBaseline: programLogs.length >= 3 };
}

function renderToday() {
  const date = activeDate();
  const raw = planFor(date);
  const readiness = currentReadiness();
  const plan = adjustedPlan(raw, readiness.color);
  const matching = plannedSessionFor(dateKey(date));
  const completed = matching?.status === "completed";
  const reduced = matching?.status === "reduced";
  document.querySelector("#dateLabel").textContent = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  document.querySelector("#phaseLabel").textContent = `Week ${raw.week}, Day ${raw.day} · ${phaseName(raw.weekData.phase)} · ${raw.weekData.theme}`;
  document.querySelector("#headerWeekLabel").textContent = `Week ${raw.week} of 12`;
  document.querySelector("#activeProgramLabel").textContent = `Current Goal: ${activeProgram().name}`;
  document.querySelector("#trainingForLabel").textContent = `Training For: ${trainingForText()}`;
  const readinessName = readiness.color ? readiness.color[0].toUpperCase() + readiness.color.slice(1) : "Green";
  const headerToday = document.querySelector("#headerTodayLabel");
  if (headerToday) headerToday.textContent = `Today: ${plan.type} · ${readinessName} · ${plan.minutes ? `${plan.minutes} min` : plan.main[0]}`;
  document.querySelector("#weekNumber").textContent = raw.week;
  setRingProgress("#weekRing", raw.week / 12 * 360);
  document.querySelector("#todayPurpose").innerHTML = `${sessionIcon(raw.type, "inline")}<span>Week ${raw.week}, Day ${raw.day} · ${raw.type}</span>`;
  document.querySelector("#todayWorkout").textContent = plan.title;
  document.querySelector("#todayStatus").textContent = matching?.status === "skipped" ? "Protected day" : reduced ? "Minimum done" : completed ? "Completed today" : raw.title;
  document.querySelector("#todayStatus").classList.toggle("done", completed || reduced);
  document.querySelector("#adaptationBanner").innerHTML = readiness.color === "yellow"
    ? `<div class="adaptation-comparison"><div><span>Original</span><strong>${plan.originalMinutes} min</strong></div><div><span>Today</span><strong>${plan.minutes} min</strong></div><div><span>Effort</span><strong>${plan.effort}</strong></div></div><div class="adaptation-message"><strong>Adjustment: Yellow day, reduced about 35%.</strong> Goal: ${plan.adaptation}</div>`
    : readiness.color === "red"
      ? `<div class="adaptation-comparison"><div><span>Original</span><strong>${plan.originalMinutes} min</strong></div><div><span>Today</span><strong>Rest / ${plan.minutes} min easy</strong></div><div><span>Effort</span><strong>${plan.effort}</strong></div></div><div class="adaptation-message">${plan.adaptation}</div>`
      : `<div class="adaptation-comparison"><div><span>Original</span><strong>${raw.minutes} min</strong></div><div><span>Today</span><strong>${raw.minutes} min</strong></div><div><span>Adjustment</span><strong>Full plan</strong></div></div><div class="adaptation-message">Green day: keep the effort controlled and complete the plan as written.</div>`;
  document.querySelector("#adaptationBanner").className = `adaptation-banner ${readiness.color || "neutral"}`;
  document.querySelector("#workoutContent").innerHTML =
    (raw.adaptiveNote ? `<div class="plan-adjustment-note">Adjusted from weekly review: ${raw.adaptiveNote}.</div>` : "") +
    workoutDetails(plan);
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
  const nextMove = nextBestMove();
  const nextMoveCard = document.querySelector("#nextBestMoveCard");
  nextMoveCard.className = `next-move-card ${nextMove.tone}`;
  document.querySelector("#nextBestMoveText").textContent = nextMove.message;
  document.querySelector("#nextBestMoveWhy").textContent = nextMove.why;
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
    : reduced ? "Minimum version logged. Streak protected."
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
    ["Session", `<span class="recap-session">${sessionIcon(session.plannedType || session.type)}${session.plannedType || session.type}</span>`],
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
      const adjustment = adjustmentForWeek(number);
      const days = week.days.map((baselineDay, i) => {
        const day = applyPlanAdjustment(baselineDay, number, i);
        const date = new Date(start); date.setDate(date.getDate() + i);
        return `<details class="plan-day"><summary><time>${date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</time><span class="plan-session">${sessionIcon(day.type)}<strong>${day.title}</strong></span><span>›</span></summary>
          <div class="day-workout">${day.adaptiveNote ? `<div class="plan-adjustment-note">Adjusted from weekly review: ${day.adaptiveNote}.</div>` : ""}${workoutDetails({ ...day, weekData: week })}</div></details>`;
      }).join("");
      return `<details class="plan-week ${number === currentWeek() ? "current" : ""}" ${number === currentWeek() ? "open" : ""}>
        <summary><div><strong>Week ${number}: ${week.theme}</strong><span>${week.target} · ${activeProgram().badges[number - 1]}</span></div></summary>
        <div class="week-overview">${adjustment ? `<div class="plan-adjustment-note">Adjusted from weekly review: ${adjustment.label}.</div>` : ""}<div class="victory"><span>Weekly victory</span><strong>${week.victory}</strong></div></div>
        <div class="week-days">${days}</div></details>`;
    }).join("");
}

function dynamicFields(type) {
  if (type === "Zone 2 Walk") return `
    ${sessionLogHeader(type)}
    <div class="form-grid"><label class="field"><span>Duration (minutes)</span><input type="number" name="minutes" min="1" max="600" required /></label>
    <label class="field"><span>Distance (miles)</span><input type="number" name="distance" min="0" step="0.01" /></label>
    <label class="field"><span>Average HR</span><input type="number" name="avgHr" min="40" max="220" /></label>
    <label class="field"><span>Talk-test rating</span><select name="talkTest"><option>Full sentences</option><option>Short sentences</option><option>Short phrases only</option><option>Too hard for Zone 2</option></select></label>
    <label class="field"><span>Route / incline</span><input name="route" placeholder="Outdoor loop, 5% treadmill..." /></label>
    <label class="field"><span>Effort (1–10)</span><input type="number" name="effort" min="1" max="10" required /></label></div>`;
  if (type === "VO₂ Intervals") return `
    ${sessionLogHeader(type)}
    <div class="form-grid"><label class="field"><span>Total duration (minutes)</span><input type="number" name="minutes" min="1" max="300" required /></label>
    <label class="field"><span>Rounds completed</span><input type="number" name="rounds" min="0" max="20" /></label>
    <label class="field"><span>Hard interval length (sec)</span><input type="number" name="hardSeconds" min="0" /></label>
    <label class="field"><span>Recovery length (sec)</span><input type="number" name="recoverySeconds" min="0" /></label>
    <label class="field"><span>Average HR</span><input type="number" name="avgHr" min="40" max="220" /></label>
    <label class="field"><span>Max HR</span><input type="number" name="maxHr" min="40" max="230" /></label>
    <label class="field"><span>Controlled finish?</span><select name="controlledFinish"><option>Yes — could repeat one</option><option>Yes — correctly spent</option><option>No — went too hard</option><option>Stopped early</option></select></label>
    <label class="field"><span>Effort (1–10)</span><input type="number" name="effort" min="1" max="10" required /></label></div>`;
  if (type === "Long Walk/Hike/Ruck") return `
    ${sessionLogHeader(type)}
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
    return `${sessionLogHeader(type)}<div class="form-grid"><label class="field"><span>Duration (minutes)</span><input type="number" name="minutes" min="1" max="300" required /></label>
      <label class="field"><span>Session effort (1–10)</span><input type="number" name="effort" min="1" max="10" required /></label></div>
      <div class="strength-log">${movements.map((movement, index) => `<div class="strength-block"><div class="strength-line"><strong>${movement.split("—")[0].trim()}</strong>
        <label class="field"><span>Sets</span><input type="number" name="sets${index}" min="0" /></label>
        <label class="field"><span>Reps</span><input type="number" name="reps${index}" min="0" /></label>
        <label class="field"><span>Weight</span><input type="number" name="weight${index}" min="0" step="0.5" /></label>
        <label class="field"><span>RPE</span><input type="number" name="rpe${index}" min="1" max="10" /></label></div>
        <div class="strength-helper-slot">${exerciseMatches(movement).map(exercise => exerciseHelperMarkup(exercise, true)).join("")}</div></div>`).join("")}</div>`;
  }
  if (["Recovery Walk", "Mobility"].includes(type)) return `
    ${sessionLogHeader(type)}
    <div class="form-grid"><label class="field"><span>Duration (minutes)</span><input type="number" name="minutes" min="1" max="300" required /></label>
    <label class="field"><span>Body area</span><input name="bodyArea" placeholder="Hips, calves, full body..." /></label>
    <label class="field"><span>Effort (1–10)</span><input type="number" name="effort" min="1" max="10" required /></label>
    <label class="field"><span>Recovery notes</span><input name="recoveryNotes" placeholder="What felt better or tight?" /></label></div>`;
  if (["Tempo/Incline", "Hill Repeats", "Benchmark"].includes(type)) return `
    ${sessionLogHeader(type)}
    <div class="form-grid"><label class="field"><span>Duration (minutes)</span><input type="number" name="minutes" min="1" max="600" required /></label>
    <label class="field"><span>Distance (miles)</span><input type="number" name="distance" min="0" step="0.01" /></label>
    <label class="field"><span>Elevation gain (ft)</span><input type="number" name="elevation" min="0" step="10" /></label>
    <label class="field"><span>Average HR</span><input type="number" name="avgHr" min="40" max="220" /></label>
    <label class="field"><span>Max HR</span><input type="number" name="maxHr" min="40" max="230" /></label>
    <label class="field"><span>Route / incline</span><input name="route" /></label>
    <label class="field"><span>Effort (1–10)</span><input type="number" name="effort" min="1" max="10" required /></label></div>`;
  return `${sessionLogHeader(type)}<div class="form-grid"><label class="field"><span>Duration (minutes)</span><input type="number" name="minutes" min="0" max="1440" value="0" required /></label>
    <label class="field"><span>Effort (1–10)</span><input type="number" name="effort" min="1" max="10" value="1" required /></label></div>`;
}
function sessionLogHeader(type) {
  return `<div class="session-log-header">${sessionIcon(type)}<div><span>Logging</span><strong>${type}</strong></div></div>`;
}
function setFormValue(form, name, value) {
  const field = form.elements[name];
  if (!field || value === undefined || value === null) return;
  field.value = value;
}
function setLogModeCopy(mode, session = null) {
  const status = document.querySelector("#sessionEditStatus");
  const submit = document.querySelector("#sessionSubmitButton");
  if (!status || !submit) return;
  if (mode === "manual") {
    status.textContent = "Manual extra session";
    submit.textContent = session?.id ? "Update session" : "Save session locally";
  } else {
    status.textContent = "Editing today’s planned session";
    submit.textContent = "Update session";
  }
}
function fillSessionForm(session, mode = "planned") {
  const form = document.querySelector("#sessionForm");
  if (!form) return;
  form.dataset.mode = mode;
  form.elements.editingId.value = session?.id || "";
  form.elements.source.value = mode;
  setFormValue(form, "date", session.date);
  setFormValue(form, "type", session.type || session.sessionType);
  syncDateControl(form.elements.date);
  document.querySelector("#dynamicLogFields").innerHTML = dynamicFields(form.elements.type.value);
  [
    "minutes", "duration", "distance", "avgHr", "averageHR", "maxHr", "maxHR", "effort", "energy", "confidence",
    "breathing", "pain", "rounds", "hardSeconds", "recoverySeconds", "packWeight", "elevation", "terrain",
    "route", "talkTest", "controlledFinish", "painNotes", "bodyArea", "recoveryNotes", "notes"
  ].forEach(name => setFormValue(form, name, session[name]));
  if (session.averageHR && form.elements.avgHr) form.elements.avgHr.value = session.averageHR;
  if (session.maxHR && form.elements.maxHr) form.elements.maxHr.value = session.maxHR;
  setLogModeCopy(mode, session);
}
function plannedSessionDraft(date = dateKey(activeDate())) {
  const rawInfo = plannedInfoForState(state, date, state.selectedProgram);
  const planned = plannedSessionFor(date) || {};
  const readiness = state.readiness[date] || {};
  const dateObj = atNoon(date);
  const raw = planFor(dateObj);
  const plan = adjustedPlan(raw, readiness.color);
  return normalizeSessionRecord({
    ...planned,
    id: plannedSessionId(date, state.selectedProgram, rawInfo.weekNumber, rawInfo.dayNumber, rawInfo.plan.type),
    date,
    programId: state.selectedProgram,
    weekNumber: rawInfo.weekNumber,
    dayNumber: rawInfo.dayNumber,
    source: "planned",
    status: planned.status || "planned",
    type: rawInfo.plan.type,
    sessionType: rawInfo.plan.type,
    plannedType: rawInfo.plan.type,
    minutes: planned.minutes || plan.minutes,
    duration: planned.duration || planned.minutes || plan.minutes,
    effort: planned.effort || Number(String(plan.effort).match(/\d+/)?.[0] || 5),
    readinessColor: planned.readinessColor || readiness.color || "green",
    notes: planned.notes || state.meta.todayNotes[date] || ""
  });
}
function loadPlannedLogForm(force = false) {
  const form = document.querySelector("#sessionForm");
  if (!form || (!force && form.dataset.mode === "manual")) return;
  fillSessionForm(plannedSessionDraft(), "planned");
}
function startManualSession() {
  const form = document.querySelector("#sessionForm");
  if (!form) return;
  const date = form.elements.date.value || dateKey(activeDate());
  const type = form.elements.type.value || planFor().type;
  form.reset();
  form.elements.date.value = date;
  form.elements.type.value = type;
  syncDateControl(form.elements.date);
  fillSessionForm({
    id: "",
    date,
    type,
    sessionType: type,
    source: "manual",
    status: "completed",
    minutes: "",
    effort: "",
    breathing: "Normal",
    pain: 0,
    notes: ""
  }, "manual");
}
function collectSessionForm(form) {
  const data = Object.fromEntries(new FormData(form));
  ["minutes","duration","effort","avgHr","averageHR","maxHr","maxHR","energy","confidence","pain","distance","elevation","pace","rounds","hardSeconds","recoverySeconds","packWeight","feetPain","jointPain"]
    .forEach(key => { if (key in data) data[key] = Number(data[key]) || 0; });
  Object.keys(data).filter(key => /^(sets|reps|weight|rpe)\d+$/.test(key))
    .forEach(key => data[key] = Number(data[key]) || 0);
  data.programId = state.selectedProgram;
  data.source = data.source === "manual" ? "manual" : "planned";
  data.status = "completed";
  data.sessionType = data.type;
  data.duration = bestNumber(data.duration, data.minutes);
  data.minutes = bestNumber(data.minutes, data.duration);
  data.averageHR = bestNumber(data.averageHR, data.avgHr);
  data.avgHr = data.averageHR;
  data.maxHR = bestNumber(data.maxHR, data.maxHr);
  data.maxHr = data.maxHR;
  data.readinessColor = state.readiness[data.date]?.color || "";
  if (data.source === "planned") {
    const info = plannedInfoForState(state, data.date, state.selectedProgram);
    data.id = plannedSessionId(data.date, state.selectedProgram, info.weekNumber, info.dayNumber, info.plan.type);
    data.weekNumber = info.weekNumber;
    data.dayNumber = info.dayNumber;
    data.type = info.plan.type;
    data.sessionType = info.plan.type;
    data.plannedType = info.plan.type;
  } else {
    data.id = data.editingId || manualSessionId(data.date, data.type);
  }
  delete data.editingId;
  return data;
}
function upsertRuckForSession(session) {
  if (session.type !== "Long Walk/Hike/Ruck" && session.sessionType !== "Long Walk/Hike/Ruck") return;
  const item = {
    sessionId: session.id,
    date: session.date,
    miles: session.distance,
    packWeight: session.packWeight,
    elevation: session.elevation,
    minutes: session.minutes,
    terrain: session.terrain,
    pain: session.pain,
    notes: session.painNotes || session.notes
  };
  const index = state.rucks.findIndex(ruck => ruck.sessionId === session.id);
  if (index >= 0) state.rucks[index] = item;
  else state.rucks.push(item);
}
function renderLog() {
  const form = document.querySelector("#sessionForm");
  if (!form.dataset.mode) loadPlannedLogForm(true);
  if (!form.elements.date.value) form.elements.date.value = dateKey(activeDate());
  syncDateControl(form.elements.date);
  if (!document.querySelector("#dynamicLogFields").innerHTML) document.querySelector("#dynamicLogFields").innerHTML = dynamicFields(form.elements.type.value);
  const unique = new Map();
  state.sessions
    .filter(session => session.programId === state.selectedProgram)
    .forEach(session => unique.set(session.id, session));
  const logs = [...unique.values()].sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
  document.querySelector("#sessionHistory").innerHTML = `<article class="card"><p class="eyebrow">Session history</p><h2>${logs.length} logged session${logs.length === 1 ? "" : "s"}</h2>${logs.slice(0, 20).map(log => `
    <div class="history-card"><span class="history-icon">${sessionIcon(sessionTypeOf(log))}</span><time>${atNoon(log.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</time>
    <div><strong>${escapeHtml(sessionTypeOf(log))}</strong><span>${log.source === "manual" ? "Extra · " : ""}${log.minutes || log.duration || 0} min · effort ${log.effort || 0}/10${log.avgHr || log.averageHR ? ` · ${log.avgHr || log.averageHR} bpm` : ""}</span></div><strong>${log.pain || 0}/10</strong>
    <div class="history-actions"><button type="button" data-action="edit-session" data-session-id="${escapeHtml(log.id)}">Edit</button><button type="button" data-action="delete-session" data-session-id="${escapeHtml(log.id)}">Delete</button></div></div>`).join("")}</article>`;
}
function editSessionFromHistory(id) {
  const session = state.sessions.find(item => item.id === id);
  if (!session) return;
  fillSessionForm(session, session.source === "manual" ? "manual" : "planned");
  document.querySelector("#sessionForm")?.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start"
  });
}
function deleteSessionFromHistory(id) {
  const session = state.sessions.find(item => item.id === id);
  if (!session) return;
  const label = `${sessionTypeOf(session)} on ${atNoon(session.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  if (!confirm(`Delete ${label}? This only removes it from this device.`)) return;
  state.sessions = state.sessions.filter(item => item.id !== id);
  state.rucks = state.rucks.filter(item => item.sessionId !== id);
  if (session.source === "planned" && state.meta.todayNotes?.[session.date] === session.notes) delete state.meta.todayNotes[session.date];
  const form = document.querySelector("#sessionForm");
  if (form?.elements.editingId.value === id) loadPlannedLogForm(true);
  savedLocally("Session deleted ✓");
  renderLog();
  renderProgress();
  renderToday();
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
    : `<div class="pace-note">Training Readiness appears after three sessions so an empty week never looks like a failing score.</div>`;
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
  syncDateControl(form.elements.date);
  const noteWeek = currentWeek();
  const noteInput = document.querySelector("#weeklyNoteText");
  document.querySelector("#weeklyNoteWeek").textContent = noteWeek;
  if (noteInput && document.activeElement !== noteInput) noteInput.value = weeklyNotesBucket()[noteWeek] || "";
  document.querySelector("#weeklyNoteStatus").textContent = weeklyNotesBucket()[noteWeek] ? "Weekly note saved ✓" : "";
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
  const review = buildWeeklyReview();
  const decision = adaptiveProgramBucket("decisions")[review.id];
  const applied = review.suggestion && adjustmentForWeek(review.targetWeek)?.sourceReview === review.id;
  const status = document.querySelector("#weeklyReviewStatus");
  document.querySelector("#weeklyReviewIcon").innerHTML = sessionIcon(planFor().type);
  document.querySelector("#weeklyReviewEyebrow").textContent = review.phaseReview ? "Four-week phase review" : `Week ${review.sourceWeek}`;
  status.textContent = applied ? "Applied" : decision === "kept" ? "Plan kept" : review.enough ? "Ready" : "Building review";
  status.classList.toggle("done", !!applied);
  document.querySelector("#weeklySummary").innerHTML = [
    ["What happened", review.what],
    ["What it means", review.meaning],
    ["Suggested adjustment", applied ? `${review.suggestionText} Applied to Week ${review.targetWeek}.` : review.suggestionText]
  ].map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("");
  document.querySelector("#weeklyReviewDetails").textContent = review.details;
  const actions = document.querySelector("#weeklyReviewActions");
  actions.hidden = !review.suggestion || !!applied;
  document.querySelector("#applyWeeklySuggestion").disabled = !review.suggestion || !!applied;
  document.querySelector("#keepWeeklyPlan").classList.toggle("selected", decision === "kept");
}
function longestDistance() {
  const max = Math.max(0, ...state.sessions.map(item => Number(item.distance || 0)), ...state.rucks.map(item => Number(item.miles || 0)));
  return max ? `${max.toFixed(1)} mi` : "—";
}

const COACH_SECTIONS = [
  ["Purpose", "Train for something that matters: the mountain, a 5K, better health, greater longevity, or everyday life. The current goal is a 12-week VO₂ Max Rebuild for a stronger aerobic engine."],
  ["Training Zones", "<strong>Zone 1:</strong> 2–3/10, very easy. <strong>Zone 2:</strong> 4–5/10, full sentences. <strong>Tempo:</strong> 6–7/10, short phrases. <strong>VO₂:</strong> 8–9/10, hard but controlled."],
  ["Heart Rate Guide", "Estimated max: 189 bpm. Recovery: 95–115. Zone 2: 115–140. Tempo: 140–160. VO₂ intervals: 160–180. These are estimates; effort and symptoms win."],
  ["Safety Rules", "Stop or back off for chest pain, dizziness, faintness, unusual shortness of breath, persistent wheezing, sharp pain, or a feeling that something is wrong. Warm up at least 10 minutes before hard intervals."],
  ["Workout Instructions", "<strong>Zone 2:</strong> controlled full-sentence pace. <strong>Intervals:</strong> hard, never a sprint. <strong>Tempo:</strong> uncomfortable but sustainable. <strong>Long day:</strong> confidence-building, not crushing."],
  ["Green / Yellow / Red", "<strong>Green:</strong> do the plan. <strong>Yellow:</strong> reduce volume 25–40%. <strong>Red:</strong> skip hard work; rest or take an easy recovery walk."],
  ["Minimum Viable Week", "One Zone 2 walk, one VO₂ session, one long walk, and one strength session. An ugly week does not end the block."],
  ["Strength Plan", `<strong>Strength A</strong><br>${STRENGTH_A.join("<br>")}<br><br><strong>Strength B</strong><br>${STRENGTH_B.join("<br>")}<br><br>Leave 2–3 reps in reserve. No grinding or maxing.`],
  ["Exercise Form Guide", `<div class="exercise-library">${EXERCISES.map(exercise => exerciseHelperMarkup(exercise)).join("")}</div>`],
  ["Tracking", "Weekly: VO₂ max, resting HR, body weight, longest walk/hike, same-route average HR, energy, sleep, breathing notes, and confidence. Judge trends every 2–4 weeks."],
  ["How adjustments work", "<strong>Daily:</strong> only Green, Yellow, or Red readiness changes today’s workout. <strong>Weekly:</strong> after enough logs, the app may suggest one small change for next week. <strong>Every two weeks:</strong> it can consider longer cardio, hike, and strength trends. <strong>Every four weeks:</strong> it reviews the phase instead of reacting to one day.<br><br><strong>Small progression</strong> means changing duration, rounds, weight, incline, or pack weight one at a time. <strong>Holding steady</strong> means the baseline plan remains correct. <strong>Deloading</strong> means temporarily reducing work when repeated struggle, pain, or breathing flags appear. <strong>Training load</strong> is a plain comparison of recent time plus hard or strength work. <strong>Trend weight</strong> uses weekly averages, never one daily weigh-in. Red readiness never triggers progression."],
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
  document.querySelector("#activeProgramLabel").textContent = `Current Goal: ${activeProgram().name}`;
  document.querySelector("#trainingForLabel").textContent = `Training For: ${trainingForText()}`;
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
function updateNavActiveIndicator(target) {
  const nav = document.querySelector("#bottomNav");
  const selector = target ? `.bottom-nav a[data-target="${target}"]` : ".bottom-nav a.active";
  const activeLink = document.querySelector(selector);
  if (!nav || !activeLink) return;
  requestAnimationFrame(() => {
    nav.style.setProperty("--active-x", `${activeLink.offsetLeft}px`);
    nav.style.setProperty("--active-w", `${activeLink.offsetWidth}px`);
  });
}
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
  updateNavActiveIndicator(target);
  window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}
function toast(message) {
  const el = document.querySelector("#toast");
  el.textContent = message; el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2200);
}
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
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
  document.querySelector("#appVersion").textContent = `TrainFor v${APP_VERSION}`;
  document.querySelector("#appUpdated").textContent = `Last app update: ${APP_UPDATED}`;

  const reminder = document.querySelector("#backupReminder");
  const backupTime = state.meta.lastBackupAt ? new Date(state.meta.lastBackupAt) : null;
  const days = backupTime ? Math.floor((Date.now() - backupTime.getTime()) / 86400000) : Infinity;
  const sessionsSinceBackup = Math.max(0, state.sessions.length - Number(state.meta.lastBackupSessionCount || 0));
  reminder.classList.toggle("fresh", days < 7 && sessionsSinceBackup < 5);
  reminder.textContent = sessionsSinceBackup >= 5
    ? `You have ${sessionsSinceBackup} new session${sessionsSinceBackup === 1 ? "" : "s"} since your last backup. Export a private backup soon.`
    : days < 7
      ? `Your data lives on this device. Private backup exported ${days === 0 ? "today" : `${days} day${days === 1 ? "" : "s"} ago`}.`
      : "Your data lives on this device. You haven’t backed up in 7 days. Export a private backup.";
  renderPwaStatus();
}
function renderPwaStatus() {
  const el = document.querySelector("#pwaStatus");
  if (!el) return;
  const installed = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const swSupported = "serviceWorker" in navigator;
  const lastBackup = state.meta.lastBackupAt
    ? new Date(state.meta.lastBackupAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Never";
  const sessionsSinceBackup = Math.max(0, state.sessions.length - Number(state.meta.lastBackupSessionCount || 0));
  el.innerHTML = [
    ["PWA installed", installed ? "Yes" : "Not yet / browser tab"],
    ["Service worker", swSupported ? (navigator.serviceWorker?.controller ? "Active" : "Supported") : "Not supported here"],
    ["Version", `TrainFor v${APP_VERSION}`],
    ["Session logs", state.sessions.length],
    ["Last backup", lastBackup],
    ["New since backup", sessionsSinceBackup]
  ].map(([label, value]) => `<div class="detail-row"><span>${label}</span><strong>${value}</strong></div>`).join("");
}
function sessionsCsv() {
  const headers = [
    "id", "date", "programId", "weekNumber", "dayNumber", "source", "status", "sessionType",
    "duration", "distance", "averageHR", "maxHR", "effort", "pain", "breathing", "energy",
    "confidence", "elevation", "packWeight", "terrain", "notes", "createdAt", "updatedAt"
  ];
  const rows = state.sessions
    .filter(session => session.programId === state.selectedProgram)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .map(session => headers.map(key => csvValue(key === "sessionType" ? sessionTypeOf(session) : session[key])).join(","));
  return [headers.join(","), ...rows].join("\n");
}

function upsertTodaySession(status, options = {}) {
  const date = dateKey(activeDate());
  const raw = planFor();
  const readiness = currentReadiness();
  const plan = adjustedPlan(raw, currentReadiness().color);
  const existing = plannedSessionFor(date);
  const minutes = status === "skipped" ? 0 : Number(options.minutes ?? plan.minutes);
  const effort = status === "skipped" ? 0 : Number(options.effort ?? String(plan.effort).match(/\d+/)?.[0] ?? 5);
  const note = document.querySelector("#workoutNotes").value.trim();
  const sessionNote = options.noteSuffix
    ? note ? (note.includes(options.noteSuffix) ? note : `${note}\n\n${options.noteSuffix}`) : options.noteSuffix
    : note;
  const session = upsertSession({
    ...(existing || {}),
    date,
    type: raw.type,
    sessionType: raw.type,
    plannedType: raw.type,
    source: "planned",
    weekNumber: raw.week,
    dayNumber: raw.day,
    minutes,
    duration: minutes,
    effort,
    notes: sessionNote,
    pain: Number(existing?.pain || 0),
    confidence: Number(existing?.confidence || 0),
    breathing: existing?.breathing || "Normal",
    programId: state.selectedProgram,
    readinessColor: readiness.color || "green",
    status
  });
  state.meta.todayNotes[date] = session.notes;
  return session;
}
function saveTodayNotes(note) {
  const date = dateKey(activeDate());
  state.meta.todayNotes[date] = note;
  const existing = plannedSessionFor(date);
  if (existing) {
    existing.notes = String(note || "").trim();
    existing.updatedAt = new Date().toISOString();
  }
  saveState();
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
  console.error("TrainFor could not start: bottom navigation is missing.");
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
  updateNavActiveIndicator(target);
  window.scrollTo({ top: 0, behavior: "auto" });
}

let lastScrollY = window.scrollY;
let scrollFrame = null;
let navExpandLockUntil = 0;

function setNavCompact(compact) {
  bottomNav.classList.toggle("compact", compact);
  updateNavActiveIndicator();
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
window.addEventListener("resize", () => updateNavActiveIndicator(), { passive: true });
window.addEventListener("orientationchange", () => updateNavActiveIndicator(), { passive: true });

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
document.querySelectorAll(".date-control input[type='date']").forEach(input => {
  input.addEventListener("change", () => syncDateControl(input));
  input.addEventListener("input", () => syncDateControl(input));
});
syncDateControls();

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
  saveTodayNotes(event.target.value);
  clearTimeout(noteSaveTimer);
  noteSaveTimer = setTimeout(() => savedLocally(), 700);
});
document.querySelector("#workoutNotes")?.addEventListener("change", event => {
  clearTimeout(noteSaveTimer);
  saveTodayNotes(event.target.value.trim());
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
document.querySelector("#minimumTodayButton")?.addEventListener("click", () => {
  upsertTodaySession("reduced", { minutes: 20, effort: 3, noteSuffix: "Minimum version: 20 minutes completed." });
  savedLocally("Minimum version logged ✓");
  renderToday();
  renderProgress();
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
  const draft = plannedSessionDraft();
  draft.notes = document.querySelector("#workoutNotes").value || draft.notes;
  fillSessionForm(draft, "planned");
});
document.querySelector("#addExtraSession")?.addEventListener("click", startManualSession);
document.querySelector("#sessionHistory")?.addEventListener("click", event => {
  const button = event.target.closest("button[data-action][data-session-id]");
  if (!button) return;
  if (button.dataset.action === "edit-session") editSessionFromHistory(button.dataset.sessionId);
  if (button.dataset.action === "delete-session") deleteSessionFromHistory(button.dataset.sessionId);
});
document.querySelector("#sessionForm")?.elements.date?.addEventListener("change", event => {
  const form = document.querySelector("#sessionForm");
  if (form?.dataset.mode === "planned") fillSessionForm(plannedSessionDraft(event.target.value), "planned");
});
document.querySelector("#sessionType")?.addEventListener("change", event => {
  const form = document.querySelector("#sessionForm");
  if (form?.dataset.mode === "planned") {
    const date = form.elements.date.value || dateKey(activeDate());
    fillSessionForm(plannedSessionDraft(date), "planned");
    return;
  }
  document.querySelector("#dynamicLogFields").innerHTML = dynamicFields(event.target.value);
  setLogModeCopy("manual");
});
document.querySelector("#sessionForm")?.addEventListener("submit", event => {
  event.preventDefault();
  const earnedBefore = earnedBadgeWeeks();
  const data = collectSessionForm(event.currentTarget);
  const session = upsertSession(data);
  upsertRuckForSession(session);
  if (session.source === "planned") state.meta.todayNotes[session.date] = session.notes;
  event.currentTarget.reset();
  populateSessionTypes();
  loadPlannedLogForm(true);
  savedLocally(session.source === "planned" ? "Session updated ✓" : "Session saved locally ✓");
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
let weeklyNoteSaveTimer = null;
document.querySelector("#weeklyNoteText")?.addEventListener("input", event => {
  weeklyNotesBucket()[currentWeek()] = event.target.value;
  saveState();
  document.querySelector("#weeklyNoteStatus").textContent = "Saving note...";
  clearTimeout(weeklyNoteSaveTimer);
  weeklyNoteSaveTimer = setTimeout(() => {
    savedLocally("Weekly note saved ✓");
    document.querySelector("#weeklyNoteStatus").textContent = "Weekly note saved ✓";
  }, 700);
});
document.querySelector("#weeklyNoteText")?.addEventListener("change", event => {
  clearTimeout(weeklyNoteSaveTimer);
  weeklyNotesBucket()[currentWeek()] = event.target.value.trim();
  savedLocally("Weekly note saved ✓");
  renderProgress();
});
document.querySelector("#applyWeeklySuggestion")?.addEventListener("click", () => {
  const review = buildWeeklyReview();
  if (!review.suggestion) return;
  adaptiveProgramBucket("adjustments")[review.targetWeek] = {
    ...review.suggestion,
    sourceReview: review.id,
    appliedAt: new Date().toISOString()
  };
  adaptiveProgramBucket("decisions")[review.id] = "applied";
  savedLocally("Weekly adjustment applied ✓");
  renderProgress();
  renderPlan(Number(document.querySelector("#phaseTabs .active")?.dataset.phase || 1));
  renderToday();
});
document.querySelector("#keepWeeklyPlan")?.addEventListener("click", () => {
  const review = buildWeeklyReview();
  adaptiveProgramBucket("decisions")[review.id] = "kept";
  savedLocally("Baseline plan kept ✓");
  renderWeeklySummary();
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
    console.error("TrainFor tab render failed; using basic navigation.", error);
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
document.querySelector("#settingsButton")?.addEventListener("click", () => {
  renderSavedState();
  dialog?.showModal();
});
document.querySelector("#closeSettings")?.addEventListener("click", () => dialog?.close());
document.querySelector("#editProfile")?.addEventListener("click", () => { dialog?.close(); showOnboarding(); });
document.querySelector("#exportData")?.addEventListener("click", () => {
  state.meta.lastBackupAt = new Date().toISOString();
  state.meta.lastBackupSessionCount = state.sessions.length;
  state.meta.lastSavedAt = state.meta.lastBackupAt;
  saveState();
  renderSavedState();
  const blob = new Blob([JSON.stringify({ version: 5, exportedAt: state.meta.lastBackupAt, state }, null, 2)], { type: "application/json" });
  downloadBlob(blob, `trainfor-backup-${dateKey(today())}.json`);
  toast("Private backup exported ✓");
});
document.querySelector("#exportCsv")?.addEventListener("click", () => {
  const blob = new Blob([sessionsCsv()], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, `trainfor-sessions-${dateKey(today())}.csv`);
  toast("Sessions CSV exported ✓");
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
    const wanted = ["HKQuantityTypeIdentifierVO2Max","HKQuantityTypeIdentifierRestingHeartRate","HKQuantityTypeIdentifierHeartRate","HKQuantityTypeIdentifierWalkingHeartRateAverage","HKQuantityTypeIdentifierStepCount","HKQuantityTypeIdentifierActiveEnergyBurned","HKQuantityTypeIdentifierAppleExerciseTime","HKCategoryTypeIdentifierSleepAnalysis"];
    const counts = {}, latestValues = {};
    xml.querySelectorAll("Record").forEach(record => {
      const type = record.getAttribute("type"); if (!wanted.includes(type)) return;
      counts[type] = (counts[type] || 0) + 1;
      const endDate = record.getAttribute("endDate") || "";
      if (!latestValues[type] || endDate > latestValues[type].endDate) latestValues[type] = { value: record.getAttribute("value"), unit: record.getAttribute("unit"), endDate };
    });
    const workouts = [...xml.querySelectorAll("Workout")];
    const latestWorkout = workouts.map(workout => ({
      type: workout.getAttribute("workoutActivityType") || "Workout",
      duration: workout.getAttribute("duration") || "",
      unit: workout.getAttribute("durationUnit") || "min",
      endDate: workout.getAttribute("endDate") || workout.getAttribute("startDate") || ""
    })).sort((a, b) => String(a.endDate).localeCompare(String(b.endDate))).at(-1) || null;
    state.healthImport = { fileName: file.name, importedAt: new Date().toISOString(), counts, latest: latestValues, workoutCount: workouts.length, latestWorkout };
    savedLocally("Apple Health imported ✓"); renderHealthSummary(); renderProgress(); renderToday();
  } catch { toast("Choose the extracted Apple Health export.xml file"); }
  event.target.value = "";
});
document.querySelector("#resetData")?.addEventListener("click", () => {
  if (!confirm("Reset all local TrainFor data on this device?")) return;
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
  const latestMetric = type => health.latest?.[type];
  const metricText = type => {
    const item = latestMetric(type);
    if (!item) return "—";
    const date = item.endDate ? new Date(item.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "date unknown";
    return `${item.value || "—"}${item.unit ? ` ${item.unit}` : ""} · ${date}`;
  };
  const workout = health.latestWorkout;
  el.innerHTML = [
    ["File", escapeHtml(health.fileName)],
    ["Relevant records", count.toLocaleString()],
    ["Workout records", Number(health.workoutCount || 0).toLocaleString()],
    ["VO₂ max", metricText("HKQuantityTypeIdentifierVO2Max")],
    ["Resting HR", metricText("HKQuantityTypeIdentifierRestingHeartRate")],
    ["Heart rate records", Number(health.counts?.HKQuantityTypeIdentifierHeartRate || 0).toLocaleString()],
    ["Walking HR avg", metricText("HKQuantityTypeIdentifierWalkingHeartRateAverage")],
    ["Exercise minutes", metricText("HKQuantityTypeIdentifierAppleExerciseTime")],
    ["Latest workout", workout ? `${workout.type.replace("HKWorkoutActivityType", "")} · ${workout.duration || "—"} ${workout.unit || "min"}` : "—"]
  ].map(([label, value]) => `<div class="detail-row"><span>${label}</span><strong>${value}</strong></div>`).join("");
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
    console.warn("TrainFor update check failed; reloading directly.", error);
  }

  const freshUrl = new URL(location.href);
  freshUrl.searchParams.set("mb-update", Date.now());
  location.replace(freshUrl.href);
});
registerServiceWorker().catch(error => console.warn("Service worker registration failed.", error));
try {
  renderAll();
} catch (error) {
  console.error("TrainFor startup render failed; enabling basic tab navigation.", error);
  fallbackNavigate(["today","plan","log","progress","coach"].includes(location.hash.slice(1)) ? location.hash.slice(1) : "today");
}
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrapApp, { once: true });
} else {
  bootstrapApp();
}
