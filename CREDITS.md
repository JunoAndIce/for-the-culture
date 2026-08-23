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

**Cochocib Script** — used for the script line on the services panel.

- Source file: `fonts/Cochocib Script Free.otf`
- Licence: **unconfirmed.** "Free" in a script face's filename usually means
  free for personal use, not commercial. Check the foundry's terms before this
  ships. Nothing else in the build depends on it — one `localFont` call in
  `app/layout.tsx` and the `font-cochocib` class.

Geist, Geist Mono, Inter, Gelasio, and Italianno, all served through
`next/font/google`. Open source under the SIL Open Font License.
