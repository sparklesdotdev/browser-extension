#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
VERSION="$(cd "${REPO_DIR}" && node -p "JSON.parse(require('fs').readFileSync('manifest.json', 'utf8')).version")"
DIST_DIR="${REPO_DIR}/dist"
ARCHIVE="${DIST_DIR}/sparkles-wallpapers-${VERSION}.zip"

mkdir -p "${DIST_DIR}"
rm -f "${ARCHIVE}"

cd "${REPO_DIR}"
zip -r "${ARCHIVE}" \
  manifest.json \
  newtab.html \
  newtab.css \
  newtab.js \
  popup.html \
  popup.css \
  popup.js \
  shared.js \
  assets

echo "${ARCHIVE}"
