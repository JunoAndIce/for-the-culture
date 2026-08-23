# Credits

Third-party assets used on this site, and where they came from.

## Earth texture

**moryenn** — CGTrader

- Product page: [Wireframe Earth](https://www.cgtrader.com/free-3d-models/interior/other/wireframe-earth)
- Licence: CGTrader Royalty Free
- Source file: `design/8k_earth_specular_map.tif` (8192×4096, land/ocean specular map)
- Used as: `public/earth-mask-{4k,8k}.png` (desktop loads 8k, mobile 4k).
  `design/earth-mask-2k.png` is a spare, kept in case mobile turns out heavy.

## Fonts

**Autograf** — used for the script line on the services panel.

- Source file: `fonts/Autograf_PersonalUseOnly.ttf`
- Licence: **personal use only, as the filename states.** This site is
  commercial work for an agency, which that licence does not cover. A
  commercial licence has to be bought from the foundry, or the face swapped,
  before this ships. Nothing else in the build depends on it — it is one
  `localFont` call in `app/layout.tsx` and the `font-autograf` class.

Geist, Geist Mono, Inter, Gelasio, and Italianno, all served through
`next/font/google`. Open source under the SIL Open Font License.
