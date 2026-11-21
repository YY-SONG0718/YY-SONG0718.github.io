---
layout: distill
title: Deleting promoters in AlphaGenome 2
description: A small in silico experiment on what a sequence model predicts when a promoter disappears
tags: genomics, machine-learning, sequence-models
giscus_comments: true
date: 2026-11-21

authors:
  - name: Yuyao Song

toc:
  - name: Why I tried this
  - name: What I did
  - name: CAGE is lost, bulk RNA-seq (mean over exons) is largely maintained
  - name: ScRNA-seq lies in between
  - name: Which exons maintain expression
  - name: Longer genes maintain more expression
  - name: Caveats
  - name: What I take from it

---

## Why I tried this

A recent preprint by Sreenivasan, Aksu and Spielmann (bioRxiv, November 2026) asked a simple question. If you delete a gene's promoter in silico, does AlphaGenome predict that the gene loses its expression? Biology says it should: without a transcription start site, there is no transcript. They disrupted about 2,000 promoters. AlphaGenome predicted that CAGE at the promoter was lost, but it predicted that much of the RNA-seq at downstream exons was maintained.

I wanted to see this for myself with AlphaGenome 2 (AG2), in immune cells, on a small set of genes from a project on autoimmune GWAS variants. AG2 also predicts scRNA-seq, which the preprint did not test. This is a pilot, not a benchmark.

## What I did

- **Genes.** I drew 40 protein-coding genes at random from genes near fine-mapped autoimmune GWAS variants. Each gene is expressed in blood NK cells in a PBMC single-cell multiome dataset and has a MANE Select transcript.
- **Promoter region.** I used the TSS from −1 kb to +0.5 kb, merged with any ATAC peak from the multiome data that overlaps it. The regions are 1.5–2.0 kb long. This is simpler than the preprint, which combined EPD, ENCODE and FANTOM5 annotations.
- **Disruption.** I replaced the promoter region in two ways: with N bases, or with random bases at 42% GC. Neither changes the sequence length.
- **Prediction.** All predictions are for blood NK cells, the only PBMC cell type in which AG2 has observed CAGE data. These are hCAGE tracks from the [FANTOM5 promoter atlas](https://doi.org/10.1038/nature13182). The AG2 track metadata gives the source as FANTOM but does not list the individual samples.
  - For CAGE and bulk RNA-seq, AG2 predicted the reference and the two disrupted 1 Mb sequences.
  - AG2 does not accept a whole edited sequence for scRNA-seq. So I gave it each disruption as one long variant (reference promoter → disrupted promoter) and used its scRNA-seq scorer.
- **Scores.** All scores are an expression ratio: disrupted divided by reference. A ratio of 1 means that expression is maintained, and a ratio near 0 means that expression is lost.
  - CAGE is summed over the promoter region ±200 bp.
  - **Bulk RNA-seq (mean over exons)** is the mean predicted RNA-seq signal of each exon, then the mean over all exons of the gene. It gives one value per gene.
  - **Bulk RNA-seq (per exon)** is the same signal for each exon on its own. I use it only to show which exons maintain expression.
  - ScRNA-seq is one value per gene.
  - All readouts use observed tracks on the gene's own strand.

The experiment took 200 AG2 calls.

## CAGE is lost, bulk RNA-seq (mean over exons) is largely maintained

<div class="row justify-content-sm-center">
  <div class="col-sm-12 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/posts/alphagenome-promoter/promoter_cage_vs_rna_box.png" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Expression ratio (disrupted / reference) for 40 genes in NK cells. Left: promoter replaced with N bases. Right: promoter replaced with random bases.
</div>

| Disruption | CAGE maintained (median) | Bulk RNA-seq (mean over exons) maintained (median) | Genes that maintain more bulk RNA-seq (mean over exons) than CAGE |
|---|---|---|---|
| N bases | 0.46% | 54% | 40 of 40 |
| Random bases | 4.8% | 30% | 37 of 40 |

AG2 clearly detects that the promoter is gone. It predicts that CAGE is lost about 200-fold with N bases and about 20-fold with random bases. For the same genes, it predicts that only 46% (N bases) to 70% (random bases) of the bulk RNA-seq (mean over exons) is lost. Two readouts of the same biology disagree.

## ScRNA-seq lies in between

<div class="row justify-content-sm-center">
  <div class="col-sm-12 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/posts/alphagenome-promoter/promoter_three_readouts.png" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Expression ratio for three AG2 readouts of the same 40 genes. The red numbers are the median expression maintained.
</div>

| Disruption | CAGE | ScRNA-seq | Bulk RNA-seq (mean over exons) |
|---|---|---|---|
| N bases | 0.46% | 40% | 54% |
| Random bases | 4.8% | 20% | 30% |

The scRNA-seq score is one value per gene from AG2's variant scorer. For a like-for-like comparison, I also scored bulk RNA-seq with the same variant scorer. This **bulk RNA-seq (gene score)** maintains 55% (N bases) and 34% (random bases) of expression, close to the mean over exons. ScRNA-seq loses more than the bulk RNA-seq gene score: in 34 of 40 genes with N bases, and in 32 of 40 with random bases. But it still maintains far more expression than CAGE (40 of 40 and 37 of 40 genes). The scRNA-seq score and the bulk RNA-seq gene score rank the genes almost identically (Spearman ρ = 0.89 with N bases and 0.94 with random bases). So the scRNA-seq readout follows bulk RNA-seq, not CAGE.

**A note on units.** The AG2 variant scorer reports its gene scores as log fold changes, but its documentation does not state the log base. I compared its bulk RNA-seq gene score with the ratios I computed from the predicted tracks (bulk RNA-seq, mean over exons). The scores matched the natural log of my ratios (slope 0.96, r = 0.98), not the log2 (slope 0.67). So the expression maintained is e<sup>score</sup>, not 2<sup>score</sup>.

## Which exons maintain expression

<div class="row justify-content-sm-center">
  <div class="col-sm-12 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/posts/alphagenome-promoter/promoter_exon_distance.png" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Bulk RNA-seq ratio per exon, by distance downstream of the disrupted region. Ratios below 1e-4 are drawn at 1e-4.
</div>

Exons inside the deleted region lost almost all expression. This is expected, because their own sequence is gone. Downstream exons, median bulk RNA-seq (per exon) maintained:

| Disruption | 0–1 kb | 1–5 kb | 5–10 kb | 10–30 kb | 30–100 kb | > 100 kb |
|---|---|---|---|---|---|---|
| N bases | 31% | 37% | 46% | 54% | 72% | 95% |
| Random bases | 27% | 23% | 30% | 27% | 47% | 85% |

Exons close to the promoter lost most of their expression: with random bases, they maintained only 23–30% within 30 kb. But the further an exon lies from the promoter, the more expression it maintains. Beyond 100 kb, exons maintain 85–95% of their expression, as if the promoter were still there. The model detects that the local sequence changed. It does not carry the loss of transcription initiation along the gene.

## Longer genes maintain more expression

<div class="row justify-content-sm-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/posts/alphagenome-promoter/promoter_rna_vs_cage_scatter.png" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Bulk RNA-seq (mean over exons) ratio against CAGE ratio per gene (random bases). Genes above the dotted line maintain more bulk RNA-seq (mean over exons) than CAGE. Colour shows gene span.
</div>

Longer genes maintained more bulk RNA-seq (mean over exons) after the disruption (Spearman ρ = 0.51). This is the same effect as the distance gradient above, seen per gene: a long gene has more exons far from its promoter.

## Caveats

- **CAGE is scored on the replaced sequence.** The CAGE score covers the promoter region, which is exactly the sequence I replaced. Bulk RNA-seq (mean over exons) covers all exons, and most exons lie outside that region, so their sequence is unchanged. So a CAGE loss is partly built into the design, and part of the gap between CAGE and bulk RNA-seq comes from this. The preprint used the same design, so my results are comparable with theirs.
- **N bases are unusual input.** N-masking removes more CAGE than random bases in 37 of 40 genes, yet it maintains more bulk RNA-seq (mean over exons) in 35 of 40. N is probably out of distribution for the model, so I trust the random-base numbers more.
- **The scRNA-seq readout is gene-level.** It gives one value per gene, so it cannot show the gradient along the exons. The scRNA-seq score and the bulk RNA-seq gene score also use different tracks and aggregations, chosen by AG2's default scorers (a sum over one scRNA-seq track, and a mean over three bulk RNA-seq tracks), so their comparison is approximate. It also uses a different scoring route (a variant scorer) from the CAGE and bulk RNA-seq (mean over exons and per exon) readouts, which come from predicted tracks.
- **This is small.** It covers 40 genes in one cell type with one simple promoter definition. I did not test dinucleotide shuffling.

## What I take from it

The preprint's finding holds in AG2 and in immune cells. The model predicts that CAGE is lost at a deleted promoter, but that much of the bulk RNA-seq of the gene's exons is maintained, especially at distant exons and in long genes. The scRNA-seq readout loses more expression than bulk RNA-seq, but it still maintains far more than CAGE.

For variant work this has a practical meaning. If a variant score comes from a gene's bulk RNA-seq or scRNA-seq track, a strong promoter variant can look weak. The CAGE track, or the exons nearest the promoter, may give a more honest readout. More broadly, a sequence model's output tracks do not have to agree with each other, so check them against simple biological expectations before you trust any one of them.
