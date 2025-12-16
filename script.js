console.log("Cup Sudoku loaded");

// --------------------
// App state
// --------------------
const state = {
  player: null,
  size: null,
  mode: null,
  startTime: null,
  timerInterval: null
};

// --------------------
// Helpers
// --------------------
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// --------------------
// Timer
// --------------------
function startTimer() {
  state.startTime = Date.now();
  state.timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
    document.getElementById("timer").textContent = formatTime(elapsed);
  }, 1000);
}

function stopTimer() {
  clearInterval(state.timerInterval);
}

// --------------------
// Event bindings
// --------------------

// Player
document.querySelectorAll("[data-player]").forEach(btn => {
  btn.addEventListener("click", () => {
    state.player = btn.dataset.player;
    showScreen("screen-size");
  });
});

// Size
document.querySelectorAll("[data-size]").forEach(btn => {
  btn.addEventListener("click", () => {
    state.size = Number(btn.dataset.size);
    showScreen("screen-mode");
  });
});

// Mode
document.querySelectorAll("[data-mode]").forEach(btn => {
  btn.addEventListener("click", () => {
    state.mode = btn.dataset.mode;
    startGame();
  });
});

// Stop game
document.getElementById("stop-game").addEventListener("click", stopGame);

// --------------------
// Game flow
// --------------------
function startGame() {
  showScreen("screen-game");

  document.getElementById("game-info").textContent =
    `Player ${state.player} • ${state.size}×${state.size} • ${state.mode}`;

  document.getElementById("board").textContent =
    "Sudoku grid will appear here.";

  startTimer();
}

function stopGame() {
  stopTimer();

  const elapsed = Math.floor((Date.now() - state.startTime) / 1000);

  saveHistory({
    player: state.player,
    size: state.size,
    mode: state.mode,
    duration: elapsed,
    status: "stopped",
    timestamp: new Date().toISOString()
  });

  showScreen("screen-player");
  renderHistory();
}

// --------------------
// History (localStorage)
// --------------------
function saveHistory(entry) {
  const history = JSON.parse(localStorage.getItem("cupSudokuHistory") || "[]");
  history.unshift(entry);
  localStorage.setItem("cupSudokuHistory", JSON.stringify(history));
}

function renderHistory() {
  const list = document.getElementById("history-list");
  list.innerHTML = "";

  const history = JSON.parse(localStorage.getItem("cupSudokuHistory") || "[]");

  history.forEach(h => {
    const li = document.createElement("li");
    li.textContent =
      `${h.player} • ${h.size}×${h.size} • ${h.mode} • ${formatTime(h.duration)} • ${h.status}`;
    list.appendChild(li);
  });
}

// Initial render
renderHistory();
