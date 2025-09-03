// State & persistence ----------------------------------
const STORAGE_KEY_TASKS = "questLog_tasks";
const STORAGE_KEY_XP = "questLog_xp";
const STORAGE_KEY_LEVEL = "questLog_level";

let level = loadLevel();
function xpForLevel(lvl) {
  return 100 + (lvl - 1) * 20;
}
let MAX_XP = xpForLevel(level);

let tasks = loadTasks();
let xp = loadXP(); // current xp within current level

// Elements -------------------------------------------
const form = document.getElementById("questForm");
const questInput = document.getElementById("questInput");
const dueInput = document.getElementById("dueInput");
const dateToggle = document.getElementById("dateToggle");
const listEl = document.getElementById("questList");
const xpFill = document.getElementById("xpFill");
const xpValue = document.getElementById("xpValue");
const template = document.getElementById("questItemTemplate");
const binding = document.querySelector(".binding");

// Utility --------------------------------------------
function saveTasks() {
  localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
}
function saveXP() {
  localStorage.setItem(STORAGE_KEY_XP, xp);
}
function saveLevel() {
  localStorage.setItem(STORAGE_KEY_LEVEL, level);
}
function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS)) || [];
  } catch {
    return [];
  }
}
function loadXP() {
  const v = parseInt(localStorage.getItem(STORAGE_KEY_XP), 10);
  return isNaN(v) ? 0 : v;
}
function loadLevel() {
  const v = parseInt(localStorage.getItem(STORAGE_KEY_LEVEL), 10);
  return isNaN(v) ? 1 : v;
}
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
function formatDue(dateStr) {
  if (!dateStr) return "";
  const today = new Date();
  const d = new Date(dateStr + "T00:00:00");
  const diff = Math.floor(
    (d - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000
  );
  if (diff === 0) return "Due: Today";
  if (diff === 1) return "Due: Tomorrow";
  if (diff < 0) return "Overdue";
  return "Due: " + d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
function sortTasks() {
  tasks.sort((a, b) => {
    // favorites first
    if (a.favorite !== b.favorite) return b.favorite - a.favorite;
    // incomplete before complete
    if (a.completed !== b.completed) return a.completed - b.completed;
    // newest first
    return b.createdAt - a.createdAt;
  });
}

// XP system ------------------------------------------
function addXP(amount) {
  xp += amount;
  // level ups if overflow
  let leveled = false;
  while (xp >= MAX_XP) {
    xp -= MAX_XP;
    level++;
    MAX_XP = xpForLevel(level);
    leveled = true;
  }
  saveXP();
  saveLevel();
  updateXPUI();
  if (leveled) showLevelUp();
}
function updateXPUI() {
  const pct = Math.min(100, (xp / MAX_XP) * 100);
  xpFill.style.width = pct + "%";
  xpValue.textContent = `Lv ${level} • ${xp}/${MAX_XP} XP`;
}

// Render ---------------------------------------------
function render() {
  listEl.innerHTML = "";
  sortTasks();
  tasks.forEach((t) => listEl.appendChild(renderItem(t)));
  updateBindingHoles();
}
function renderItem(task) {
  const node = template.content.firstElementChild.cloneNode(true);
  node.dataset.id = task.id;
  if (task.completed) node.classList.add("completed");
  if (task.favorite) node.classList.add("important");
  const cb = node.querySelector(".checkbox");
  if (task.completed) cb.classList.add("checked");
  const textP = node.querySelector(".quest-text");
  textP.textContent = task.text;
  const meta = node.querySelector(".quest-meta");
  meta.textContent = formatDue(task.dueDate);
  const starBtn = node.querySelector(".star-btn");
  if (task.favorite) starBtn.classList.add("active");
  starBtn.dataset.favorite = task.favorite;
  return node;
}

// Add Task ------------------------------------------
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = questInput.value.trim();
  if (!text) return;
  const due = dueInput.value || null;
  const task = {
    id: uid(),
    text,
    dueDate: due,
    completed: false,
    favorite: false,
    xpCompleted: false,
    createdAt: Date.now(),
  };
  tasks.push(task);
  saveTasks();
  addXP(5);
  questInput.value = "";
  dueInput.value = "";
  dueInput.classList.remove("visible");
  render();
});

// Toggle date input
dateToggle.addEventListener("click", () => {
  dueInput.classList.toggle("visible");
  if (dueInput.classList.contains("visible")) dueInput.showPicker && dueInput.showPicker();
});

// List interactions ----------------------------------
listEl.addEventListener("click", (e) => {
  const li = e.target.closest(".quest-item");
  if (!li) return;
  const id = li.dataset.id;
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  if (e.target.closest(".checkbox")) {
    task.completed = !task.completed;
    if (task.completed && !task.xpCompleted) {
      task.xpCompleted = true;
      addXP(10);
      li.classList.add("flash-on");
      spawnFloatingStar(li);
      setTimeout(() => li.classList.remove("flash-on"), 900);
    }
    saveTasks();
    render();
  } else if (e.target.closest(".star-btn")) {
    task.favorite = !task.favorite;
    saveTasks();
    render();
  } else if (e.target.closest(".delete-btn")) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    render();
  }
});

// Inline edit (double click text)
listEl.addEventListener("dblclick", (e) => {
  const p = e.target.closest(".quest-text");
  if (!p) return;
  const li = p.closest(".quest-item");
  const id = li.dataset.id;
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  if (li.querySelector(".edit-input")) return;
  const input = document.createElement("input");
  input.type = "text";
  input.value = task.text;
  input.className = "edit-input";
  p.classList.add("editing");
  p.after(input);
  input.focus();
  input.select();
  const finish = (commit) => {
    if (commit) {
      const val = input.value.trim();
      if (val) {
        task.text = val;
        saveTasks();
      }
    }
    input.remove();
    p.classList.remove("editing");
    render();
  };
  input.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") finish(true);
    else if (ev.key === "Escape") finish(false);
  });
  input.addEventListener("blur", () => finish(true));
});

function spawnFloatingStar(parent) {
  const star = document.createElement("div");
  star.className = "floating-star";
  star.textContent = "★";
  parent.appendChild(star);
  setTimeout(() => star.remove(), 1100);
}

// Level up (optional simple feedback) ----------------
function showLevelUp() {
  const div = document.createElement("div");
  div.className = "level-up";
  div.textContent = "LEVEL UP!";
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 1800);
}

// Init ----------------------------------------------
updateXPUI();
render();
updateBindingHoles();

// Dynamic spiral holes (simple & readable)
function updateBindingHoles() {
  if (!binding) return;
  const h = document.querySelector(".quest-app").offsetHeight;
  const holeSize = 38;
  const count = Math.max(6, Math.floor(h / holeSize));
  const current = binding.children.length;
  if (current === count) return;
  binding.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    binding.appendChild(s);
  }
}
window.addEventListener("resize", () => updateBindingHoles());

// Accessibility
questInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    form.dispatchEvent(new Event("submit", { cancelable: true }));
  }
});
