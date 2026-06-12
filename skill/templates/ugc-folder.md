# UGC Output Folder Template

Every ad gets its own project folder under `higgsfield-generations/`. This keeps a multi-asset ad organized and stays inside the graphify-excluded Higgsfield output tree.

## Structure

```
higgsfield-generations/UGC-{topic-slug}-{YYYY-MM-DD}/
├── images/
│   ├── character/      character + product element reference images
│   └── keyframes/      starting and ending images, one set per clip
└── videos/
    ├── clips/          individual Seedance clips (+ B-roll)
    └── final/          stitched ad
```

## Rules
- `{topic-slug}` is kebab-case from the captured topic.
- `{YYYY-MM-DD}` is today's date.
- Create all four leaf folders up front with `mkdir -p`.
- Naming conventions inside the folders:
  - `images/character/` → `character-{detail}.png`, `product-{detail}.png`
  - `images/keyframes/` → `clip{N}-{start|end}-{detail}.png`
  - `videos/clips/` → `clip{N}-{beat}.mp4`, `broll{N}-{detail}.mp4`
  - `videos/final/` → `{topic-slug}-ugc-{ratio}.mp4`
- Never leave auto-generated Higgsfield filenames anywhere in the folder.

## Why under higgsfield-generations/
All Higgsfield image and video output lives in `higgsfield-generations/`, which graphify excludes (expensive vision tokens, no semantic value). A UGC ad is a multi-asset Higgsfield project, so it gets a named project subfolder here rather than dumping flat into `images/` and `videos/`.
