<p align="center">
  <img src="docs/hero.png" alt="UGC Factory — AI UGC video ad factory for Claude Code" width="320">
</p>

<h1 align="center">UGC Factory</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/ugc-factory"><img src="https://img.shields.io/npm/v/ugc-factory.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/ugc-factory"><img src="https://img.shields.io/npm/dt/ugc-factory.svg" alt="downloads"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT license"></a>
</p>

> A UGC video ad factory for [Claude Code](https://claude.com/claude-code). It interviews you, locks a reusable AI creator and your product as Higgsfield Elements, generates ratio-matched keyframes, renders the motion with Seedance 2.0, and stitches a finished short-form ad. Ships with 15 genre style skills so every clip gets genre-correct prompt craft.

---

## Why

Most AI ad tools give you one good clip and a creator whose face changes every shot. UGC Factory fixes the two things that actually break AI UGC:

- **Consistency within an ad.** For a single ad, the creator and product are built once as Higgsfield Elements (an angle set for the person, so they turn and move believably) and referenced across every clip of that ad. No drift between cuts. This is not a saved avatar: every run starts blank, re-interviews the persona, and casts a brand-new creator. Nothing carries over. (Want a recurring spokesperson on purpose? That is the Soul path, not the default.)
- **A real script.** Seedance renders gibberish when the prompt is blank. UGC Factory writes a full scene script for every single clip: who is on screen, what they say, the camera, and the motion. Nothing is ever left blank.

You answer an interview. It returns a finished ad plus every source asset, organized in one folder.

## Requirements

- [Claude Code](https://claude.com/claude-code)
- The **Higgsfield MCP** (image, Elements, and Seedance 2.0 video generation)
- `ffmpeg` on your PATH (clip stitching)

Install the Higgsfield MCP here:

**https://higgsfield.ai/s/higgsfield-mcp-v3-earning-series-charlieautomates-ptQTLe**

Setup walkthrough: https://www.youtube.com/watch?v=SY8kQ6qe4YQ

## Install

```bash
npx ugc-factory install
```

Then restart Claude Code and run `/ugc-factory`.

Other methods:

```bash
npm install -g ugc-factory && ugc-factory install   # global CLI
npx ugc-factory install --project                    # install into ./.claude/skills only
npx ugc-factory uninstall                            # remove the global install
```

## How it works

Run `/ugc-factory` and it walks one pipeline end to end:

1. **Brief** — captures product, offer, topic, and reads your brand kit if you have one
2. **Models** — you pick the image model (GPT Image 2 or Nano Banana Pro); video is Seedance 2.0
3. **Persona** — defines the on-screen creator
4. **Format** — length, ratio (9:16, 1:1, 4:5, 16:9), platform; derives the clip count
5. **Beat sheet** — segments the ad into hook, problem, reveal, demo, CTA, then waits for your approval
6. **Style routing** — picks the matching genre style skill from your brief (ecommerce, food, fashion, SaaS, and more)
7. **Cast** — builds a fresh multi-angle character Element (new every run, never a saved avatar), an optional environment Element for a consistent background, and a product Element (upload a real photo or generate one)
8. **Keyframes** — ratio-matched, with the elements embedded so the creator and product stay consistent
9. **Render** — Seedance 2.0 clips, Elements-first, with a full written script on every clip and motion matched to each beat
10. **Stitch** — ffmpeg concatenates the clips into one ad, with optional B-roll

Output lands in `higgsfield-generations/UGC-{topic}-{date}/` with `images/`, `videos/clips/`, and `videos/final/`.

## What gets installed

```
~/.claude/skills/ugc-factory/
├── SKILL.md                     entry point
├── tasks/run-pipeline.md        the full interview-to-ad pipeline
├── frameworks/
│   ├── seedance-elements.md     Elements vs keyframe conditioning, the never-blank-script rule
│   ├── character-creation.md    multi-angle character + product + environment Elements
│   ├── ugc-ad-structure.md      the five UGC beats and beat-to-clip mapping
│   ├── style-routing.md         picks the genre style skill from the brief
│   └── stitching-broll.md       ffmpeg concat and B-roll splicing
├── templates/ugc-folder.md      per-ad output folder layout
└── styles/                      15 vendored Seedance 2.0 genre prompt skills
    ├── 01-cinematic           ├── 06-motion-design-ad   ├── 11-social-hook
    ├── 02-3d-cgi              ├── 07-ecommerce-ad       ├── 12-brand-story
    ├── 03-cartoon             ├── 08-anime-action       ├── 13-fashion-lookbook
    ├── 04-comic-to-video      ├── 09-product-360        ├── 14-food-beverage
    └── 05-fight-scenes        └── 10-music-video        └── 15-real-estate
```

The 15 style skills are bundled, so the factory is self-contained and never depends on you installing them separately.

## Design notes

- **Stateless by design.** Each run starts blank and re-interviews from scratch, casting a new creator every time. Nothing about your last ad, including the character, is persisted across runs.
- **Elements over chained keyframes.** Generating the creator and product once and reusing them keeps image counts low and consistency high. A 15s ad is one Seedance clip; a 30s ad is two.
- **The script is `params.prompt`.** There is no separate script field in Seedance. The prompt is the script, and UGC Factory always writes a full one.

## License

MIT. See [LICENSE](LICENSE).

Built by [Charles J Dove](https://github.com/charlesdove977) / [Charlie Automates](https://charlieautomates.com).
