# Website for H&S Nahebau GmbH

This website is created with the awesome [11ty](https://11ty.dev) and based on a starter project called [11ta](https://github.com/11ta/11ta-template) by [Shane Robinson](https://github.com/shanerobinson) for which I am really greatful, because it is always a lot easier to start a new project based on a working site, rather than an empty directory. The website is deployed to Netlify, which is just as awesome and makes developing and deploying websites a breeze.

I have created this website for a small company that is owned by my brother as a birthday gift, and you can regard it as a hobby project. Feel free to use it according to the MIT license.

## Logo Design

The H&S Nahebau logo was designed with professional logo principles in mind: simplicity, scalability, and versatility. It consists of an abstract **N letterform** with an overlapping **roofline accent** in warm sand, evoking construction without being literal.

### Design decisions

- **Mark**: A geometric N (`<path>`) with a diagonal crossbar. A sand-colored stroke (`#D4A76A`) crosses the top of the N as a roofline, overlapping into the letterform rather than floating above it.
- **Font**: [Manrope Bold (700)](https://fonts.google.com/specimen/Manrope) — a geometric, warm sans-serif from Google Fonts. Chosen for its solidity and trustworthiness.
- **Text is outlined**: The wordmark uses `<path>` elements, not `<text>`, so it renders identically on every platform without requiring the font to be installed.
- **Colors**: Dark green `#1B4332` ("Nahebau" + "H&S"), primary green `#2D6A4F` (N mark), warm sand `#D4A76A` (roofline), darker sand `#B08D55` ("GmbH" for contrast).
- **Favicon**: Same N+roofline mark, white on a green rounded-square background.

### Files

| File | Purpose | Dimensions |
|---|---|---|
| `src/assets/svg/logo.svg` | Desktop logo (mark + stacked wordmark) | viewBox −3 −3 166×58 |
| `src/assets/svg/logo-mobile.svg` | Mobile logo (mark only) | viewBox 46×48 |
| `src/assets/svg/favicon.svg` | Favicon source (white on green) | viewBox 48×48 |

### How the outlined text was generated

The wordmark paths were created by rendering [Manrope Bold](https://fonts.google.com/specimen/Manrope) text with [opentype.js](https://opentype.js.org/) in a browser, converting the glyphs to SVG path data. To reproduce or change the text:

1. Open a browser page with opentype.js loaded:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/opentype.js@1.3.4/dist/opentype.min.js"></script>
   ```
2. Load the static Manrope Bold TTF and convert text to paths:
   ```js
     opentype.load(
      'https://cdn.jsdelivr.net/fontsource/fonts/manrope@latest/latin-700-normal.ttf',
      (err, font) => {
        // Generate each text element separately with its own baseline
        const nahebau = font.getPath('Nahebau', 0, 22, 26); // baseline at y=22
        const hs = font.getPath('H&S', 0, 39, 17);          // baseline at y=39, smaller
        console.log(nahebau.toPathData());
        console.log(hs.toPathData());
      }
    );
   ```
3. For "GmbH" with letter-spacing, render each glyph individually and add spacing between advances:
   ```js
    const glyphs = font.stringToGlyphs('GmbH');
    const scale = 11 / font.unitsPerEm;
    let x = 0;
    for (const glyph of glyphs) {
      const p = glyph.getPath(x, 39, 11); // same baseline as H&S
      console.log(p.toPathData());
      x += glyph.advanceWidth * scale + 1.5; // 1.5 = letter-spacing
    }
   ```
4. Paste the resulting path data into the SVG, replacing the existing `<path>` elements in the wordmark group.
5. Position "GmbH" centered under "bau" using a `transform="translate(x,0)"` on the GmbH `<path>`. Calculate x as: start-of-b + (width-of-bau − width-of-GmbH) / 2.

### Layout notes

- **Canvas padding**: The viewBox uses `−3 −3 166 58` to give ~3.5px of breathing room on all sides. The roofline stroke uses `stroke-linecap="round"` with `stroke-width="3"`, so round caps extend 1.5 units beyond the path endpoints; the negative origin prevents clipping.
- **Mark-to-wordmark gap**: The wordmark group starts at `translate(47,0)`, leaving a ~5.3px visual gap from the roofline tip to the first letter — confident but not loose.
- **Two-line lockup**: "Nahebau" at baseline y=22 (fontSize 26), "H&S" at baseline y=39 (fontSize 17, dark green), "GmbH" inline immediately after H&S at the same baseline (fontSize 11, sand `#C49A60`). GmbH uses 1.5px letter-spacing and starts at `translate(37,0)` — ~2px after the S in H&S — so the legal suffix is legible but reads as part of the same line.
- **H&S left alignment**: The H&S path has `transform="translate(0.63,0)"` to align its left edge flush with "Nahebau".

### Adapting the logo

- **Change company name**: Re-run the opentype.js conversion above with the new text, adjust the viewBox width to fit.
- **Change font**: Load a different TTF in step 2.
- **Change colors**: Edit the `fill` attributes on the `<path>` elements and update `tailwind.config.js` to match.
- **Change the mark**: Edit the N `<path d="...">` geometry and roofline stroke in the `<g>` group.
