---
layout: page
title: City or region
description: One sentence that says what this journey was about.
place: City, Country
date: 2026-04-12 # the cards sort on this date, newest first
img: assets/img/travel/YOUR-FOLDER/cover.jpg # the card thumbnail
---

Jekyll ignores any file in this folder whose name starts with an underscore, so this template
never appears on the site. Copy it to `lisbon.md` to start a new journal, and put the
photographs in `assets/img/travel/lisbon/`.

Write the journal as normal prose. Everything below shows the markup you need most often.

## A single wide photograph

{% raw %}

<div class="row justify-content-sm-center">
  <div class="col-sm-12 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/travel/YOUR-FOLDER/wide.jpg" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Say what the photograph shows.
</div>
{% endraw %}

## Three photographs side by side

{% raw %}

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/travel/YOUR-FOLDER/one.jpg" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/travel/YOUR-FOLDER/two.jpg" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/travel/YOUR-FOLDER/three.jpg" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  One caption describes the whole row.
</div>
{% endraw %}

## A quotation

> Write the line you want to remember here.

## A link

I ate [here](https://example.com) and I would go back.
