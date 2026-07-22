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

Only Tailwind loads eagerly. Tone, the MIDI parser, and the QR library are lazy
loaded on first use, so the initial page is light.

## Future Ambitions

### The figures are referring to, a seperate part of this project but with as much as I can fit in these figures in terms of future relevence

![gs_fig1_qr) style="width: 50%; height: auto;"](https://kappa.lol/74KTKm.png)

---
![gs_fig1_architecture](https://kappa.lol/xees8i.png)

## Layout
- The rest of this project is private and in production
- The production has started in 2023, and is three years in the process
- The MIDI Project (Above, is just a cool toy to play with until later
- There are also versions that work with MIDI Synthisizers (AKAI MK, etc)



- `index.html` is the whole app: markup, styles, and one module script.
- The 11 built in songs are hosted on the project CDN and fetched on demand. [Reprocessed , reverbed, spliced and not in any original form of its prior state)

## License and credit

Concept extends: "Slayy" *nods* in a very standalone, a far less complex version to the NSA's:
[Ghidra's Sleigh](https://github.com/NationalSecurityAgency/ghidra) 

Mixed with a [Forked version](https://github.com/musha1140/steganographr) of [Neatnik's Stenanographr ](https://source.tube/neatnik/steganographr) 

---
[Forked version](https://github.com/musha1140/steganographr)

[Slayybit Image Embed](https://slayy1.vercel.app). 
(4 Year Old basic Least Significant Bit injection)


## Built with

Credit and thanks to the packages this runs on, all loaded from
[jsDelivr](https://www.jsdelivr.com/) and pinned:

| Package | Version | Use |
| --- | --- | --- |
| [tone](https://www.npmjs.com/package/tone) | 15.1.22 | audio synthesis and the transport clock that drives the dump |
| [@tonejs/midi](https://www.npmjs.com/package/@tonejs/midi) | 2.0.28 | parsing MIDI files into notes for the keystream |
| [@tailwindcss/browser](https://www.npmjs.com/package/@tailwindcss/browser) | 4.3.3 | Tailwind 4 styling at runtime |
| [qrcode-generator](https://www.npmjs.com/package/qrcode-generator) | 1.4.4 | QR encoding with Reed Solomon error correction |


Everything else ~~not~~ by Gas-Lighting.

 ·   The "hey I remember doing that in the early 90s coding projects.
Due to the use of GPL npms (General Public License node module packages). The sentence below legally can be ignored.

© 2024 to 2026 Gas-Lighting All Rights Reserved ·  [gas-lighting.com](https://gas-lighting.com)  ·  for obselete code

