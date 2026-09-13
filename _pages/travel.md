---
layout: page
title: Travel
permalink: /travel/
description: Journals from the places I visit, with the photographs that made me stop and look.
nav: true
nav_order: 2
dropdown: true
children:
  - title: Journals
    permalink: /travel/
  - title: Travel map
    permalink: /travel/map/
---

<!-- One file per journey in _travel/. Newest first. -->

<div class="projects">
  {% assign entries = site.travel | sort: "date" | reverse %}
  {% if entries.size > 0 %}
    <div class="row row-cols-1 row-cols-md-3">
      {% for entry in entries %}
        {% include travel_card.liquid %}
      {% endfor %}
    </div>
  {% else %}
    <p>No journals yet.</p>
  {% endif %}
</div>
