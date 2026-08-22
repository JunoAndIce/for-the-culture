# Credits

Third-party assets used on this site, and where they came from.

## Earth texture

**moryenn** — CGTrader

- Product page: [Wireframe Earth](https://www.cgtrader.com/free-3d-models/interior/other/wireframe-earth)
- Licence: CGTrader Royalty Free
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

> **One thing royalty-free does not cover: redistributing the asset itself.**
> Marketplace licences let you *use* the work in a project; they do not let you
> hand the source file on to others. Using `earth-mask.png` in the site is
> squarely the intended use. But `design/8k_earth_specular_map.tif` is the
> original file and is committed to this repo — if the repo is ever public,
> that source is downloadable by anyone, which is closer to redistribution than
> to use. Keep the repo private, or keep the source out of it. Worth confirming
> against the licence text rather than taking this note's word for it.

## Fonts

Geist, Geist Mono, Inter, Gelasio, and Italianno, all served through
`next/font/google`. Open source under the SIL Open Font License.
