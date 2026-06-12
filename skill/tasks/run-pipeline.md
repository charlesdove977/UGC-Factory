<purpose>
Run the full UGC ad pipeline: capture the brief, lock a reusable character and product as Higgsfield Elements, generate ratio-matched keyframes, render Seedance 2.0 clips Elements-first, and stitch them into one finished ad with optional B-roll.
</purpose>

<user-story>
As a marketer, I want a finished UGC video ad with a consistent on-screen creator and product, so that I can launch short-form creative without hiring a creator or filming anything.
</user-story>

<when-to-use>
- User runs `/ugc-factory`
- User asks to make a UGC ad, AI-creator ad, or AI-spokesperson product video
</when-to-use>

<references>
@frameworks/character-creation.md (during create_character_and_product step)
@frameworks/seedance-elements.md (during generate_keyframes and generate_clips steps)
@frameworks/ugc-ad-structure.md (during plan_beats step)
@frameworks/style-routing.md (during select_style_skill step)
@frameworks/stitching-broll.md (during stitch step)
@templates/ugc-folder.md (during build_folder step)
</references>

<steps>

<step name="check_higgsfield" priority="first">
Confirm the Higgsfield MCP is connected (tools `mcp__higgsfield__*` available). If not, give the user:
- Install link: https://higgsfield.ai/s/higgsfield-mcp-ig-charlieautomates-dBaWAw
- Setup help video: https://www.youtube.com/watch?v=SY8kQ6qe4YQ

Do not fall back to any other generator. Nano Banana Pro and GPT Image 2 in this skill are Higgsfield-native image models, not the deprecated standalone nanobanana-mcp.
</step>

<step name="resolve_brief">
First, look for a brand kit. Glob `.claude/brand-context-*.md` and `.claude/brand-kit*.md` in the project. Also check for a user-named reference brand kit.

<if condition="a brand kit exists">
  Read it. Mirror the relevant fields (voice, palette, logo path, audience) into the brief. Tell the user which kit you loaded.
</if>

<if condition="no brand kit found">
  Ask the user: "Do you have a reference brand kit I should follow, or should we go off the interview only?" If they point to a file, read it. Otherwise proceed with the interview alone.
</if>

Then capture the three core inputs. Ask as one group:
1. What is the **product**?
2. What is the **offer** (the promise / deal / CTA)?
3. What is the **topic** of the video (the angle or message)?

**Wait for response.** Summarize back to confirm.
</step>

<step name="choose_models">
Ask which image model to use for the character and keyframes:
- **GPT Image 2** (`gpt_image_2`)
- **Nano Banana Pro** (`nano_banana_2`)

Both support Elements, so the character stays locked either way. Carry the chosen machine name into every `generate_image` call.

The video model is fixed: **Seedance 2.0** (`seedance_2_0`).

**Wait for the image-model choice.**
</step>

<step name="define_persona">
Ask: "What kind of person is the creator?" Capture, as one group:
1. Demographic and vibe (age range, gender, energy, style)
2. Setting they appear in (home, car, office, outdoors, studio)
3. Wardrobe and tone that fit the brand

This defines the character Element. **Wait for response.**
</step>

<step name="define_format">
Ask, as one group:
1. **Length** of the ad in seconds (no default; always ask)
2. **Format / ratio**: 9:16 vertical, 1:1 square, 4:5 portrait, or 16:9 wide
3. Platform target (TikTok, Reels, Shorts, YouTube, Meta feed) to sanity-check the ratio

**Wait for response.**

Then derive the clip count. Call `mcp__higgsfield__models_explore action=get model_id=seedance_2_0` to read the exact max duration. Seedance renders one clip up to its max (about 15s). Clip count = ceil(length / max_clip_seconds). A 15s ad is typically 1 clip; 30s is 2; 60s is 4. State the derived clip count back to the user.
</step>

<step name="plan_beats">
Load @frameworks/ugc-ad-structure.md

Segment the ad into narrative beats (hook, problem, product reveal, demo, CTA) and map them onto the derived clip count. For short ads, multiple beats compress into one clip's prompt; for longer ads, beats spread across clips.

Produce a beat sheet: for each clip, the beat(s) it carries, the on-screen action, and the spoken or on-screen line. Present it. **Wait for approval before generating anything.**
</step>

<step name="select_style_skill">
Load @frameworks/style-routing.md

From the product category, topic, and any look the user requested, pick ONE primary Seedance style skill (`01-cinematic` through `15-real-estate`) using the routing map. If the user asked for a specific non-photoreal look, the stylized override wins; otherwise match the product category; otherwise default to `11-social-hook`.

Read the matched skill's guide at `styles/{NN-name}/SKILL.md` inside this skill folder to pull its camera language, motion vocabulary, and hook patterns. Tell the user which style skill you routed to and why (one line). Carry this craft into every keyframe and clip prompt, without overriding the UGC beat structure or the element-lock.

Optionally blend a second style skill for a single beat (max two total).
</step>

<step name="build_folder">
Load @templates/ugc-folder.md

Create the per-ad folder under `higgsfield-generations/`:

```
higgsfield-generations/UGC-{topic-slug}-{YYYY-MM-DD}/
├── images/
│   ├── character/      ← character + product element reference images
│   └── keyframes/      ← starting and ending images, named per clip
└── videos/
    ├── clips/          ← individual Seedance clips
    └── final/          ← stitched ad + any B-roll
```

Kebab-case the topic slug. Use today's date. Create all four leaf folders with `mkdir -p`.
</step>

<step name="create_character_and_product">
Load @frameworks/character-creation.md

**Character (angle set).** Generate an angle set of the creator with the chosen image model in the chosen ratio: 3 to 4 images of the same person in the same wardrobe and lighting at different angles (front, three-quarter left, three-quarter right, profile). Save all into `images/character/`. Register them as ONE Element via `mcp__higgsfield__show_reference_elements action=create`, passing every angle image in the `medias[]` array, and capture the returned `character_element_id`. One element, many angles, so the person can turn and move believably.

**Environment (optional, for consistent background).** If the ad stays in one location, generate one clean background plate in the chosen ratio, save into `images/character/`, register it as an Element with `category: environment`, and capture `environment_element_id`. Embed it in clip prompts to keep the backdrop consistent as the camera and person move.

**Product.** Ask the user: "Do you have a real product photo to upload, or should I generate the product?"
<if condition="user has a product photo">
  Upload it via the media-upload path, save a copy into `images/character/`, register it as an Element, capture `product_element_id`.
</if>
<if condition="no product photo">
  Generate the product image with the chosen model from the brief, save into `images/character/`, register it as an Element, capture `product_element_id`.
</if>

Confirm the character and product element IDs (and environment ID if used) are captured before continuing.
</step>

<step name="generate_keyframes">
Load @frameworks/seedance-elements.md

Default conditioning is **Elements-first**. For each clip, generate the keyframe image(s) with the chosen image model, embedding `<<<character_element_id>>>` and `<<<product_element_id>>>` in the prompt so the creator and product stay locked. Every keyframe must be generated in the chosen ratio so it matches the video format.

For Elements-first clips you need a single anchor keyframe per clip. For any beat the user flags as motion-critical (a reveal, a before/after, a transformation), also generate an end frame so that clip can be keyframe-pinned.

Save every keyframe into `images/keyframes/`, renamed `clip{N}-{start|end}-{detail}.png`. Never leave auto-generated filenames.
</step>

<step name="generate_clips">
Load @frameworks/seedance-elements.md

For each clip, call `mcp__higgsfield__generate_video` with `model: seedance_2_0`, the clip duration, and the chosen `aspect_ratio`.

**The script is `params.prompt`, and it is never blank.** Before every call, write a full scene script for that clip: who is on screen (embed `<<<character_element_id>>>`, `<<<product_element_id>>>`, and `<<<environment_element_id>>>` if used), what they do and say (the beat action and line), the camera and motion for that beat, and the setting. Minimum two full sentences. A blank or thin prompt produces gibberish video, so this is mandatory on every clip, including keyframe-pinned ones. Pull the camera and motion vocabulary from the routed style skill.

<if condition="Elements-first clip">
  The motion is prompt-driven. The element placeholders in `params.prompt` carry the character, product, and background.
</if>

<if condition="keyframe-pinned clip">
  Also pass `medias[]` with role `start_image` (and `end_image` when an end frame exists), using the keyframe job/media IDs. Still write the full `params.prompt` script; the keyframes pin the framing, the prompt directs the motion and dialogue.
</if>

Poll `mcp__higgsfield__job_status` until each clip finishes. Save each into `videos/clips/`, renamed `clip{N}-{beat}.mp4`. Confirm all clips rendered before stitching.
</step>

<step name="stitch">
Load @frameworks/stitching-broll.md

Concatenate the clips in beat order with ffmpeg into one ad in `videos/final/`, named `{topic-slug}-ugc-{ratio}.mp4`.

<if condition="user wants B-roll">
  Generate the extra B-roll clips with Seedance 2.0 (element-referenced for product B-roll), save into `videos/clips/`, then splice them into the concat list at the right beat positions before the final render.
</if>

Verify the final file exists and report its path and duration.
</step>

<step name="report" priority="last">
Report the finished ad: the output folder path, the final video path, its duration, and the style skill that was routed. Do not persist the brief anywhere; the next run starts blank by design.
</step>

</steps>

<output>
## Artifact
A finished UGC video ad plus all source assets, organized in a per-ad folder.

## Format
```
higgsfield-generations/UGC-{topic-slug}-{YYYY-MM-DD}/
├── images/
│   ├── character/      character + product element references
│   └── keyframes/      clip{N}-{start|end}-{detail}.png
└── videos/
    ├── clips/          clip{N}-{beat}.mp4
    └── final/          {topic-slug}-ugc-{ratio}.mp4
```

## Location
`higgsfield-generations/UGC-{topic-slug}-{YYYY-MM-DD}/`
</output>

<acceptance-criteria>
- [ ] Brief captured: product, offer, topic, persona, length, format/ratio
- [ ] Image model chosen (gpt_image_2 or nano_banana_2); video model is seedance_2_0
- [ ] Character Element built from a 3 to 4 image angle set; product Element registered; environment Element when single-location
- [ ] Clip count derived from length and Seedance max duration, approved by user
- [ ] One primary Seedance style skill routed from the brief, its craft applied to prompts
- [ ] Every keyframe generated in the chosen ratio, embedding the element IDs
- [ ] Every generate_video call carries a full written params.prompt (minimum two sentences); none left blank
- [ ] Camera and motion matched to each beat, not constant on every clip
- [ ] All Seedance clips rendered in the chosen ratio and saved to videos/clips/
- [ ] Final ad stitched with ffmpeg into videos/final/, file verified to exist
- [ ] All files renamed descriptively, no auto-generated Higgsfield filenames left
- [ ] User confirmed the finished ad matches the brief
</acceptance-criteria>
