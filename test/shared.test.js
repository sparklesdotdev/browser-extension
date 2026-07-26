import test from "node:test";
import assert from "node:assert/strict";

import {
  RANDOM_MODE,
  WALLPAPERS,
  getRandomWallpaper,
  getWallpaper
} from "../shared.js";

test("ships four named wallpaper choices", () => {
  assert.equal(WALLPAPERS.length, 4);
  assert.equal(new Set(WALLPAPERS.map(({ id }) => id)).size, WALLPAPERS.length);
  assert.ok(WALLPAPERS.every(({ src }) => src.endsWith(".webp")));
});

test("returns the matching wallpaper", () => {
  assert.equal(getWallpaper("sky-assembly").name, "Sky Assembly");
});

test("falls back safely for an unknown wallpaper", () => {
  assert.equal(getWallpaper("not-real"), WALLPAPERS[0]);
});

test("random mode excludes the current wallpaper", () => {
  for (let index = 0; index < 20; index += 1) {
    assert.notEqual(getRandomWallpaper("after-dark").id, "after-dark");
  }
  assert.equal(RANDOM_MODE, "random");
});
