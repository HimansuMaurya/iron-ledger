const STORAGE_KEY = "iron-ledger-v1";

const splitDays = [
  {
    id: "mon",
    label: "Mon",
    name: "Pull A",
    focus: "Lat width + biceps",
    notes: "Freshest energy goes to lats. Hit full stretch and clean scapular control.",
    exercises: [
      { id: "lat-pulldown", name: "Lat Pulldown", target: "4 x 8-12" },
      { id: "single-arm-row", name: "Single-Arm Cable Row", target: "3 x 8-12" },
      { id: "neutral-pulldown", name: "Neutral/V-Bar Pulldown", target: "3 x 10-12" },
      { id: "straight-arm-pulldown", name: "Straight-Arm Pulldown", target: "2 x 12-15" },
      { id: "incline-db-curl", name: "Incline Dumbbell Curl", target: "3 x 8-12" },
      { id: "hammer-curl", name: "Hammer Curl", target: "2 x 10-12" },
    ],
  },
  {
    id: "tue",
    label: "Tue",
    name: "Push A",
    focus: "Upper chest + side delts + triceps",
    notes: "Upper chest first. Delts are a visible priority, so keep lateral raises strict.",
    exercises: [
      { id: "incline-db-press-heavy", name: "Incline Dumbbell Press", target: "4 x 6-10" },
      { id: "flat-db-press", name: "Flat Dumbbell Press", target: "3 x 8-12" },
      { id: "low-high-fly", name: "Low-to-High Cable Fly", target: "2 x 12-15" },
      { id: "seated-db-ohp", name: "Seated Dumbbell OHP", target: "2-3 x 6-10" },
      { id: "cable-lateral-raise-a", name: "Cable Lateral Raise", target: "4 x 12-20" },
      { id: "rope-pressdown", name: "Rope Pressdown", target: "3 x 10-15" },
    ],
  },
  {
    id: "wed",
    label: "Wed",
    name: "Legs A",
    focus: "Quads + abs",
    notes: "You are not ignoring legs. Keep the session tight and move with intent.",
    exercises: [
      { id: "back-squat", name: "Back Squat", target: "4 x 5-8" },
      { id: "leg-press", name: "Leg Press", target: "3 x 10-15" },
      { id: "bulgarian-split-squat", name: "Bulgarian Split Squat", target: "2-3 x 8-12" },
      { id: "leg-extension", name: "Leg Extension", target: "2 x 12-15" },
      { id: "standing-calf-raise", name: "Standing Calf Raise", target: "4 x 10-15" },
      { id: "cable-crunch", name: "Cable Crunch", target: "3 x 12-20" },
    ],
  },
  {
    id: "thu",
    label: "Thu",
    name: "Pull B",
    focus: "Thickness + rear delts + biceps",
    notes: "Rows and rear delts build the upper-back shelf that makes the taper look bigger.",
    exercises: [
      { id: "barbell-row", name: "Barbell or Chest-Supported Row", target: "4 x 6-10" },
      { id: "seated-cable-row", name: "Seated Cable Row", target: "3 x 8-12" },
      { id: "close-grip-pulldown", name: "Close-Grip Pulldown", target: "3 x 8-12" },
      { id: "rear-delt-fly-a", name: "Rear-Delt Fly", target: "4 x 12-20" },
      { id: "ez-curl", name: "EZ-Bar Curl", target: "3 x 8-12" },
      { id: "preacher-curl", name: "Preacher Curl", target: "2 x 10-12" },
    ],
  },
  {
    id: "fri",
    label: "Fri",
    name: "Push B",
    focus: "Delts + chest + triceps",
    notes: "This day keeps the shoulder cap growing. Don’t let ego ruin cable or fly form.",
    exercises: [
      { id: "cable-lateral-raise-b", name: "Cable Lateral Raise", target: "4 x 12-20" },
      { id: "incline-db-press-volume", name: "Incline Dumbbell Press", target: "3 x 8-12" },
      { id: "flat-db-press-volume", name: "Flat Dumbbell Press", target: "3 x 8-12" },
      { id: "pec-deck", name: "Pec Deck or Cable Fly", target: "2 x 12-15" },
      { id: "face-pull", name: "Face Pull / Rear-Delt Cable Fly", target: "3 x 12-20" },
      { id: "overhead-rope-extension", name: "Overhead Rope Extension", target: "3 x 10-15" },
    ],
  },
  {
    id: "sat",
    label: "Sat",
    name: "Legs B + Arms",
    focus: "Hamstrings + calves + arms",
    notes: "Posterior chain first, then arm volume. This supports the aesthetic without wasting time.",
    exercises: [
      { id: "romanian-deadlift", name: "Romanian Deadlift", target: "4 x 6-10" },
      { id: "leg-curl", name: "Lying / Seated Leg Curl", target: "3 x 10-15" },
      { id: "walking-lunge", name: "Walking Lunges / Hack Squat", target: "2-3 x 8-12" },
      { id: "seated-calf-raise", name: "Seated Calf Raise", target: "4 x 12-20" },
      { id: "bayesian-curl", name: "Cable / Bayesian Curl", target: "3 x 10-15" },
      { id: "skull-crusher", name: "Skull Crusher / Cable Extension", target: "3 x 10-15" },
      { id: "vacuum-practice", name: "Vacuum Practice", target: "3 sets" },
    ],
  },
];

const state = loadState();

const weightForm = document.getElementById("weightForm");
const weightDate = document.getElementById("weightDate");
const weightValue = document.getElementById("weightValue");
const weightHistory = document.getElementById("weightHistory");
const avgWeight = document.getElementById("avgWeight");
const todayLabel = document.getElementById("todayLabel");
const sessionDate = document.getElementById("sessionDate");
const dayTabs = document.getElementById("dayTabs");
const dayMeta = document.getElementById("dayMeta");
const exerciseList = document.getElementById("exerciseList");
const exerciseTemplate = document.getElementById("exerciseTemplate");
const exportButton = document.getElementById("exportButton");
const downloadButton = document.getElementById("downloadButton");
const importInput = document.getElementById("importInput");
const importButton = document.getElementById("importButton");

initialize();

function initialize() {
  const today = getDateString(new Date());
  weightDate.value = state.currentWeightDate || today;
  sessionDate.value = state.currentSessionDate || today;
  state.activeDayId = state.activeDayId || inferDayFromDate(sessionDate.value);

  renderTabs();
  renderWorkout();
  renderWeights();
  bindEvents();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  }
}

function bindEvents() {
  weightForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const date = weightDate.value;
    const value = Number(weightValue.value);
    if (!date || Number.isNaN(value)) {
      return;
    }

    state.weights[date] = value;
    state.currentWeightDate = date;
    saveState();
    renderWeights();
    weightValue.value = "";
  });

  sessionDate.addEventListener("change", () => {
    state.currentSessionDate = sessionDate.value;
    state.activeDayId = inferDayFromDate(sessionDate.value);
    saveState();
    renderTabs();
    renderWorkout();
  });

  exportButton.addEventListener("click", async () => {
    const payload = JSON.stringify(state, null, 2);
    try {
      await navigator.clipboard.writeText(payload);
      exportButton.textContent = "Copied";
      setTimeout(() => {
        exportButton.textContent = "Copy Backup JSON";
      }, 1400);
    } catch {
      exportButton.textContent = "Copy failed";
    }
  });

  downloadButton.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `iron-ledger-backup-${getDateString(new Date())}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  });

  importButton.addEventListener("click", () => {
    try {
      const imported = JSON.parse(importInput.value);
      if (!imported || typeof imported !== "object") {
        throw new Error("Invalid payload");
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(imported));
      window.location.reload();
    } catch {
      importButton.textContent = "Import failed";
      setTimeout(() => {
        importButton.textContent = "Import Backup";
      }, 1400);
    }
  });
}

function renderTabs() {
  dayTabs.innerHTML = "";

  splitDays.forEach((day) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `tab-button${day.id === state.activeDayId ? " active" : ""}`;
    button.textContent = `${day.label} ${day.name}`;
    button.addEventListener("click", () => {
      state.activeDayId = day.id;
      saveState();
      renderTabs();
      renderWorkout();
    });
    dayTabs.appendChild(button);
  });
}

function renderWorkout() {
  const day = splitDays.find((item) => item.id === state.activeDayId) || splitDays[0];
  const date = sessionDate.value || getDateString(new Date());
  const session = getSession(date, day.id);

  todayLabel.textContent = `${day.label} • ${shortDate(date)}`;
  dayMeta.textContent = `${day.name}: ${day.focus}. ${day.notes}`;
  exerciseList.innerHTML = "";

  day.exercises.forEach((exercise) => {
    const node = exerciseTemplate.content.cloneNode(true);
    const card = node.querySelector(".exercise-card");
    const name = node.querySelector(".exercise-name");
    const target = node.querySelector(".exercise-target");
    const setCount = node.querySelector(".set-count");
    const weightInput = node.querySelector(".exercise-weight");
    const repsInput = node.querySelector(".exercise-reps");
    const logButton = node.querySelector(".log-button");
    const repeatButton = node.querySelector(".repeat-button");
    const undoButton = node.querySelector(".undo-button");
    const loggedSets = node.querySelector(".logged-sets");

    const entries = session.exercises[exercise.id] || [];
    const defaults = getLastSetAcrossSessions(day.id, exercise.id);

    name.textContent = exercise.name;
    target.textContent = exercise.target;
    setCount.textContent = `${entries.length} set${entries.length === 1 ? "" : "s"}`;

    if (defaults) {
      weightInput.value = defaults.weight;
      repsInput.value = defaults.reps;
    }

    renderSetPills(loggedSets, entries);

    logButton.addEventListener("click", () => {
      const weight = Number(weightInput.value);
      const reps = Number(repsInput.value);
      if (Number.isNaN(weight) || Number.isNaN(reps)) {
        return;
      }

      const liveSession = getSession(date, day.id);
      liveSession.exercises[exercise.id] = liveSession.exercises[exercise.id] || [];
      liveSession.exercises[exercise.id].push({ weight, reps });
      saveState();
      renderWorkout();
    });

    repeatButton.addEventListener("click", () => {
      const liveSession = getSession(date, day.id);
      const liveEntries = liveSession.exercises[exercise.id] || [];
      const last = liveEntries[liveEntries.length - 1] || defaults;
      if (!last) {
        return;
      }
      liveSession.exercises[exercise.id] = liveEntries;
      liveSession.exercises[exercise.id].push({ weight: Number(last.weight), reps: Number(last.reps) });
      saveState();
      renderWorkout();
    });

    undoButton.addEventListener("click", () => {
      const liveSession = getSession(date, day.id);
      const liveEntries = liveSession.exercises[exercise.id] || [];
      liveEntries.pop();
      saveState();
      renderWorkout();
    });

    exerciseList.appendChild(card);
  });
}

function renderWeights() {
  const entries = Object.entries(state.weights)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => b.date.localeCompare(a.date));

  const avg = calculate7DayAverage(entries);
  avgWeight.textContent = avg ? `${avg.toFixed(1)} kg` : "-";

  weightHistory.innerHTML = "";
  entries.slice(0, 7).forEach((entry) => {
    const row = document.createElement("div");
    row.className = "history-row";
    row.innerHTML = `<span>${shortDate(entry.date)}</span><strong>${entry.value.toFixed(1)} kg</strong>`;
    weightHistory.appendChild(row);
  });

  if (!entries.length) {
    const empty = document.createElement("div");
    empty.className = "history-row";
    empty.innerHTML = "<span>No weigh-ins yet</span><strong>Start tomorrow</strong>";
    weightHistory.appendChild(empty);
  }
}

function renderSetPills(container, entries) {
  container.innerHTML = "";

  if (!entries.length) {
    const empty = document.createElement("div");
    empty.className = "set-pill";
    empty.innerHTML = "<span>Nothing logged yet</span><strong>Use last week’s load</strong>";
    container.appendChild(empty);
    return;
  }

  entries.forEach((entry, index) => {
    const pill = document.createElement("div");
    pill.className = "set-pill";
    pill.innerHTML = `<span>Set ${index + 1}</span><strong>${entry.weight} kg x ${entry.reps}</strong>`;
    container.appendChild(pill);
  });
}

function getSession(date, dayId) {
  state.sessions[date] = state.sessions[date] || {};
  state.sessions[date][dayId] = state.sessions[date][dayId] || { exercises: {} };
  return state.sessions[date][dayId];
}

function getLastSetAcrossSessions(dayId, exerciseId) {
  const dates = Object.keys(state.sessions).sort().reverse();
  for (const date of dates) {
    const day = state.sessions[date][dayId];
    const entries = day?.exercises?.[exerciseId];
    if (entries?.length) {
      return entries[entries.length - 1];
    }
  }
  return null;
}

function calculate7DayAverage(entries) {
  const latestSeven = entries.slice(0, 7);
  if (!latestSeven.length) {
    return null;
  }
  const total = latestSeven.reduce((sum, entry) => sum + entry.value, 0);
  return total / latestSeven.length;
}

function inferDayFromDate(dateString) {
  const date = new Date(dateString);
  const weekday = date.getDay();
  return [null, "mon", "tue", "wed", "thu", "fri", "sat"][weekday] || "mon";
}

function shortDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { weights: {}, sessions: {}, activeDayId: "mon" };
    }
    const parsed = JSON.parse(raw);
    return {
      weights: parsed.weights || {},
      sessions: parsed.sessions || {},
      activeDayId: parsed.activeDayId || "mon",
      currentWeightDate: parsed.currentWeightDate,
      currentSessionDate: parsed.currentSessionDate,
    };
  } catch {
    return { weights: {}, sessions: {}, activeDayId: "mon" };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
