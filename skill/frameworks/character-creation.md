# Character and Product Creation Framework

How to build a consistent on-screen creator and product as Higgsfield Elements for a single ad.

## Scope: fresh every run, never a forever-avatar

The character is generated fresh on every run from that run's persona interview. Nothing is saved across runs; there is no locked avatar that returns next time. The words "reusable" and "lock" below mean only this: within THIS one ad, the same element is referenced across all the clips so the creator does not morph between cuts. The next `/ugc-factory` run starts blank and casts a new person.

If the user explicitly wants a recurring brand spokesperson that returns across ads, that is the Soul path (see the table below), not the default.

## Element vs Soul

For UGC ads, use **Elements** (`show_reference_elements action=create`), not Soul training.

|                           | Element (use this)                                                     | Soul (skip for UGC)                       |
| ------------------------- | ---------------------------------------------------------------------- | ----------------------------------------- |
| Setup                     | Instant, single image                                                  | Train on 5 to 20 photos, \~10 min         |
| References per generation | Multiple (character + product + prop)                                  | One person                                |
| Models                    | Works with Seedance 2.0, GPT Image 2, Nano Banana Pro, Seedream, Kling | Soul V2 / Cinema only                     |
| Best for                  | Multi-subject UGC, instant character + product lock                    | A trained digital twin of one real person |

Use Soul only if the user explicitly wants a trained recurring brand spokesperson built from many photos of one real person.

## Building the character Element

1. Generate the creator portrait with the chosen image model (`gpt_image_2` or `nano_banana_2`) in the chosen ratio, matching the captured persona (demographic, setting, wardrobe, tone).
2. Save into `images/character/`, renamed descriptively (for example `character-creator-kitchen.png`).
3. Register it: `mcp__higgsfield__show_reference_elements action=create` with the generated image's job/media reference. Capture the returned `character_element_id`.

A clean, well-lit, front-facing portrait makes the strongest element. Avoid heavy occlusion or extreme angles in the source.

## Building the product Element

Ask the user whether they have a real product photo.

* **Upload path:** if they have a photo, route through the media-upload flow (`media_upload_widget` for a local file, or `media_import_url` for a web URL), then register the element. A real product photo is the most accurate and is preferred when available.
* **Generate path:** if not, generate the product from the brief with the chosen image model, then register the element.

Either way, save a copy into `images/character/` and capture `product_element_id`.

## Output of this step

* `character_element_id` and `product_element_id`, both registered and reusable in every downstream image and video call.
* Reference images saved under `images/character/`.

## Anti-patterns

* Reaching for Soul training when an Element would do (slower, single-subject, model-restricted).
* Generating a product when the user has a real photo on hand.
* Skipping the element registration and re-describing the character in every prompt (causes drift).

