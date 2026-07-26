import {
  RANDOM_MODE,
  WALLPAPERS,
  getSettings,
  setSettings
} from "./shared.js";

const wallpaperGrid = document.querySelector("#wallpaper-grid");
const randomButton = document.querySelector("#random-mode");
const openTabButton = document.querySelector("#open-tab");
const selectionLabel = document.querySelector("#selection-label");

let activeMode = RANDOM_MODE;

function updateSelectedState() {
  document.querySelectorAll(".wallpaper-card").forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.id === activeMode);
  });
  randomButton.classList.toggle("is-selected", activeMode === RANDOM_MODE);

  const selected = WALLPAPERS.find((wallpaper) => wallpaper.id === activeMode);
  selectionLabel.textContent = selected ? selected.name : "Random on";
}

async function selectMode(mode) {
  activeMode = mode;
  await setSettings({ wallpaperMode: mode });
  updateSelectedState();
}

function buildWallpaperGrid() {
  const fragment = document.createDocumentFragment();

  WALLPAPERS.forEach((wallpaper) => {
    const card = document.createElement("button");
    card.className = "wallpaper-card";
    card.type = "button";
    card.dataset.id = wallpaper.id;
    card.setAttribute("aria-label", `Use ${wallpaper.name}`);
    card.innerHTML = `
      <img src="${wallpaper.src}" alt="" />
      <span class="card-overlay">
        <strong>${wallpaper.name}</strong>
        <span class="check" aria-hidden="true"></span>
      </span>
    `;
    card.addEventListener("click", () => selectMode(wallpaper.id));
    fragment.append(card);
  });

  wallpaperGrid.append(fragment);
}

async function openFreshTab() {
  if (globalThis.chrome?.tabs) {
    await globalThis.chrome.tabs.create({});
    globalThis.close();
    return;
  }
  globalThis.open("newtab.html", "_blank", "noopener");
}

randomButton.addEventListener("click", () => selectMode(RANDOM_MODE));
openTabButton.addEventListener("click", openFreshTab);

buildWallpaperGrid();
getSettings().then((settings) => {
  activeMode = settings.wallpaperMode;
  updateSelectedState();
});
