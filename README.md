# NEET study pack: NCERT Biology XI, Chapter 1 "The Living World"

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

## Rebuild

Needs Node 22, Playwright with Chromium, and ffmpeg.

```bash
node scripts/check-coverage.mjs       # every key NCERT fact is in the content
node scripts/render.mjs carousels     # PNG slides
node scripts/render.mjs videos [n]    # MP4s (all, or topic index n)
node scripts/build-site.mjs           # self-contained revision page
```

All three outputs come from one file, `content/ch01.mjs`. Edit it and re-run to change any slide, caption or question. `templates/slides.js` and `templates/slides.css` draw the slides and diagrams.
