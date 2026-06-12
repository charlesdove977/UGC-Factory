# Stitching and B-roll Framework

How to assemble Seedance clips into one finished UGC ad with ffmpeg, and how to add B-roll.

## Concatenating clips

Clips are rendered separately, one per beat. Stitch them in beat order with ffmpeg's concat demuxer (no re-encode when codecs match):

```bash
# Build the ordered list, then concat
cd "higgsfield-generations/UGC-{topic-slug}-{date}/videos"
printf "file 'clips/clip1-hook.mp4'\nfile 'clips/clip2-reveal.mp4'\nfile 'clips/clip3-cta.mp4'\n" > concat.txt
ffmpeg -f concat -safe 0 -i concat.txt -c copy "final/{topic-slug}-ugc-{ratio}.mp4"
```

If clips differ in codec, resolution, or framerate, re-encode to a common spec first:

```bash
ffmpeg -f concat -safe 0 -i concat.txt -c:v libx264 -pix_fmt yuv420p -r 30 -c:a aac "final/{topic-slug}-ugc-{ratio}.mp4"
```

All clips must already share the chosen aspect ratio (enforced at generation time), so no cropping or padding is needed here.

## Adding B-roll

B-roll is extra Seedance clips spliced between the main beats: a product close-up, a results montage, a lifestyle cutaway.

1. Generate each B-roll clip with `seedance_2_0` in the same ratio. For product B-roll, embed `<<<product_element_id>>>` so it matches the hero product exactly.
2. Save into `videos/clips/`, named `broll{N}-{detail}.mp4`.
3. Insert the B-roll file lines into `concat.txt` at the right beat positions, then run the concat.

## Verify
After stitching, confirm the final file exists and check its duration with `ffprobe`:

```bash
ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "final/{topic-slug}-ugc-{ratio}.mp4"
```

Report the final path and duration to the user.

## Anti-patterns
- Stitching clips of mismatched ratio (should never happen if generation enforced the ratio).
- B-roll product shots that drift from the hero product (always element-reference them).
- Reporting success without verifying the final file exists.
