// Entry for the 23 November 2026 news image.
// The finished picture is already in this repository as entry.png. This
// program simply copies those bytes into the output directory, where the
// grader collects them as /output/entry.png.
//
// It makes no network requests, reads no clock and touches nothing outside
// this repository, so two runs write exactly the same bytes.
//
// To try it on your own machine, run:
//   mkdir -p out
//   MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const picture = readFileSync(new URL('./entry.png', import.meta.url));
if (picture.length === 0) {
  throw new Error('entry.png is empty');
}
// The entry must be a real PNG, not just non-empty bytes: check the
// 8-byte PNG signature before trusting the copy.
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!picture.subarray(0, 8).equals(pngSignature)) {
  throw new Error('entry.png is not a PNG file');
}
mkdirSync(outDir, { recursive: true });
const target = `${outDir}/entry.png`;
writeFileSync(target, picture);
const written = statSync(target).size;
if (written !== picture.length) {
  throw new Error(`entry.png copied ${written} of ${picture.length} bytes`);
}
// Re-read what was written and confirm it is the same PNG, byte for byte.
const back = readFileSync(target);
if (!back.equals(picture)) {
  throw new Error('entry.png written to output does not match the source');
}
