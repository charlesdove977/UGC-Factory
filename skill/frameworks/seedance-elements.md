# Seedance 2.0 Conditioning Framework

How to condition Seedance 2.0 (`seedance_2_0`) on Higgsfield for consistent UGC ads, and how many images each ad needs.

## Critical rule: never leave the script blank

Every `generate_video` call MUST pass a fully written `params.prompt`. A blank or thin prompt produces gibberish video. This is not optional and applies to every clip, including keyframe-pinned clips that already have start and end images.

Each clip prompt must contain, in plain language:
1. **Who** is on screen, via the element placeholders (`<<<character_id>>>`, `<<<product_id>>>`)
2. **What they do** (the beat action, the spoken or on-screen line, the dialogue)
3. **Camera and motion** (the shot and how it moves, see the movement section below)
4. **Setting** (the background, locked via the environment element when used)

If a clip prompt would be shorter than roughly two full sentences, it is too thin. Expand it before generating. Do not submit a `generate_video` job with an empty or one-word prompt under any circumstance.

## Two conditioning modes

| | Elements-first (default) | Keyframe pinning |
|---|---|---|
| Mechanism | Embed `<<<element_id>>>` in `params.prompt`; backend auto-injects the reference and rewrites to `@element_name` | Pass `medias[]` with role `start_image` and optional `end_image` |
| Best for | Character + product consistency across the whole ad | Precise motion beats: reveals, before/after, transformations |
| Images per clip | 1 anchor keyframe (or none, pure prompt) | 1 to 2 (start, and end if interpolating) |
| Control | Medium, prompt-steered | High, exact framing |

**Default to Elements-first.** UGC lives or dies on "same creator, same product, every shot." Elements solves that in a single call. Reserve keyframe pinning for the one or two beats that need an exact motion.

## The element placeholder mechanic

Register a character or product once with `mcp__higgsfield__show_reference_elements action=create`, which returns an `element_id`. Then embed it literally in the prompt of `generate_image` or `generate_video`:

- `"<<<CHARACTER_ID>>> holding <<<PRODUCT_ID>>>, smiling at the camera in a bright kitchen"`
- Multiple placeholders per prompt are allowed.
- Never explain the `<<<id>>>` syntax to the end user; it is an internal mechanic.

Seedance 2.0 is on the Elements supported-models list, so the same element IDs work in both the image and the video calls.

## Clip math (Seedance renders up to ~15s per clip)

Clip count = ceil(ad_length / max_clip_seconds). Confirm `max_clip_seconds` at runtime via `models_explore action=get model_id=seedance_2_0`.

| Ad length | Seedance clips | Base elements (character + product) | Optional keyframe pins | Typical total images |
|-----------|----------------|-------------------------------------|------------------------|----------------------|
| 15s | 1 | 2 | 0 | 2 to 3 |
| 30s | 2 | 2 | 0 to 2 | 3 to 5 |
| 60s | 4 | 2 | 0 to 4 | 4 to 8 |

Because the character and product are generated once and reused as elements, image count stays low even as length grows. This is the whole reason to prefer Elements over chained keyframes: fewer images, higher consistency.

## Multi-angle character, movement, and consistent background

### Multi-angle character element
A single front portrait limits how believably Seedance can turn the person. Build the character element from an **angle set**: 3 to 4 images of the same person in the same wardrobe and lighting, at different angles (front, three-quarter left, three-quarter right, profile). Register all of them in ONE `show_reference_elements action=create` call (the `medias[]` array accepts multiple images). One element, many angles, stronger identity lock and realistic turns.

### Consistent background via an environment element
For a locked setting across clips, register the background as its own element with `category: environment` (one clean plate of the room or location). Embed `<<<environment_id>>>` alongside the character in clip prompts so the backdrop stays consistent even as the camera and person move. Use this whenever the ad stays in one location.

### Dynamic movement where it serves the beat
Write motion into the script per beat; do not make every clip a static talking head.
- **Hook:** a push-in or a quick handheld energy to stop the scroll.
- **Reveal:** the product enters frame, a pan or rack-focus to it.
- **Demo:** the creator moves naturally, a three-quarter angle, slight parallax.
- **CTA:** settle to a steadier framing so the offer lands.

Movement should match the beat, not be constant. Calm beats stay calm. Pull the specific camera and motion vocabulary from the routed style skill (see `style-routing.md`).

## Ratio discipline

Generate every keyframe in the chosen video ratio (9:16, 1:1, 4:5, 16:9) and pass the same `aspect_ratio` to `generate_video`. Never let Seedance crop or letterbox the creator's face out of frame.

## Anti-patterns
- Submitting a `generate_video` call with a blank or thin prompt. This is the top cause of gibberish video. Always write the full script.
- Building the character element from a single front portrait when the ad needs the person to turn or move. Use an angle set.
- Constant camera motion on every clip. Match movement to the beat.
- Inconsistent backgrounds across clips when one location was intended. Lock it with an environment element.
- Chaining keyframes for the whole ad when Elements would keep the character locked with fewer images.
- Mismatched ratios between keyframes and the video call.
- Leaving auto-generated Higgsfield filenames on saved assets.
- Explaining the `<<<element_id>>>` placeholder to the user.
- Falling back to any non-Higgsfield generator.
