# UGC Ad Structure Framework

How to segment a UGC ad into beats and map them onto Seedance clips.

## The five UGC beats

1. **Hook** (first 1 to 3 seconds): pattern interrupt, the creator speaking straight to camera. Stops the scroll.
2. **Problem**: the pain the viewer feels, named in the creator's own words.
3. **Product reveal**: the product enters frame as the answer.
4. **Demo / proof**: the creator uses or shows the product, or states the result.
5. **CTA**: the single offer and the action to take, lifted from the brief.

Not every ad uses all five. A 15s hook ad may run hook, reveal, CTA only.

## Beats vs clips

Beats are the **narrative**. Clips are the **generation units** (each up to ~15s of Seedance).

- **Short ads (one clip):** compress multiple beats into a single clip prompt. One 15s clip can carry hook, reveal, and CTA in one continuous shot.
- **Longer ads (multiple clips):** spread beats across clips, one or two beats per clip, so each clip has a clear single action.

## Producing the beat sheet

For each clip, specify:
- The beat(s) it carries
- The on-screen action (what the creator and product do)
- The line (spoken or on-screen text)
- Whether it is **Elements-first** (default) or **keyframe-pinned** (only if the beat needs an exact motion, like a reveal or before/after)

Present the beat sheet and wait for approval before generating. The beat sheet is the contract: it drives keyframe prompts and Seedance prompts directly.

## Hook discipline
The hook is the highest-leverage beat. Write it to earn the first three seconds: a bold claim, a visible problem, or a curiosity gap. If the hook is weak, fix it before spending any credits.

## Anti-patterns
- Forcing all five beats into a 15s ad and rushing the hook.
- One generic shared prompt across every clip (kills the per-beat action).
- Generating before the beat sheet is approved.
