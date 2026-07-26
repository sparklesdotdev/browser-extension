export const RANDOM_MODE = "random";

export const WALLPAPERS = [
  {
    id: "paper-parade",
    name: "Paper Parade",
    note: "Bright, curious, wide open",
    src: "assets/wallpapers/paper-parade.webp",
    accent: "#F8715F"
  },
  {
    id: "after-dark",
    name: "After Dark",
    note: "Bold shapes, quieter mood",
    src: "assets/wallpapers/after-dark.webp",
    accent: "#181818"
  },
  {
    id: "sky-assembly",
    name: "Sky Assembly",
    note: "A little blue-sky thinking",
    src: "assets/wallpapers/sky-assembly.webp",
    accent: "#87A8D5"
  },
  {
    id: "garden-giggle",
    name: "Garden Giggle",
    note: "Green, grounded, growing",
    src: "assets/wallpapers/garden-giggle.webp",
    accent: "#54B16C"
  }
];

const defaults = {
  wallpaperMode: RANDOM_MODE,
  lastWallpaper: null
};

const hasChromeStorage =
  typeof globalThis.chrome !== "undefined" &&
  Boolean(globalThis.chrome.storage?.local);

export async function getSettings() {
  if (hasChromeStorage) {
    return globalThis.chrome.storage.local.get(defaults);
  }

  return {
    wallpaperMode:
      globalThis.localStorage.getItem("wallpaperMode") || defaults.wallpaperMode,
    lastWallpaper:
      globalThis.localStorage.getItem("lastWallpaper") || defaults.lastWallpaper
  };
}

export async function setSettings(values) {
  if (hasChromeStorage) {
    await globalThis.chrome.storage.local.set(values);
    return;
  }

  Object.entries(values).forEach(([key, value]) => {
    if (value === null || typeof value === "undefined") {
      globalThis.localStorage.removeItem(key);
    } else {
      globalThis.localStorage.setItem(key, String(value));
    }
  });
}

export function getWallpaper(id) {
  return WALLPAPERS.find((wallpaper) => wallpaper.id === id) || WALLPAPERS[0];
}

export function getRandomWallpaper(excludeId = null) {
  const choices = WALLPAPERS.filter((wallpaper) => wallpaper.id !== excludeId);
  const pool = choices.length ? choices : WALLPAPERS;
  const values = new Uint32Array(1);
  globalThis.crypto.getRandomValues(values);
  return pool[values[0] % pool.length];
}

export async function chooseWallpaper(mode, lastWallpaper = null) {
  if (mode !== RANDOM_MODE) {
    return getWallpaper(mode);
  }

  const wallpaper = getRandomWallpaper(lastWallpaper);
  await setSettings({ lastWallpaper: wallpaper.id });
  return wallpaper;
}

export function listenForSettings(callback) {
  if (!hasChromeStorage) {
    globalThis.addEventListener("storage", callback);
    return () => globalThis.removeEventListener("storage", callback);
  }

  const listener = (changes, areaName) => {
    if (areaName === "local" && changes.wallpaperMode) {
      callback();
    }
  };

  globalThis.chrome.storage.onChanged.addListener(listener);
  return () => globalThis.chrome.storage.onChanged.removeListener(listener);
}
