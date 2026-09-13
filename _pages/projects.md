---
layout: page
title: Projects
permalink: /projects/
description: Software I write and maintain. Each card opens a short write-up, and the GitHub icon opens the code.
nav: true
nav_order: 3
display_categories: [research software, side projects]
---

<!-- Curated projects. One file per project in _projects/. -->

<div class="projects">
{% for category in page.display_categories %}
  {% assign categorized_projects = site.projects | where: "category", category %}
  {% if categorized_projects.size > 0 %}
    <a id="{{ category | slugify }}" href=".#{{ category | slugify }}">
      <h2 class="category">{{ category }}</h2>
    </a>
    {% assign sorted_projects = categorized_projects | sort: "importance" %}
    <div class="row row-cols-1 row-cols-md-3">
      {% for project in sorted_projects %}
        {% include projects.liquid %}
      {% endfor %}
    </div>
  {% endif %}
{% endfor %}
</div>

---

## All repositories

<!-- The list lives in _data/repositories.yml. Edit it there to add or change a repository. -->

{% if site.data.repositories.github_repos %}

  <div class="repositories d-flex flex-wrap justify-content-between">
    {% for repo in site.data.repositories.github_repos %}
      {% include repository/repo.liquid repository=repo %}
    {% endfor %}
  </div>
{% endif %}
