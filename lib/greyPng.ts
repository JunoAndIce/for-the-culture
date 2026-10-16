// Decodes an 8-bit greyscale PNG to one byte per pixel, so a mask never expands to
// RGBA. Imports nothing, so Node's test runner loads it as it is.

export class UnsupportedPngError extends Error {
  constructor(reason: string) {
    super(`Unsupported PNG: ${reason}`);
    this.name = "UnsupportedPngError";
  }
}

type Options = {
  /** Bottom row first, the order a texture with flipY would end up in. */
  flipY?: boolean;
  /** Rows unfiltered between yields to the event loop; 0 never yields. */
  yieldEvery?: number;
};

const SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];

const nextTask = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

function paeth(a: number, b: number, c: number) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

async function inflate(zlib: Uint8Array<ArrayBuffer>) {
  const stream = new Blob([zlib]).stream().pipeThrough(new DecompressionStream("deflate"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

// Undoes one row's filter in place. `line` is the row's filter byte; bpp is 1.
function unfilter(raw: Uint8Array, line: number, width: number, stride: number, first: boolean) {
  const type = raw[line];
  const start = line + 1;
  const end = start + width;
  const up = start - stride;
  switch (type) {
    case 0:
      return;
    case 1:
      for (let i = start + 1; i < end; i++) raw[i] += raw[i - 1];
      return;
    case 2:
      if (first) return;
      for (let i = start; i < end; i++) raw[i] += raw[i - stride];
      return;
    case 3:
      raw[start] += first ? 0 : raw[up] >> 1;
      for (let i = start + 1; i < end; i++) raw[i] += (raw[i - 1] + (first ? 0 : raw[i - stride])) >> 1;
      return;
    case 4:
      raw[start] += first ? 0 : raw[up];
      for (let i = start + 1; i < end; i++) {
        raw[i] += first ? raw[i - 1] : paeth(raw[i - 1], raw[i - stride], raw[i - stride - 1]);
      }
      return;
    default:
      throw new Error(`PNG row ${line / stride} has unknown filter ${type}`);
  }
}

export async function decodeGreyPng(
  png: ArrayBuffer,
  { flipY = false, yieldEvery = 256 }: Options = {},
): Promise<{ width: number; height: number; data: Uint8Array }> {
  const bytes = new Uint8Array(png);
  const view = new DataView(png);
  if (!SIGNATURE.every((b, i) => bytes[i] === b)) throw new UnsupportedPngError("not a PNG");

  let width = 0;
  let height = 0;
  const idats: Uint8Array[] = [];
  let total = 0;
  for (let pos = 8; pos + 8 <= bytes.length; ) {
    const length = view.getUint32(pos);
    const type = String.fromCharCode(...bytes.subarray(pos + 4, pos + 8));
    const body = bytes.subarray(pos + 8, pos + 8 + length);
    if (type === "IHDR") {
      width = view.getUint32(pos + 8);
      height = view.getUint32(pos + 12);
      const [depth, colour, , , interlace] = body.subarray(8, 13);
      if (depth !== 8 || colour !== 0 || interlace !== 0) {
        throw new UnsupportedPngError(`depth ${depth}, colour type ${colour}, interlace ${interlace}`);
      }
    } else if (type === "IDAT") {
      idats.push(body);
      total += length;
    } else if (type === "IEND") {
      break;
    }
    pos += 12 + length;
  }
  if (!width || !height || !total) throw new UnsupportedPngError("no image data");

  // IDAT chunks are one zlib stream split anywhere, so they are joined before inflating.
  const zlib = new Uint8Array(total);
  let at = 0;
  for (const part of idats) {
    zlib.set(part, at);
    at += part.length;
  }
  const raw = await inflate(zlib);
  const stride = width + 1;
  if (raw.length < stride * height) throw new Error("PNG image data is truncated");

  const data = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    const line = y * stride;
    unfilter(raw, line, width, stride, y === 0);
    data.set(raw.subarray(line + 1, line + 1 + width), (flipY ? height - 1 - y : y) * width);
    if (yieldEvery > 0 && (y + 1) % yieldEvery === 0) await nextTask();
  }
  return { width, height, data };
}
