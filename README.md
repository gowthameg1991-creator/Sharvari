# NEET study packs: NCERT Biology XI

| Chapter | Videos | Carousels | Revision page |
| --- | --- | --- | --- |
| 1 · The Living World | `out/videos/` (silent, captioned) | `out/carousels/` | `out/site/index.html` |
| 10 · Cell Cycle and Cell Division | `out/ch10/videos/` (voice-over + animations) | `out/ch10/carousels/` | `out/ch10/site/index.html` |

## Chapter 1 "The Living World"

Visual revision material made from the NCERT chapter ([kebo101.pdf](https://ncert.nic.in/textbook/pdf/kebo101.pdf)) so you can learn it without reading the textbook page by page.

| What | Where | Use it for |
| --- | --- | --- |
| 8 explainer videos (1080p, silent, captioned) | `out/videos/*.mp4` | First pass through each topic |
| 8 carousels (1080×1350 PNG slides) | `out/carousels/<topic>/` | Quick revision on your phone |
| Interactive revision page | `out/site/index.html` | Slides + videos, glossary flashcards, hierarchy lab, 20-question quiz |

## Topics

1. `01-unit-intro`: Unit 1 opener and Ernst Mayr
2. `02-what-is-living`: chapter opener, technical vs philosophical question
3. `03-naming`: 1.1 biodiversity, identification, nomenclature, ICBN/ICZN, binomial rules, author citation
4. `04-taxonomy`: 1.1 classification, taxa, taxonomy, systematics
5. `05-categories-species-family`: 1.2 hierarchy, species, genus, family
6. `06-order-to-kingdom`: 1.2 order, class, phylum, kingdom, Figure 1.1, Table 1.1
7. `07-summary-exercises`: NCERT summary and all 10 exercises with model answers
8. `08-neet-practice`: 20 NEET-style MCQs (in the carousel, each question comes before its answer)

Slides with a raspberry **NEET tip · Beyond NCERT** label add exam tips that are not in the NCERT text. Everything else follows the textbook.

## Chapter 10 "Cell Cycle and Cell Division"

Ten topics (10.1 to 10.5, summary with all 16 exercises, 20 MCQs). Videos are narrated by the Kokoro neural voice `af_heart` and show animated diagrams drawn in `templates/cellanim.js`: the cell-cycle wheel, the DNA/chromosome graph, every stage of mitosis, animal and plant cytokinesis, and all of meiosis including synapsis, crossing over, chiasmata and terminalisation.

## Rebuild

Needs Node 22, Playwright with Chromium, and ffmpeg. Voice-over also needs Python with `pip install kokoro-onnx soundfile` and the model files in `models/`:

```bash
curl -L -o models/kokoro-v1.0.onnx https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -L -o models/voices-v1.0.bin https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
```

```bash
node scripts/check-coverage.mjs ch10                      # every key NCERT fact is in the content
node scripts/render.mjs carousels --chapter ch10          # PNG slides
node scripts/render.mjs videos [n] --chapter ch10 --voice # narrated, animated MP4s
node scripts/render.mjs videos [n]                        # Chapter 1 silent videos
node scripts/build-site.mjs ch10                          # self-contained revision page
```

Each chapter's outputs come from one file, `content/<chapter>.mjs`. Edit it and re-run to change any slide, caption or question. `templates/slides.js` and `templates/slides.css` draw the slides and diagrams.
