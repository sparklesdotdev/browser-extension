import {
  RANDOM_MODE,
  WALLPAPERS,
  chooseWallpaper,
  getRandomWallpaper,
  getSettings,
  listenForSettings,
  setSettings
} from "./shared.js";

const wallpaperImage = document.querySelector("#wallpaper");
const wallpaperName = document.querySelector("#wallpaper-name");
const captionDot = document.querySelector(".caption-dot");
const clock = document.querySelector("#clock");
const date = document.querySelector("#date");
const shuffleButton = document.querySelector("#shuffle");
const pickerButton = document.querySelector("#picker-toggle");
const picker = document.querySelector("#picker");
const pickerGrid = document.querySelector("#picker-grid");
const randomButton = document.querySelector("#random-mode");

let activeWallpaper = null;
let activeMode = RANDOM_MODE;
let imageLoadVersion = 0;

function updateClock() {
  const now = new Date();
  clock.textContent = new Intl.DateTimeFormat([], {
    hour: "2-digit",
    minute: "2-digit"
  }).format(now);
  clock.dateTime = now.toISOString();
  date.textContent = new Intl.DateTimeFormat([], {
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(now);
}

function updateSelectedState() {
  document.querySelectorAll(".wallpaper-option").forEach((option) => {
    option.classList.toggle("is-selected", option.dataset.id === activeMode);
  });
  randomButton.classList.toggle("is-selected", activeMode === RANDOM_MODE);
}

function showWallpaper(wallpaper) {
  const loadVersion = ++imageLoadVersion;
  const preload = new Image();

  preload.addEventListener("load", () => {
    if (loadVersion !== imageLoadVersion) return;
    wallpaperImage.classList.remove("is-ready");
    wallpaperImage.src = wallpaper.src;
    wallpaperImage.alt = `${wallpaper.name} — a Sparkles wallpaper`;
    wallpaperName.textContent = wallpaper.name;
    captionDot.style.setProperty("--accent", wallpaper.accent);
    activeWallpaper = wallpaper;
    requestAnimationFrame(() => wallpaperImage.classList.add("is-ready"));
  });

  preload.src = wallpaper.src;
}

async function syncFromStorage() {
  const settings = await getSettings();
  activeMode = settings.wallpaperMode;
  const wallpaper = await chooseWallpaper(
    settings.wallpaperMode,
    settings.lastWallpaper
  );
  showWallpaper(wallpaper);
  updateSelectedState();
}

async function setMode(mode) {
  activeMode = mode;
  await setSettings({ wallpaperMode: mode });
  const wallpaper =
    mode === RANDOM_MODE
      ? getRandomWallpaper(activeWallpaper?.id)
      : WALLPAPERS.find((item) => item.id === mode);
  if (mode === RANDOM_MODE) {
    await setSettings({ lastWallpaper: wallpaper.id });
  }
  showWallpaper(wallpaper);
  updateSelectedState();
  picker.close();
}

function buildPicker() {
  const fragment = document.createDocumentFragment();

  WALLPAPERS.forEach((wallpaper) => {
    const option = document.createElement("button");
    option.className = "wallpaper-option";
    option.type = "button";
    option.dataset.id = wallpaper.id;
    option.setAttribute("aria-label", `Use ${wallpaper.name}`);
    option.innerHTML = `
      <img src="${wallpaper.src}" alt="" />
      <span class="option-overlay">
        <strong>${wallpaper.name}</strong>
        <span class="check" aria-hidden="true"></span>
      </span>
    `;
    option.addEventListener("click", () => setMode(wallpaper.id));
    fragment.append(option);
  });

  pickerGrid.append(fragment);
}

shuffleButton.addEventListener("click", async () => {
  const wallpaper = getRandomWallpaper(activeWallpaper?.id);
  activeMode = RANDOM_MODE;
  await setSettings({
    wallpaperMode: RANDOM_MODE,
    lastWallpaper: wallpaper.id
  });
  showWallpaper(wallpaper);
  updateSelectedState();
});

pickerButton.addEventListener("click", () => picker.showModal());
randomButton.addEventListener("click", () => setMode(RANDOM_MODE));

picker.addEventListener("click", (event) => {
  if (event.target === picker) picker.close();
});

document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "r" && !picker.open) {
    shuffleButton.click();
  }
});

buildPicker();
updateClock();
setInterval(updateClock, 30_000);
syncFromStorage();
listenForSettings(syncFromStorage);
