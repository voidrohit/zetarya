#!/usr/bin/env bash
# Builds the browser sender (zero2hq/zetarya, crate `browser`) to WebAssembly
# and copies the two files the upload page loads into public/engine.
#
# Needs a clang with the wasm32 backend for `ring` and `zstd`. Apple's clang
# does not have one; Homebrew's llvm does. wasm-pack fetches wasm-bindgen and
# wasm-opt itself.
set -euo pipefail

ENGINE_DIR="${ENGINE_DIR:-$(cd "$(dirname "$0")/.." && pwd)/../zero2hq/zetarya}"
LLVM="${LLVM:-$(brew --prefix llvm@15 2>/dev/null || brew --prefix llvm)}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/engine"

cd "$ENGINE_DIR"
CC="$LLVM/bin/clang" AR="$LLVM/bin/llvm-ar" \
  wasm-pack build browser --target web --release --out-dir pkg

mkdir -p "$OUT"
cp browser/pkg/zetarya_browser.js browser/pkg/zetarya_browser_bg.wasm "$OUT/"
ls -la "$OUT"
