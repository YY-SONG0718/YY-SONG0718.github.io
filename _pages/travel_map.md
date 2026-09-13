---
layout: page
title: Travel map
permalink: /travel/map/
description: Every place I have visited lit up on a night map.
nav: false
map: true
---

<!-- The places come from _data/places.yml. A place with a `journal` field links to that
     entry in _travel/. The script assets/js/travel-map.js draws the map and the list. -->

<script id="travel-places" type="application/json">
[
{%- for p in site.data.places -%}
  {%- if p.name -%}{%- assign name = p.name -%}{%- else -%}{%- assign name = p -%}{%- endif -%}
  {%- assign journal_url = "" -%}
  {%- assign journal_title = "" -%}
  {%- if p.journal -%}
    {%- assign j = site.travel | where: "slug", p.journal | first -%}
    {%- if j -%}
      {%- assign journal_url = j.url | relative_url -%}
      {%- assign journal_title = j.title -%}
    {%- else -%}
      {%- assign journal_url = "/travel/" | append: p.journal | append: "/" | relative_url -%}
    {%- endif -%}
  {%- endif -%}
  {"name": {{ name | jsonify }}, "country": {{ p.country | jsonify }}, "lat": {{ p.lat | jsonify }}, "lon": {{ p.lon | jsonify }}, "journalUrl": {{ journal_url | jsonify }}, "journalTitle": {{ journal_title | jsonify }}}{%- unless forloop.last -%},{%- endunless %}
{% endfor -%}
]
</script>

<div class="travel-map-frame">
  <div id="travel-map"></div>
</div>

<div class="travel-stats">
  <div class="stat"><div class="n" id="travel-city-count">0</div><div class="l">Places</div></div>
  <div class="stat"><div class="n" id="travel-country-count">0</div><div class="l">Countries</div></div>
</div>

<div id="travel-place-list"></div>

<script defer src="{{ '/assets/js/travel-map.js' | relative_url }}"></script>
