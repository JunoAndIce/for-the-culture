# Credits

Third-party assets used on this site, and where they came from.

## Earth texture

**moryenn** — CGTrader

- Product page: [Wireframe Earth](https://www.cgtrader.com/free-3d-models/interior/other/wireframe-earth)
- Licence: _add the licence you acquired (CGTrader Royalty Free, Editorial, or Custom)_
- Source file: `design/8k_earth_specular_map.tif` (8192×4096, land/ocean specular map)
- Used as: `public/earth-mask.png` — downsampled to 2048×1024, converted to
  8-bit grayscale, and inverted so land is the visible side. Applied as the
  `alphaMap` on the globe, so the texture supplies the coastlines while the
  colour comes from the theme.

Conversion, for reproducibility:

```bash
ffmpeg -i design/8k_earth_specular_map.tif \
  -vf "scale=2048:1024,format=gray,negate" \
  public/earth-mask.png
```

> **Two blanks above need filling before this ships.** The licence line
> especially: CGTrader sells several, and they differ on whether commercial use
> on a client-facing site is permitted and whether attribution is required at
> all. Crediting someone does not by itself grant the right to use their work.

## Fonts

Geist, Geist Mono, Inter, Gelasio, and Italianno, all served through
`next/font/google`. Open source under the SIL Open Font License.
