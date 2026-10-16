import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { crc32, deflateSync } from "node:zlib";
import { decodeGreyPng, UnsupportedPngError } from "./greyPng.ts";

// A tiny PNG encoder, independent of the decoder: it applies the filters forwards.
const SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "latin1"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

function header(width, height, { depth = 8, colour = 0, interlace = 0 } = {}) {
  const data = Buffer.alloc(13);
  data.writeUInt32BE(width, 0);
  data.writeUInt32BE(height, 4);
  data[8] = depth;
  data[9] = colour;
  data[12] = interlace;
  return chunk("IHDR", data);
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

function filterRow(type, row, prev) {
  return row.map((x, i) => {
    const a = i > 0 ? row[i - 1] : 0;
    const b = prev ? prev[i] : 0;
    const c = i > 0 && prev ? prev[i - 1] : 0;
    const predicted = [0, a, b, (a + b) >> 1, paeth(a, b, c)][type];
    return (x - predicted) & 255;
  });
}

function encode(pixels, width, height, filters, { idatParts = 1, ...ihdr } = {}) {
  const raw = [];
  for (let y = 0; y < height; y++) {
    const type = filters[y % filters.length];
    const row = pixels.slice(y * width, (y + 1) * width);
    const prev = y > 0 ? pixels.slice((y - 1) * width, y * width) : null;
    raw.push(type, ...filterRow(type, row, prev));
  }
  const z = deflateSync(Buffer.from(raw));
  const size = Math.ceil(z.length / idatParts);
  const idats = [];
  for (let i = 0; i < z.length; i += size) idats.push(chunk("IDAT", z.subarray(i, i + size)));
  return Buffer.concat([SIGNATURE, header(width, height, ihdr), ...idats, chunk("IEND", Buffer.alloc(0))]);
}

const arrayBuffer = (buf) => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

// Varied values that wrap past 255, so every filter has real work to undo.
const PIXELS = Array.from({ length: 25 }, (_, i) => (i * 53 + 17) & 255);

test("decodes every filter type", async () => {
  const png = encode(PIXELS, 5, 5, [0, 1, 2, 3, 4]);
  const { width, height, data } = await decodeGreyPng(arrayBuffer(png));
  assert.equal(width, 5);
  assert.equal(height, 5);
  assert.deepEqual(Array.from(data), PIXELS);
});

test("flipY reverses rows", async () => {
  const png = encode(PIXELS, 5, 5, [0, 1, 2, 3, 4]);
  const { data } = await decodeGreyPng(arrayBuffer(png), { flipY: true });
  const rows = [0, 1, 2, 3, 4].map((y) => PIXELS.slice(y * 5, y * 5 + 5));
  assert.deepEqual(Array.from(data.subarray(0, 5)), rows[4]);
  assert.deepEqual(Array.from(data), rows.reverse().flat());
});

test("concatenates split IDAT chunks", async () => {
  const png = encode(PIXELS, 5, 5, [0, 1, 2, 3, 4], { idatParts: 3 });
  const { data } = await decodeGreyPng(arrayBuffer(png));
  assert.deepEqual(Array.from(data), PIXELS);
});

test("rejects what it cannot read", async () => {
  const rgba = encode(PIXELS, 5, 5, [0], { colour: 6 });
  const interlaced = encode(PIXELS, 5, 5, [0], { interlace: 1 });
  await assert.rejects(decodeGreyPng(arrayBuffer(rgba)), UnsupportedPngError);
  await assert.rejects(decodeGreyPng(arrayBuffer(interlaced)), UnsupportedPngError);
});

test("reads the shipped mask", async () => {
  const png = readFileSync(new URL("../public/earth-mask-4k.png", import.meta.url));
  const { width, height, data } = await decodeGreyPng(arrayBuffer(png));
  assert.equal(width, 4096);
  assert.equal(height, 2048);
  assert.equal(data.length, 8388608);
});
