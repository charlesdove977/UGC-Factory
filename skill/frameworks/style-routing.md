# Style-Skill Routing Framework

UGC Factory owns the pipeline. The Seedance 2.0 prompt craft lives in the genre style skills (`01-cinematic` through `15-real-estate`). This framework picks the right one from the interview answers and loads its vocabulary for keyframe and clip prompts.

## Why route
Each genre skill is a single-file Seedance 2.0 prompt guide: camera language, motion vocabulary, lighting, pacing, and aspect-ratio notes tuned for that genre. Pulling the matched guide gives every clip prompt genre-correct craft instead of generic descriptions.

## Routing map

Pick ONE primary skill from the product category and topic. Read its file at `styles/{NN-name}/SKILL.md` inside this skill folder. The 15 style skills are vendored here, so the skill is self-contained and portable; do not depend on them being installed globally.

| Product / topic signal | Primary style skill |
|------------------------|---------------------|
| Physical product, general commerce, unboxing, demo | `07-ecommerce-ad` |
| Product hero rotation, turntable, multi-angle showcase | `09-product-360` |
| Apparel, footwear, accessories, beauty, cosmetics | `13-fashion-lookbook` |
| Food, drink, supplement, ingestible | `14-food-beverage` |
| Property, home, listing, rental | `15-real-estate` |
| Software, SaaS, app, dashboard, UI | `06-motion-design-ad` |
| Brand origin, founder, mission, company story | `12-brand-story` |
| Pure viral hook, trend-driven, creator straight-to-camera | `11-social-hook` |
| Premium, filmic, aspirational mood | `01-cinematic` |

Stylized override (only if the user asks for a non-photoreal look):

| Requested look | Style skill |
|----------------|-------------|
| 3D / CGI / rendered | `02-3d-cgi` |
| Cartoon / 2D / cel | `03-cartoon` |
| Comic / manga panels animated | `04-comic-to-video` |
| Anime | `08-anime-action` |
| Fight / action choreography | `05-fight-scenes` |
| Music-video / beat-synced | `10-music-video` |

## Selection logic
1. If the user asked for a specific look, the stylized override wins.
2. Else match the product category to a primary skill.
3. Else, default to `11-social-hook` (UGC is short-form, hook-led).

A UGC ad usually needs ONE primary skill. Optionally blend a second for a single beat (for example `09-product-360` just for the reveal clip inside an otherwise `11-social-hook` ad). Keep blends to two skills max.

## How to apply the loaded guide
- Pull the matched skill's hook patterns, camera moves, and motion vocabulary into each Seedance clip prompt.
- Keep the UGC frame intact: real creator, direct address, the product in hand. The genre skill flavors the craft; it does not replace the UGC structure from `ugc-ad-structure.md`.
- Carry the chosen aspect ratio through, per `seedance-elements.md`.

## Anti-patterns
- Routing to a stylized skill (anime, 3D) when the user wants photoreal UGC.
- Loading more than two style skills (dilutes the look).
- Letting the genre skill override the UGC beat structure or the element-lock on character and product.
