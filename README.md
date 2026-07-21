# GSL Encryption

A single page cipher toy where **the song is the key**. Type a message (or drop
any file), pick a MIDI song, and watch the bytes get XORed against a keystream
derived from that song's notes. The result plays out on a 64 cell grid with a
true binary dump underneath, then collapses into a shareable QR code.

Live at **[gas-lighting.com/GS](https://gas-lighting.com/GS/)**.

## How it works

- **The keystream.** A MIDI file is a constant, so its parsed note sequence is a
  constant too. Every note contributes three bytes (its number, velocity, and
  ticks) into a deterministic keystream.
- **The chop.** Your input bytes are XORed against that keystream, cycling
  circularly when the lengths differ. XOR twice with the same song and you get
  the original back, bit for bit. It is lossless.
- **The seal.** An AES-256-GCM layer (Web Crypto, PBKDF2) wraps the payload so a
  `.slayy` file or a share link can be decompiled with integrity, and the
  decompiler re-derives the keystream from the song to prove the bits check out.
  The passphrase lives in the page source. This is art, not security.
- **The dump.** The binary shown below the grid is not decorative. It is the real
  XOR output, revealed in order and driven by the Tone.js transport clock as the
  song plays.

## Features

- Message, file, image, or code input. Bytes are bytes.
- 64 cell gate grid: tap to flip, drag to paint, hold to clear.
- Real time binary dump driven by the transport, with a reshape control that
  re-renders the same local data as a Perlin bloom field.
- Syzygy QR sharing. A finished dump becomes an art QR (tap for the scannable
  black on white form, hold to save a PNG). Scanning a share link replays the
  decryption: the QR breaks down through the binary and the 64 cells spell the
  message out.
- `.slayy` download and decompile with a keystream cross check.
- A "how it works" slide over that includes a URL to QR tool and a zero width
  method (see below).
- Works with touch, pen, and mouse. iOS safe, no zoom on focus, reduced motion
  honored.

## Zero width messaging

The app can hide a share link inside invisible Unicode characters so it rides
along in ordinary text. The deeper tool and write up live in a separate repo:
**[steganographr](https://github.com/musha1140/steganographr)**.

## Built with

Credit and thanks to the packages this runs on, all loaded from
[jsDelivr](https://www.jsdelivr.com/) and pinned:

| Package | Version | Use |
| --- | --- | --- |
| [tone](https://www.npmjs.com/package/tone) | 15.1.22 | audio synthesis and the transport clock that drives the dump |
| [@tonejs/midi](https://www.npmjs.com/package/@tonejs/midi) | 2.0.28 | parsing MIDI files into notes for the keystream |
| [@tailwindcss/browser](https://www.npmjs.com/package/@tailwindcss/browser) | 4.3.3 | Tailwind 4 styling at runtime |
| [qrcode-generator](https://www.npmjs.com/package/qrcode-generator) | 1.4.4 | QR encoding with Reed Solomon error correction |

Only Tailwind loads eagerly. Tone, the MIDI parser, and the QR library are lazy
loaded on first use, so the initial page is light.

## Running locally

It is a static page. Serve the folder any way you like, for example:

```
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Layout

- `index.html` is the whole app: markup, styles, and one module script.
- The 11 built in songs are hosted on the project CDN and fetched on demand.

## License and credit

Concept extends [Slayybit Image Embed](https://slayy1.vercel.app). "Slayy" nods
to 'Ghidra's Sleigh'. Everything else is by Gas-Lighting.

© 2024 to 2026 Gas-Lighting · [gas-lighting.com](https://gas-lighting.com)
