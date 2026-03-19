const STORAGE_KEY = "iron-ledger-v3";
const LEGACY_KEYS = ["iron-ledger-v2", "iron-ledger-v1"];
const SYNC_DEBOUNCE_MS = 1200;
const SNAPSHOT_TABLE = "user_snapshots";

const DEFAULT_SPLIT_DAYS = [
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

const dashboardExercises = ["lat-pulldown", "incline-db-press-heavy", "back-squat", "romanian-deadlift"];

const state = loadState();
let supabase = null;
let supabaseModule = null;
let syncTimer = null;
let syncInFlight = null;
let suspendNextSync = false;

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
const syncHealthCard = document.getElementById("syncHealthCard");
const weightChart = document.getElementById("weightChart");
const weightTrendText = document.getElementById("weightTrendText");
const storageStatus = document.getElementById("storageStatus");
const syncForm = document.getElementById("syncForm");
const supabaseUrlInput = document.getElementById("supabaseUrl");
const supabaseAnonKeyInput = document.getElementById("supabaseAnonKey");
const syncEmailInput = document.getElementById("syncEmail");
const saveSyncConfigButton = document.getElementById("saveSyncConfigButton");
const sendMagicLinkButton = document.getElementById("sendMagicLinkButton");
const pullCloudButton = document.getElementById("pullCloudButton");
const syncNowButton = document.getElementById("syncNowButton");
const signOutButton = document.getElementById("signOutButton");
const syncStatus = document.getElementById("syncStatus");
const editSplitButton = document.getElementById("editSplitButton");
const splitEditor = document.getElementById("splitEditor");
const splitDayName = document.getElementById("splitDayName");
const splitDayFocus = document.getElementById("splitDayFocus");
const splitDayNotes = document.getElementById("splitDayNotes");
const splitExerciseEditor = document.getElementById("splitExerciseEditor");
const addExerciseButton = document.getElementById("addExerciseButton");
const cancelSplitButton = document.getElementById("cancelSplitButton");
const splitExerciseTemplate = document.getElementById("splitExerciseTemplate");
const routeLinks = [...document.querySelectorAll(".route-link")];
const routeSections = [...document.querySelectorAll("[data-route-section]")];

await initialize();

async function initialize() {
  const today = getDateString(new Date());
  weightDate.value = state.currentWeightDate || today;
  sessionDate.value = state.currentSessionDate || today;
  state.activeDayId = state.activeDayId || inferDayFromDate(sessionDate.value);
  state.ui = state.ui || {};
  state.ui.route = getRouteFromHash();
  state.meta = state.meta || { lastModifiedAt: null, lastSyncedAt: null };
  state.plan = state.plan || { days: cloneDefaultSplitDays() };
  state.sync = state.sync || {
    projectUrl: "",
    anonKey: "",
    email: "",
    user: null,
    lastRemoteUpdatedAt: null,
    lastSyncMessage: "Local-only mode",
  };

  populateSyncInputs();
  applyRoute();
  renderTabs();
  renderWorkout();
  renderWeights();
  renderDashboard();
  renderSplitEditor();
  renderSyncStatus();
  bindEvents();
  await initializeSupabase();

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
    markLocalChange();
    renderWeights();
    renderDashboard();
    weightValue.value = "";
  });

  sessionDate.addEventListener("change", () => {
    state.currentSessionDate = sessionDate.value;
    state.activeDayId = inferDayFromDate(sessionDate.value);
    saveState();
    renderTabs();
    renderSplitEditor();
    renderWorkout();
  });

  exportButton.addEventListener("click", async () => {
    const payload = JSON.stringify(buildBackupPayload(), null, 2);
    try {
      await navigator.clipboard.writeText(payload);
      flashButton(exportButton, "Copied");
    } catch {
      flashButton(exportButton, "Copy failed");
    }
  });

  downloadButton.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(buildBackupPayload(), null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `iron-ledger-backup-${getDateString(new Date())}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  });

  importButton.addEventListener("click", async () => {
    try {
      const imported = JSON.parse(importInput.value);
      replaceTrackerState(imported);
      await initializeSupabase();
      importInput.value = "";
      flashButton(importButton, "Imported");
    } catch {
      flashButton(importButton, "Import failed");
    }
  });

  syncForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    state.sync.projectUrl = supabaseUrlInput.value.trim();
    state.sync.anonKey = supabaseAnonKeyInput.value.trim();
    state.sync.email = syncEmailInput.value.trim();
    state.sync.user = null;
    state.sync.lastSyncMessage = "Supabase config saved locally";
    saveState();
    await initializeSupabase();
    renderSyncStatus();
    flashButton(saveSyncConfigButton, "Saved");
  });

  sendMagicLinkButton.addEventListener("click", async () => {
    if (!supabase) {
      state.sync.lastSyncMessage = "Save your Supabase URL and anon key first";
      renderSyncStatus();
      return;
    }
    const email = syncEmailInput.value.trim();
    if (!email) {
      state.sync.lastSyncMessage = "Enter your email before requesting a magic link";
      renderSyncStatus();
      return;
    }

    setSyncStatus("Sending magic link...");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.href,
      },
    });

    if (error) {
      setSyncStatus(`Magic link failed: ${error.message}`);
      return;
    }

    state.sync.email = email;
    saveState();
    setSyncStatus("Magic link sent. Open it on this phone to finish sign-in.");
  });

  pullCloudButton.addEventListener("click", async () => {
    await pullRemoteSnapshot({ preferRemote: true, userInitiated: true });
  });

  syncNowButton.addEventListener("click", async () => {
    await pushRemoteSnapshot({ userInitiated: true });
  });

  signOutButton.addEventListener("click", async () => {
    if (!supabase) {
      return;
    }
    await supabase.auth.signOut();
    state.sync.user = null;
    state.sync.lastSyncMessage = "Signed out. Local data is still on this device.";
    saveState();
    renderSyncStatus();
  });

  window.addEventListener("online", () => {
    setSyncStatus("Back online");
    queueSync("Came back online");
  });

  window.addEventListener("hashchange", () => {
    state.ui.route = getRouteFromHash();
    saveState();
    applyRoute();
  });

  editSplitButton.addEventListener("click", () => {
    state.ui.editingSplit = !state.ui.editingSplit;
    saveState();
    renderSplitEditor();
  });

  addExerciseButton.addEventListener("click", () => {
    appendSplitExerciseRow({
      id: `custom-${Date.now()}`,
      name: "",
      target: "",
    });
  });

  cancelSplitButton.addEventListener("click", () => {
    state.ui.editingSplit = false;
    saveState();
    renderSplitEditor();
  });

  splitEditor.addEventListener("submit", (event) => {
    event.preventDefault();
    saveCurrentDaySplit();
  });
}

async function initializeSupabase() {
  const { projectUrl, anonKey } = state.sync;
  if (!projectUrl || !anonKey) {
    supabase = null;
    renderSyncStatus();
    return;
  }

  const { createClient } = await loadSupabaseModule();
  supabase = createClient(projectUrl, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  state.sync.user = session?.user
    ? { id: session.user.id, email: session.user.email || state.sync.email }
    : null;
  if (session?.user?.email) {
    state.sync.email = session.user.email;
  }
  saveState();
  renderSyncStatus();

  supabase.auth.onAuthStateChange(async (event, sessionState) => {
    state.sync.user = sessionState?.user
      ? { id: sessionState.user.id, email: sessionState.user.email || state.sync.email }
      : null;
    if (sessionState?.user?.email) {
      state.sync.email = sessionState.user.email;
    }
    saveState();
    renderSyncStatus();

    if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
      await pullRemoteSnapshot({ preferRemote: false, userInitiated: false });
    }
  });

  if (state.sync.user) {
    await pullRemoteSnapshot({ preferRemote: false, userInitiated: false });
  }
}

function renderTabs() {
  dayTabs.innerHTML = "";
  getSplitDays().forEach((day) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `tab-button${day.id === state.activeDayId ? " active" : ""}`;
    button.textContent = `${day.label} ${day.name}`;
    button.addEventListener("click", () => {
      state.activeDayId = day.id;
      state.ui.editingSet = null;
      saveState();
      renderTabs();
      renderSplitEditor();
      renderWorkout();
    });
    dayTabs.appendChild(button);
  });
}

function renderWorkout() {
  const days = getSplitDays();
  const day = days.find((item) => item.id === state.activeDayId) || days[0];
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
        state.ui.editingSet = { date, dayId: day.id, exerciseId: exercise.id, setIndex: index };
        saveState();
        renderWorkout();
      },
      onDelete: (index) => {
        const liveSession = getSession(date, day.id);
        liveSession.exercises[exercise.id].splice(index, 1);
        clearEditingIfTarget(date, day.id, exercise.id, index);
        markLocalChange();
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

      markLocalChange();
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
      liveEntries.push({ weight: Number(last.weight), reps: Number(last.reps) });
      state.ui.editingSet = null;
      markLocalChange();
      renderWorkout();
      renderDashboard();
    });

    undoButton.addEventListener("click", () => {
      const liveSession = getSession(date, day.id);
      const liveEntries = liveSession.exercises[exercise.id] || [];
      liveEntries.pop();
      state.ui.editingSet = null;
      markLocalChange();
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

function renderSplitEditor() {
  const day = getCurrentDay();
  const isVisible = Boolean(state.ui.editingSplit);
  splitEditor.hidden = !isVisible;
  if (!day || !isVisible) {
    return;
  }

  splitDayName.value = day.name || "";
  splitDayFocus.value = day.focus || "";
  splitDayNotes.value = day.notes || "";
  splitExerciseEditor.innerHTML = "";
  day.exercises.forEach((exercise) => appendSplitExerciseRow(exercise));
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

  const syncMode = state.sync?.user
    ? `Cloud sync enabled for ${state.sync.user.email || "your account"}`
    : state.sync?.projectUrl
      ? "Supabase configured. Finish email sign-in to enable cloud sync."
      : "Local-only mode. Use backup export if you want a manual copy.";
  storageStatus.textContent = `${syncMode} Local changes save instantly on this phone; cloud sync runs automatically a moment later when you are signed in and online.`;
  renderSyncHealthCard();

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
      value: avg && previousAvg ? `${formatSigned(avg - previousAvg)} kg` : "-",
      subtext: "Current 7-day avg vs previous 7-day block",
    },
    {
      title: "Logged Sessions",
      value: String(totalSessions),
      subtext: `${totalSets} working sets captured`,
    },
  ];
  statCards.forEach((card) => dashboardGrid.appendChild(createInsightCard(card)));

  dashboardExercises.forEach((exerciseId) => {
    const insight = buildExerciseInsight(exerciseId);
    const liveExercise = findExerciseById(exerciseId);
    dashboardGrid.appendChild(
      createInsightCard({
        title: liveExercise?.name || prettifyExerciseId(exerciseId),
        value: insight.current,
        subtext: insight.subtext,
        sparkValues: insight.sparkValues,
      }),
    );
  });
}

function renderSyncHealthCard() {
  const health = getSyncHealth();
  syncHealthCard.innerHTML = `
    <div class="sync-health-top">
      <div>
        <p class="eyebrow">Sync Health</p>
        <h3 class="sync-health-title">${health.title}</h3>
      </div>
      <span class="sync-health-status">${health.badge}</span>
    </div>
    <p class="sync-health-copy">${health.message}</p>
    <div class="sync-health-grid">
      <div class="sync-health-metric">
        <p class="sync-health-label">Last Local Save</p>
        <p class="sync-health-value">${health.lastLocalSave}</p>
      </div>
      <div class="sync-health-metric">
        <p class="sync-health-label">Last Cloud Sync</p>
        <p class="sync-health-value">${health.lastCloudSync}</p>
      </div>
      <div class="sync-health-metric">
        <p class="sync-health-label">Remote Snapshot</p>
        <p class="sync-health-value">${health.remoteSnapshot}</p>
      </div>
    </div>
  `;
}

function renderSyncStatus() {
  populateSyncInputs();
  const configured = Boolean(state.sync.projectUrl && state.sync.anonKey);
  const signedIn = Boolean(state.sync.user);

  sendMagicLinkButton.disabled = !configured;
  pullCloudButton.disabled = !configured || !signedIn;
  syncNowButton.disabled = !configured || !signedIn;
  signOutButton.disabled = !configured || !signedIn;

  const bits = [];
  bits.push(configured ? "Supabase configured." : "Supabase not configured.");
  bits.push(
    signedIn
      ? `Signed in as ${state.sync.user.email || state.sync.user.id}.`
      : "Not signed in.",
  );
  if (state.sync.lastRemoteUpdatedAt) {
    bits.push(`Last cloud snapshot ${formatDateTime(state.sync.lastRemoteUpdatedAt)}.`);
  }
  if (state.sync.lastSyncMessage) {
    bits.push(state.sync.lastSyncMessage);
  }
  syncStatus.textContent = bits.join(" ");
}

function populateSyncInputs() {
  supabaseUrlInput.value = state.sync?.projectUrl || "";
  supabaseAnonKeyInput.value = state.sync?.anonKey || "";
  syncEmailInput.value = state.sync?.email || "";
}

function renderWeightChart(values) {
  if (values.length < 2) {
    weightChart.innerHTML = "<div class=\"chart-empty\">Need at least 2 weigh-ins to draw a trend.</div>";
    return;
  }
  weightChart.innerHTML = renderSparkline(values, 720, 160);
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
      <polyline fill="none" stroke="#226b53" stroke-width="4" points="${points}"></polyline>
      <polyline fill="rgba(34,107,83,0.08)" stroke="none" points="${points} ${width - padding},${height - padding} ${padding},${height - padding}"></polyline>
    </svg>
  `;
}

function buildExerciseInsight(exerciseId) {
  const entries = getExerciseHistory(exerciseId);
  if (!entries.length) {
    return { current: "-", subtext: "No logged sets yet", sparkValues: [] };
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

function appendSplitExerciseRow(exercise) {
  const node = splitExerciseTemplate.content.cloneNode(true);
  const row = node.querySelector(".split-exercise-row");
  row.dataset.exerciseId = exercise.id;
  node.querySelector(".split-exercise-name").value = exercise.name || "";
  node.querySelector(".split-exercise-target").value = exercise.target || "";
  node.querySelector(".split-remove-exercise").addEventListener("click", () => {
    row.remove();
  });
  splitExerciseEditor.appendChild(row);
}

function saveCurrentDaySplit() {
  const day = getCurrentDay();
  if (!day) {
    return;
  }

  day.name = splitDayName.value.trim() || day.name;
  day.focus = splitDayFocus.value.trim();
  day.notes = splitDayNotes.value.trim();
  day.exercises = [...splitExerciseEditor.querySelectorAll(".split-exercise-row")]
    .map((row, index) => {
      const name = row.querySelector(".split-exercise-name").value.trim();
      const target = row.querySelector(".split-exercise-target").value.trim();
      if (!name) {
        return null;
      }
      return {
        id: row.dataset.exerciseId || `custom-${Date.now()}-${index}`,
        name,
        target: target || "3 x 8-12",
      };
    })
    .filter(Boolean);

  state.ui.editingSplit = false;
  markLocalChange();
  renderTabs();
  renderSplitEditor();
  renderWorkout();
  renderDashboard();
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

function getSplitDays() {
  return state.plan.days;
}

function getCurrentDay() {
  const days = getSplitDays();
  return days.find((item) => item.id === state.activeDayId) || days[0];
}

function findExerciseById(exerciseId) {
  return (
    getSplitDays()
      .flatMap((day) => day.exercises)
      .find((exercise) => exercise.id === exerciseId) || null
  );
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
  } else if (editing.setIndex > removedIndex) {
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
  return latestSeven.reduce((sum, entry) => sum + entry.value, 0) / latestSeven.length;
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

function buildBackupPayload() {
  return {
    ...buildTrackerSnapshot(),
    sync: {
      projectUrl: state.sync.projectUrl,
      anonKey: state.sync.anonKey,
      email: state.sync.email,
    },
  };
}

function getSyncHealth() {
  const localStamp = state.meta?.lastModifiedAt;
  const cloudStamp = state.meta?.lastSyncedAt;
  const remoteStamp = state.sync?.lastRemoteUpdatedAt;
  const configured = Boolean(state.sync?.projectUrl && state.sync?.anonKey);
  const signedIn = Boolean(state.sync?.user);
  const online = navigator.onLine;

  if (!configured) {
    return {
      title: "Local-only mode",
      badge: "local",
      message:
        "This phone saves instantly, but nothing is copied to the cloud until you configure Supabase sync.",
      lastLocalSave: formatSyncTime(localStamp),
      lastCloudSync: "Not set",
      remoteSnapshot: "Not set",
    };
  }

  if (!signedIn) {
    return {
      title: "Sync configured, sign-in pending",
      badge: "pending",
      message:
        "Project settings are saved locally. Finish the magic-link sign-in on this phone to enable automatic cloud sync.",
      lastLocalSave: formatSyncTime(localStamp),
      lastCloudSync: formatSyncTime(cloudStamp),
      remoteSnapshot: formatSyncTime(remoteStamp),
    };
  }

  if (!online) {
    return {
      title: "Offline, waiting to sync",
      badge: "offline",
      message:
        "Your changes are safe on this phone. Cloud sync will resume automatically when the device is back online.",
      lastLocalSave: formatSyncTime(localStamp),
      lastCloudSync: formatSyncTime(cloudStamp),
      remoteSnapshot: formatSyncTime(remoteStamp),
    };
  }

  if (localStamp && remoteStamp && localStamp > remoteStamp) {
    return {
      title: "This phone is ahead of the cloud",
      badge: "ahead",
      message:
        "You have newer local changes than the latest cloud snapshot. The app should auto-sync them shortly, or you can tap Sync Now.",
      lastLocalSave: formatSyncTime(localStamp),
      lastCloudSync: formatSyncTime(cloudStamp),
      remoteSnapshot: formatSyncTime(remoteStamp),
    };
  }

  if (remoteStamp && localStamp && remoteStamp > localStamp) {
    return {
      title: "Cloud snapshot is newer",
      badge: "behind",
      message:
        "A newer snapshot exists in the cloud than on this phone. Use Pull Cloud Snapshot if this device should catch up.",
      lastLocalSave: formatSyncTime(localStamp),
      lastCloudSync: formatSyncTime(cloudStamp),
      remoteSnapshot: formatSyncTime(remoteStamp),
    };
  }

  if (cloudStamp || remoteStamp) {
    return {
      title: "This phone is in sync",
      badge: "synced",
      message:
        "Local and cloud timestamps match closely enough that this device appears up to date.",
      lastLocalSave: formatSyncTime(localStamp),
      lastCloudSync: formatSyncTime(cloudStamp),
      remoteSnapshot: formatSyncTime(remoteStamp),
    };
  }

  return {
    title: "Ready for first cloud backup",
    badge: "ready",
    message:
      "You are signed in, but no cloud snapshot has been created yet. The next sync will create one.",
    lastLocalSave: formatSyncTime(localStamp),
    lastCloudSync: "Not set",
    remoteSnapshot: "Not set",
  };
}

function buildTrackerSnapshot() {
  return {
    weights: state.weights,
    sessions: state.sessions,
    plan: state.plan,
    activeDayId: state.activeDayId,
    currentWeightDate: state.currentWeightDate,
    currentSessionDate: state.currentSessionDate,
    meta: {
      lastModifiedAt: state.meta.lastModifiedAt,
    },
  };
}

function replaceTrackerState(payload) {
  const normalized = normalizeState(payload);
  state.weights = normalized.weights;
  state.sessions = normalized.sessions;
  state.plan = normalized.plan;
  state.activeDayId = normalized.activeDayId || state.activeDayId;
  state.currentWeightDate = normalized.currentWeightDate || state.currentWeightDate;
  state.currentSessionDate = normalized.currentSessionDate || state.currentSessionDate;
  state.meta = normalized.meta || state.meta;
  if (payload.sync) {
    state.sync = {
      ...state.sync,
      projectUrl: payload.sync.projectUrl || state.sync.projectUrl,
      anonKey: payload.sync.anonKey || state.sync.anonKey,
      email: payload.sync.email || state.sync.email,
    };
  }
  state.ui = {};
  suspendNextSync = true;
  saveState();
  renderTabs();
  renderSplitEditor();
  renderWorkout();
  renderWeights();
  renderDashboard();
  renderSyncStatus();
}

function markLocalChange() {
  state.meta.lastModifiedAt = new Date().toISOString();
  saveState();
  renderSyncStatus();
  queueSync("Change queued");
}

function queueSync(message = "Sync queued") {
  if (!supabase || !state.sync.user || !navigator.onLine) {
    return;
  }
  setSyncStatus(`${message}. Uploading shortly...`);
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    pushRemoteSnapshot({ userInitiated: false });
  }, SYNC_DEBOUNCE_MS);
}

async function pushRemoteSnapshot({ userInitiated }) {
  if (!supabase || !state.sync.user) {
    setSyncStatus("Cloud sync needs Supabase config and a signed-in account.");
    return;
  }
  if (suspendNextSync) {
    suspendNextSync = false;
    return;
  }
  if (syncInFlight) {
    return syncInFlight;
  }
  if (!navigator.onLine) {
    setSyncStatus("Offline. Local data saved; cloud sync will resume when you are back online.");
    return;
  }

  setSyncStatus(userInitiated ? "Syncing to cloud..." : "Auto-syncing...");
  const payload = buildTrackerSnapshot();

  syncInFlight = supabase
    .from(SNAPSHOT_TABLE)
    .upsert(
      {
        user_id: state.sync.user.id,
        state_json: payload,
      },
      { onConflict: "user_id" },
    )
    .select("updated_at")
    .single();

  const { data, error } = await syncInFlight;
  syncInFlight = null;

  if (error) {
    setSyncStatus(`Cloud sync failed: ${error.message}`);
    return;
  }

  state.sync.lastRemoteUpdatedAt = data.updated_at;
  state.meta.lastSyncedAt = data.updated_at;
  state.sync.lastSyncMessage = userInitiated ? "Cloud sync complete" : "Auto-sync complete";
  saveState();
  renderDashboard();
  renderSyncStatus();
}

async function pullRemoteSnapshot({ preferRemote, userInitiated }) {
  if (!supabase || !state.sync.user) {
    if (userInitiated) {
      setSyncStatus("Sign in first before pulling cloud data.");
    }
    return;
  }
  if (!navigator.onLine) {
    setSyncStatus("Offline. Cannot pull cloud data right now.");
    return;
  }

  setSyncStatus(userInitiated ? "Pulling cloud snapshot..." : "Checking cloud snapshot...");
  const { data, error } = await supabase
    .from(SNAPSHOT_TABLE)
    .select("state_json, updated_at")
    .eq("user_id", state.sync.user.id)
    .maybeSingle();

  if (error) {
    setSyncStatus(`Cloud pull failed: ${error.message}`);
    return;
  }

  if (!data) {
    setSyncStatus("No cloud snapshot yet. Your next sync will create one.");
    return;
  }

  state.sync.lastRemoteUpdatedAt = data.updated_at;
  const remoteState = normalizeState(data.state_json);
  const localStamp = state.meta.lastModifiedAt || "";
  const remoteStamp = remoteState.meta?.lastModifiedAt || data.updated_at || "";

  if (preferRemote || remoteStamp > localStamp) {
    suspendNextSync = true;
    state.weights = remoteState.weights;
    state.sessions = remoteState.sessions;
    state.plan = remoteState.plan;
    state.activeDayId = remoteState.activeDayId || state.activeDayId;
    state.currentWeightDate = remoteState.currentWeightDate || state.currentWeightDate;
    state.currentSessionDate = remoteState.currentSessionDate || state.currentSessionDate;
    state.meta = {
      ...state.meta,
      ...remoteState.meta,
      lastSyncedAt: data.updated_at,
    };
    state.sync.lastSyncMessage = userInitiated
      ? "Cloud snapshot pulled onto this device"
      : "Loaded fresher cloud data";
    saveState();
    weightDate.value = state.currentWeightDate || weightDate.value;
    sessionDate.value = state.currentSessionDate || sessionDate.value;
    renderTabs();
    renderSplitEditor();
    renderWorkout();
    renderWeights();
    renderDashboard();
    renderSyncStatus();
    return;
  }

  state.sync.lastSyncMessage = "Local data is newer than the cloud snapshot";
  saveState();
  renderSyncStatus();
  if (!userInitiated) {
    queueSync("Local data is newer");
  }
}

function setSyncStatus(message) {
  state.sync.lastSyncMessage = message;
  saveState();
  renderDashboard();
  renderSyncStatus();
}

function applyRoute() {
  const route = state.ui.route || "all";
  routeLinks.forEach((link) => {
    link.classList.toggle("active", normalizeRoute(link.getAttribute("href").slice(1)) === route);
  });
  routeSections.forEach((section) => {
    const sectionRoute = section.dataset.routeSection;
    const isVisible = route === "all" || route === sectionRoute;
    section.setAttribute("hidden-route", isVisible ? "false" : "true");
  });
}

function getRouteFromHash() {
  return normalizeRoute(window.location.hash.replace("#", ""));
}

function normalizeRoute(route) {
  return ["all", "dashboard", "workout", "sync"].includes(route) ? route : "all";
}

function flashButton(button, label) {
  const original = button.textContent;
  button.textContent = label;
  setTimeout(() => {
    button.textContent = original;
  }, 1400);
}

function formatSigned(value) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}`;
}

function prettifyExerciseId(exerciseId) {
  return exerciseId
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function inferDayFromDate(dateString) {
  const date = new Date(dateString);
  const weekday = date.getDay();
  return [null, "mon", "tue", "wed", "thu", "fri", "sat"][weekday] || "mon";
}

function shortDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(date);
}

function formatDateTime(dateString) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
}

function formatSyncTime(dateString) {
  if (!dateString) {
    return "Not set";
  }
  return formatDateTime(dateString);
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
    plan: normalizePlan(raw.plan),
    activeDayId: raw.activeDayId || "mon",
    currentWeightDate: raw.currentWeightDate || getDateString(new Date()),
    currentSessionDate: raw.currentSessionDate || getDateString(new Date()),
    meta: {
      lastModifiedAt: raw.meta?.lastModifiedAt || null,
      lastSyncedAt: raw.meta?.lastSyncedAt || null,
    },
    ui: raw.ui || {},
    sync: raw.sync || {
      projectUrl: "",
      anonKey: "",
      email: "",
      user: null,
      lastRemoteUpdatedAt: null,
      lastSyncMessage: "Local-only mode",
    },
  };
}

function normalizePlan(plan) {
  const defaultDays = cloneDefaultSplitDays();
  if (!plan?.days?.length) {
    return { days: defaultDays };
  }

  return {
    days: defaultDays.map((defaultDay) => {
      const existingDay = plan.days.find((item) => item.id === defaultDay.id);
      if (!existingDay) {
        return defaultDay;
      }
      return {
        ...defaultDay,
        ...existingDay,
        exercises: normalizeExercises(defaultDay.exercises, existingDay.exercises),
      };
    }),
  };
}

function normalizeExercises(defaultExercises, exercises) {
  if (!Array.isArray(exercises) || !exercises.length) {
    return defaultExercises;
  }

  return exercises.map((exercise, index) => ({
    id: exercise.id || defaultExercises[index]?.id || `custom-${index}`,
    name: exercise.name || defaultExercises[index]?.name || "Exercise",
    target: exercise.target || defaultExercises[index]?.target || "3 x 8-12",
  }));
}

function cloneDefaultSplitDays() {
  return JSON.parse(JSON.stringify(DEFAULT_SPLIT_DAYS));
}

async function loadSupabaseModule() {
  if (!supabaseModule) {
    supabaseModule = import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
  }
  return supabaseModule;
}

function loadState() {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    if (current) {
      return normalizeState(JSON.parse(current));
    }

    for (const key of LEGACY_KEYS) {
      const legacy = localStorage.getItem(key);
      if (legacy) {
        const migrated = normalizeState(JSON.parse(legacy));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
    }
  } catch {
    return normalizeState({});
  }
  return normalizeState({});
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
