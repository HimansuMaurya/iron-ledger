const STORAGE_KEY = "iron-ledger-v2";

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

const dashboardExercises = [
  { id: "lat-pulldown", label: "Lat Pulldown", mode: "e1rm" },
  { id: "incline-db-press-heavy", label: "Incline DB Press", mode: "e1rm" },
  { id: "back-squat", label: "Back Squat", mode: "e1rm" },
  { id: "romanian-deadlift", label: "Romanian Deadlift", mode: "e1rm" },
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
const dashboardGrid = document.getElementById("dashboardGrid");
const weightChart = document.getElementById("weightChart");
const weightTrendText = document.getElementById("weightTrendText");
const storageStatus = document.getElementById("storageStatus");

initialize();

function initialize() {
  const today = getDateString(new Date());
  weightDate.value = state.currentWeightDate || today;
  sessionDate.value = state.currentSessionDate || today;
  state.activeDayId = state.activeDayId || inferDayFromDate(sessionDate.value);
  state.ui = state.ui || {};

  renderTabs();
  renderWorkout();
  renderWeights();
  renderDashboard();
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
    renderDashboard();
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
      setTimeout(() => {
        exportButton.textContent = "Copy Backup JSON";
      }, 1400);
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeState(imported)));
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
      state.ui.editingSet = null;
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
    const cancelEditButton = node.querySelector(".cancel-edit-button");
    const helperText = node.querySelector(".helper-text");
    const loggedSets = node.querySelector(".logged-sets");

    const entries = session.exercises[exercise.id] || [];
    const defaults = getLastSetAcrossSessions(exercise.id);
    const editing = getEditingState(date, day.id, exercise.id);

    name.textContent = exercise.name;
    target.textContent = exercise.target;
    setCount.textContent = `${entries.length} set${entries.length === 1 ? "" : "s"}`;

    if (editing) {
      weightInput.value = editing.entry.weight;
      repsInput.value = editing.entry.reps;
      logButton.textContent = "Save Edit";
      cancelEditButton.hidden = false;
      helperText.textContent = `Editing set ${editing.setIndex + 1}. Save to overwrite or cancel to discard.`;
    } else if (defaults) {
      weightInput.value = defaults.weight;
      repsInput.value = defaults.reps;
      logButton.textContent = "Log Set";
      cancelEditButton.hidden = true;
      helperText.textContent = "Last matching set is prefilled to keep logging fast.";
    } else {
      logButton.textContent = "Log Set";
      cancelEditButton.hidden = true;
      helperText.textContent = "Enter weight and reps, then log each working set.";
    }

    renderSetPills(loggedSets, entries, {
      onEdit: (index) => {
        state.ui.editingSet = {
          date,
          dayId: day.id,
          exerciseId: exercise.id,
          setIndex: index,
        };
        saveState();
        renderWorkout();
      },
      onDelete: (index) => {
        const liveSession = getSession(date, day.id);
        liveSession.exercises[exercise.id].splice(index, 1);
        clearEditingIfTarget(date, day.id, exercise.id, index);
        saveState();
        renderWorkout();
        renderDashboard();
      },
    });

    logButton.addEventListener("click", () => {
      const weight = Number(weightInput.value);
      const reps = Number(repsInput.value);
      if (Number.isNaN(weight) || Number.isNaN(reps)) {
        return;
      }

      const liveSession = getSession(date, day.id);
      liveSession.exercises[exercise.id] = liveSession.exercises[exercise.id] || [];

      if (editing) {
        liveSession.exercises[exercise.id][editing.setIndex] = { weight, reps };
        state.ui.editingSet = null;
      } else {
        liveSession.exercises[exercise.id].push({ weight, reps });
      }

      saveState();
      renderWorkout();
      renderDashboard();
    });

    repeatButton.addEventListener("click", () => {
      const liveSession = getSession(date, day.id);
      const liveEntries = liveSession.exercises[exercise.id] || [];
      const last = liveEntries[liveEntries.length - 1] || defaults;
      if (!last) {
        return;
      }
      liveSession.exercises[exercise.id] = liveEntries;
      liveSession.exercises[exercise.id].push({
        weight: Number(last.weight),
        reps: Number(last.reps),
      });
      state.ui.editingSet = null;
      saveState();
      renderWorkout();
      renderDashboard();
    });

    undoButton.addEventListener("click", () => {
      const liveSession = getSession(date, day.id);
      const liveEntries = liveSession.exercises[exercise.id] || [];
      liveEntries.pop();
      state.ui.editingSet = null;
      saveState();
      renderWorkout();
      renderDashboard();
    });

    cancelEditButton.addEventListener("click", () => {
      state.ui.editingSet = null;
      saveState();
      renderWorkout();
    });

    exerciseList.appendChild(card);
  });
}

function renderWeights() {
  const entries = getWeightEntries();
  const avg = calculate7DayAverage(entries);
  avgWeight.textContent = avg ? `${avg.toFixed(1)} kg` : "-";

  weightHistory.innerHTML = "";
  entries.slice(0, 7).forEach((entry) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "history-row history-button";
    row.innerHTML = `<span>${shortDate(entry.date)}</span><strong>${entry.value.toFixed(1)} kg</strong>`;
    row.addEventListener("click", () => {
      weightDate.value = entry.date;
      weightValue.value = entry.value;
    });
    weightHistory.appendChild(row);
  });

  if (!entries.length) {
    const empty = document.createElement("div");
    empty.className = "history-row";
    empty.innerHTML = "<span>No weigh-ins yet</span><strong>Start tomorrow</strong>";
    weightHistory.appendChild(empty);
  }
}

function renderDashboard() {
  const weightEntries = getWeightEntries();
  const avg = calculate7DayAverage(weightEntries);
  const latestWeight = weightEntries[0]?.value ?? null;
  const previousWeek = weightEntries.slice(7, 14);
  const previousAvg = previousWeek.length ? average(previousWeek.map((entry) => entry.value)) : null;
  const totalSessions = countSessions();
  const totalSets = countSets();

  storageStatus.textContent =
    "Data is saved instantly in this phone browser using local storage. There is no automatic cloud sync yet, so use backup export if you change phones or clear browser data.";

  weightTrendText.textContent = buildWeightTrendText(avg, previousAvg, latestWeight);
  renderWeightChart(weightEntries.slice(0, 14).reverse().map((entry) => entry.value));

  dashboardGrid.innerHTML = "";

  const statCards = [
    {
      title: "Current Weight",
      value: latestWeight ? `${latestWeight.toFixed(1)} kg` : "-",
      subtext: avg ? `7-day avg ${avg.toFixed(1)} kg` : "Add more weigh-ins",
    },
    {
      title: "Weekly Change",
      value:
        avg && previousAvg ? `${formatSigned(avg - previousAvg)} kg` : "-",
      subtext: "Current 7-day avg vs previous 7-day block",
    },
    {
      title: "Logged Sessions",
      value: String(totalSessions),
      subtext: `${totalSets} working sets captured`,
    },
  ];

  statCards.forEach((card) => dashboardGrid.appendChild(createInsightCard(card)));

  dashboardExercises.forEach((exercise) => {
    const insight = buildExerciseInsight(exercise.id);
    dashboardGrid.appendChild(
      createInsightCard({
        title: exercise.label,
        value: insight.current,
        subtext: insight.subtext,
        sparkValues: insight.sparkValues,
      }),
    );
  });
}

function createInsightCard({ title, value, subtext, sparkValues = [] }) {
  const card = document.createElement("article");
  card.className = "insight-card";

  const titleNode = document.createElement("p");
  titleNode.className = "insight-label";
  titleNode.textContent = title;

  const valueNode = document.createElement("strong");
  valueNode.className = "insight-value";
  valueNode.textContent = value;

  const subNode = document.createElement("p");
  subNode.className = "insight-subtext";
  subNode.textContent = subtext;

  card.append(titleNode, valueNode, subNode);

  if (sparkValues.length >= 2) {
    const chart = document.createElement("div");
    chart.className = "sparkline-wrap";
    chart.innerHTML = renderSparkline(sparkValues, 220, 58);
    card.appendChild(chart);
  }

  return card;
}

function renderSetPills(container, entries, actions) {
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
    pill.className = "set-pill set-pill-actions";
    pill.innerHTML = `
      <div class="set-pill-copy">
        <span>Set ${index + 1}</span>
        <strong>${entry.weight} kg x ${entry.reps}</strong>
      </div>
      <div class="set-pill-buttons">
        <button class="mini-button edit-set-button" type="button">Edit</button>
        <button class="mini-button delete-set-button" type="button">Delete</button>
      </div>
    `;
    pill.querySelector(".edit-set-button").addEventListener("click", () => actions.onEdit(index));
    pill.querySelector(".delete-set-button").addEventListener("click", () => actions.onDelete(index));
    container.appendChild(pill);
  });
}

function renderWeightChart(values) {
  if (values.length < 2) {
    weightChart.innerHTML = "<div class=\"chart-empty\">Need at least 2 weigh-ins to draw a trend.</div>";
    return;
  }
  weightChart.innerHTML = renderSparkline(values, 720, 160);
}

function renderSparkline(values, width, height) {
  const padding = 12;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = values.length > 1 ? (width - padding * 2) / (values.length - 1) : 0;
  const points = values
    .map((value, index) => {
      const x = padding + step * index;
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return `
    <svg viewBox="0 0 ${width} ${height}" class="sparkline" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="rgba(217,93,57,0.26)"></stop>
          <stop offset="100%" stop-color="rgba(217,93,57,0.02)"></stop>
        </linearGradient>
      </defs>
      <polyline fill="none" stroke="#226b53" stroke-width="4" points="${points}"></polyline>
      <polyline fill="rgba(34,107,83,0.08)" stroke="none" points="${points} ${width - padding},${height - padding} ${padding},${height - padding}"></polyline>
    </svg>
  `;
}

function buildExerciseInsight(exerciseId) {
  const entries = getExerciseHistory(exerciseId);
  if (!entries.length) {
    return {
      current: "-",
      subtext: "No logged sets yet",
      sparkValues: [],
    };
  }

  const bestBySession = collapseBySessionBest(entries);
  const current = bestBySession[bestBySession.length - 1];
  const previous = bestBySession[bestBySession.length - 2];
  const sparkValues = bestBySession.slice(-8).map((entry) => entry.score);
  const delta = previous ? current.score - previous.score : null;

  return {
    current: `${current.score.toFixed(1)} e1RM`,
    subtext: previous
      ? `${shortDate(current.date)} vs ${shortDate(previous.date)}: ${formatSigned(delta)}`
      : `First logged session on ${shortDate(current.date)}`,
    sparkValues,
  };
}

function collapseBySessionBest(entries) {
  const grouped = new Map();

  entries.forEach((entry) => {
    const key = `${entry.date}-${entry.dayId}`;
    const score = estimateOneRepMax(entry.weight, entry.reps);
    const current = grouped.get(key);
    if (!current || score > current.score) {
      grouped.set(key, { date: entry.date, dayId: entry.dayId, score });
    }
  });

  return [...grouped.values()].sort((a, b) => a.date.localeCompare(b.date));
}

function getExerciseHistory(exerciseId) {
  const history = [];
  Object.entries(state.sessions).forEach(([date, days]) => {
    Object.entries(days).forEach(([dayId, session]) => {
      const sets = session?.exercises?.[exerciseId] || [];
      sets.forEach((entry) => history.push({ ...entry, date, dayId }));
    });
  });
  return history.sort((a, b) => a.date.localeCompare(b.date));
}

function getSession(date, dayId) {
  state.sessions[date] = state.sessions[date] || {};
  state.sessions[date][dayId] = state.sessions[date][dayId] || { exercises: {} };
  return state.sessions[date][dayId];
}

function getLastSetAcrossSessions(exerciseId) {
  const history = getExerciseHistory(exerciseId);
  return history.length ? history[history.length - 1] : null;
}

function getEditingState(date, dayId, exerciseId) {
  const editing = state.ui?.editingSet;
  if (!editing) {
    return null;
  }
  if (editing.date !== date || editing.dayId !== dayId || editing.exerciseId !== exerciseId) {
    return null;
  }

  const session = getSession(date, dayId);
  const entry = session.exercises[exerciseId]?.[editing.setIndex];
  if (!entry) {
    return null;
  }
  return { ...editing, entry };
}

function clearEditingIfTarget(date, dayId, exerciseId, removedIndex) {
  const editing = state.ui?.editingSet;
  if (!editing) {
    return;
  }
  if (editing.date !== date || editing.dayId !== dayId || editing.exerciseId !== exerciseId) {
    return;
  }
  if (editing.setIndex === removedIndex) {
    state.ui.editingSet = null;
    return;
  }
  if (editing.setIndex > removedIndex) {
    state.ui.editingSet.setIndex -= 1;
  }
}

function getWeightEntries() {
  return Object.entries(state.weights)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function calculate7DayAverage(entries) {
  const latestSeven = entries.slice(0, 7);
  if (!latestSeven.length) {
    return null;
  }
  const total = latestSeven.reduce((sum, entry) => sum + entry.value, 0);
  return total / latestSeven.length;
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function estimateOneRepMax(weight, reps) {
  return weight * (1 + reps / 30);
}

function countSessions() {
  return Object.values(state.sessions).reduce((total, days) => total + Object.keys(days).length, 0);
}

function countSets() {
  let count = 0;
  Object.values(state.sessions).forEach((days) => {
    Object.values(days).forEach((session) => {
      Object.values(session.exercises || {}).forEach((sets) => {
        count += sets.length;
      });
    });
  });
  return count;
}

function buildWeightTrendText(avg, previousAvg, latestWeight) {
  if (!latestWeight) {
    return "No bodyweight data yet. Start logging each morning after the bathroom and before food.";
  }
  if (!avg || !previousAvg) {
    return `Latest weigh-in is ${latestWeight.toFixed(1)} kg. Add at least 8 daily entries to unlock weekly trend comparison.`;
  }
  return `Current 7-day average is ${avg.toFixed(1)} kg, which is ${formatSigned(avg - previousAvg)} kg versus the previous 7-day block.`;
}

function formatSigned(value) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}`;
}

function inferDayFromDate(dateString) {
  const date = new Date(dateString);
  const weekday = date.getDay();
  return [null, "mon", "tue", "wed", "thu", "fri", "sat"][weekday] || "mon";
}

function shortDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
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

function normalizeState(raw) {
  return {
    weights: raw.weights || {},
    sessions: raw.sessions || {},
    activeDayId: raw.activeDayId || "mon",
    currentWeightDate: raw.currentWeightDate,
    currentSessionDate: raw.currentSessionDate,
    ui: raw.ui || {},
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return normalizeState(JSON.parse(raw));
    }

    const legacyRaw = localStorage.getItem("iron-ledger-v1");
    if (legacyRaw) {
      const migrated = normalizeState(JSON.parse(legacyRaw));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
  } catch {
    return normalizeState({});
  }
  return normalizeState({});
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
