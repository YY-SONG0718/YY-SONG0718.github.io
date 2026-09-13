---
layout: post
title: The title of the post
description: One sentence that appears under the title in the blog list.
date: 2026-09-13
tags: single-cell machine-learning
categories: methods
# featured: true          # pins the post to a card at the top of the blog page
# thumbnail: assets/img/posts/my-post/cover.jpg
# giscus_comments: true   # needs the giscus settings in _config.yml
# toc:
#   sidebar: left         # adds a table of contents built from the headings below
---

Jekyll ignores any file in this folder whose name starts with an underscore, so this
template never appears on the site. Copy it to `2026-09-13-my-post.md` to start a post.

The file name sets the date and the address. A file named `2026-09-13-my-post.md` becomes
`/blog/2026/my-post/`, so keep the `YYYY-MM-DD-title.md` form.

Write the post as normal Markdown. Everything below shows the markup you need most often.

## A heading

Write a paragraph here. Separate `tags` with spaces, and use `categories` the same way.
Both appear under the post in the blog list, and each one gets its own archive page.

## A photograph

{% raw %}

<div class="row justify-content-sm-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/posts/my-post/figure.jpg" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Say what the figure shows.
</div>
{% endraw %}

## Code

```python
import scanpy as sc

adata = sc.read_h5ad("data.h5ad")
sc.pp.normalize_total(adata, target_sum=1e4)
```

## A citation

Cite an entry from `_bibliography/papers.bib` by its key, and add
`related_publications: true` to the front matter above.
