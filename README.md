# Anand Tiwari — Portfolio

Static portfolio site (HTML + CSS + JS, no build step). Content comes from Anand's GitHub
(<https://github.com/anand0100-dot>).

## Open it

Double-click `index.html`, or serve the folder:

```bash
python3 -m http.server 5510
```

then open <http://localhost:5510>.

## Change any text → `data.js`

Everything on the page (name, quick facts, skills, projects, learning log, timeline,
achievements, links) lives in **`data.js`**. Edit it and refresh; you don't need to touch
`index.html` or `script.js`.

Please check these before publishing — they were inferred from GitHub, not confirmed:

- `facts` → batch "2025 – 2027" and "Based in: India" (MCA — Cloud Computing is confirmed)
- `timeline` → the dates on the MCA entry
- `email`, `linkedin`, `resume` → empty for now (buttons appear automatically once filled)
- `learning` → swap in real certifications whenever you have them

## Add the 3D talking character (like the reference video)

Right now the hero shows Anand's real photo with the background removed
(`assets/anand-cutout.webp`, set by `heroImage` in `data.js`; set it to `""` to go back to the
illustrated character). It is 1600px: the 800px original was upscaled with Apple's on-device
super-resolution, lightly sharpened and cut out, so it stays crisp on Retina screens.
To use a 3D talking-character video instead:

1. **Make a 3D character image** — give an image model (e.g. ChatGPT / Gemini image
   generation) a clear full-body photo and ask for: *"A premium 3D animated character of this
   person, Pixar-style, same face, hairstyle and outfit, standing straight, full body visible
   head to shoes, front view, plain off-white background (#F2F0E9), soft studio lighting."*
2. **Animate it** — upload that image to a video model (e.g. Veo, Kling, Runway) and ask for:
   *"The character smiles, waves at the camera and gestures naturally while talking, as if
   introducing themselves. Camera completely still, same plain background, 8–10 seconds,
   seamless loop."*
3. **Drop it in** — save the result as **`assets/hero.mp4`**. The site picks it up
   automatically (the plain background blends into the page) and the ⏸ button controls it.

Anand's original photo is `assets/anand.webp` (kept untouched) — give that one to the image
model in step 1. The ID card uses a sharpened copy, `assets/anand-photo.webp` (`photo` in
`data.js`). To swap the photo, replace the files or change `photo` / `heroImage`. Put a CV at `assets/resume.pdf` and set `resume: "assets/resume.pdf"` to enable the
Resume buttons.

## Publish on GitHub Pages

1. Create a new repository (e.g. `portfolio`) and push this folder to it.
2. Repository → **Settings → Pages** → Source: *Deploy from a branch* → `main` / root.
3. The site goes live at `https://anand0100-dot.github.io/portfolio/`.

## Files

| File | What it does |
| --- | --- |
| `index.html` | Page structure + the illustrated character (SVG) |
| `style.css` | Design: ivory/navy theme, layout, animations, mobile styles |
| `data.js` | **All content** |
| `script.js` | Rendering + interactions (swinging ID card, periodic table, project panels, timeline, pinned achievements, contact form) |
| `assets/` | `anand.webp` (original photo), `anand-photo.webp` (ID card), `anand-cutout.webp` (hero, 1600px, transparent) + optional `hero.mp4`, `resume.pdf` |

The ID card spins once when it scrolls into view and flips on click/tap (Enter/Space with the
keyboard) to show a back side with a QR code to the GitHub profile (QR drawn with
`qrcode-generator` from jsDelivr).

**Light / dark mode:** the site follows the visitor's system setting until they press the
sun/moon button in the top bar; that choice is remembered in their browser. Light colours are the
tokens at the top of `style.css`, dark ones are in the "Dark theme" block at the end. The dark
theme is a "cloud console at night": deep sky-navy, slowly drifting sky glows, a faint blueprint
grid, cyan actions, pipeline-green status (the live dot after the title, the `$` prompt) and a
sky-to-navy skills table. The ID card and the project mock-ups keep their light look in both
themes.

The contact form posts to the Formspree endpoint from Anand's earlier portfolio
(`formEndpoint` in `data.js`).
