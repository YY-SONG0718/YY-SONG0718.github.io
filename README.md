# yy-song0718.github.io

This repository holds the personal website of Yuyao Song, which is live at
<https://yy-song0718.github.io>. The site is a Jekyll site built on the
[al-folio](https://github.com/alshedivat/al-folio) theme. GitHub Actions builds it and
publishes it to GitHub Pages.

## Preview the site on your computer

The system Ruby on macOS is too old for this version of Jekyll, so use Docker. Start Docker
Desktop first, then run the following command from the root of the repository.

```bash
docker compose up -d
```

Open <http://localhost:8080>. The first run pulls the image and takes a few minutes, and
later runs take about fifteen seconds. Jekyll watches your files and rebuilds each time you
save. Run `docker compose down` to stop the site.

Jekyll does not watch `_config.yml`. Run `docker compose restart jekyll` after you edit it.

## Where the content lives

| Page                              | Content                                                                           |
| --------------------------------- | --------------------------------------------------------------------------------- |
| About, at `/`                     | [`_pages/about.md`](_pages/about.md)                                              |
| Blog, at `/blog/`                 | One file for each post in [`_posts/`](_posts/)                                    |
| Travel, at `/travel/`             | One file for each journal in [`_travel/`](_travel/)                               |
| Projects, at `/projects/`         | [`_projects/`](_projects/) and [`_data/repositories.yml`](_data/repositories.yml) |
| Publications, at `/publications/` | [`_bibliography/papers.bib`](_bibliography/papers.bib)                            |
| CV, at `/cv/`                     | [`assets/json/resume.json`](assets/json/resume.json)                              |

Each of `_posts`, `_travel` and `_projects` holds a file named `_template.md`. Jekyll ignores
any file whose name starts with an underscore, so the templates stay off the site. Copy a
template to start a new entry.

## Add a blog post

Copy [`_posts/_template.md`](_posts/_template.md) to a file named `YYYY-MM-DD-title.md`. The
file name sets both the date and the address, so `2026-09-13-my-post.md` becomes
`/blog/2026/my-post/`.

Use `layout: post` for a normal post. Use `layout: distill` for a two-column academic style
with a sidebar and footnotes.

Add `featured: true` to pin a post to a card at the top of the blog page. A pinned post also
stays in the main list below, so it appears twice. The row reflows by count, so two or three
pinned posts look best.

Separate the words in `tags` and `categories` with spaces. Each word gets its own archive
page, such as `/blog/tag/single-cell/`. To show filter links at the top of the blog page, list
the words you want in `display_tags` and `display_categories` in `_config.yml`.

## Add a travel journal

Copy [`_travel/_template.md`](_travel/_template.md) to a file such as `lisbon.md`, and put the
photographs in `assets/img/travel/lisbon/`. The cards sort on the `date` field, newest first.

Set `place`, `date` and `img` in the front matter. The `img` value becomes the cover
photograph on the card. A journal without an image still works, and its card shows text only.

The template holds the markup for a wide photograph, a row of three photographs, captions
and quotations.

## Edit the CV

[`assets/json/resume.json`](assets/json/resume.json) is the only source of the CV. It follows
the [JSON Resume](https://jsonresume.org/schema/) schema. Edit that file to change the CV.

al-folio also shipped an older CV format that read `_data/cv.yml` through includes in
`_includes/cv/`. This repository removed both, so the JSON file is the one to edit.

The page renders the sections in the order the keys appear in the JSON file. To reorder the
page, reorder the keys.

Two settings control which sections appear. The `jsonresume` list in `_config.yml` names the
sections to render. Each section also needs an include of the same name in
[`_includes/resume/`](_includes/resume/). The `presentations` section needed both, so this
repository adds `_includes/resume/presentations.liquid` and a branch in
[`_layouts/cv.liquid`](_layouts/cv.liquid).

To offer the CV as a file, put the PDF in `assets/pdf/` and name it in `cv_pdf` in
[`_pages/cv.md`](_pages/cv.md). A link then appears next to the page title.

## Add a project or a repository

The projects page has two parts.

The cards at the top come from [`_projects/`](_projects/), one file for each project. Copy
[`_projects/_template.md`](_projects/_template.md) to start one. The `category` value must
match an entry of `display_categories` in [`_pages/projects.md`](_pages/projects.md), and
`importance` sorts the cards within a category, lowest first.

The cards under "All repositories" come from
[`_data/repositories.yml`](_data/repositories.yml). Add an entry with a `name`, a
`description` and a `language`. These cards render at build time and make no requests to
GitHub, so they never break. Edit a description here when it changes on GitHub.

Give each language its own colour dot by adding a rule to
[`_sass/_base.scss`](_sass/_base.scss). The class name is the language in lower case with
each run of other characters replaced by a hyphen, so `Jupyter Notebook` becomes
`.repo-lang-jupyter-notebook`. A language with no rule gets a grey dot.

## Change the titles and the social icons

The blog page carries three titles that live in different places.

| What you see                   | Where to edit                                 |
| ------------------------------ | --------------------------------------------- |
| The word in the navigation bar | `title` in [`_pages/blog.md`](_pages/blog.md) |
| The large heading on the page  | `blog_name` in `_config.yml`                  |
| The line under the heading     | `blog_description` in `_config.yml`           |

The navigation bar lists the pages in `_pages/` that set `nav: true`, and `nav_order` sorts
them.

[`_data/socials.yml`](_data/socials.yml) holds every social account. The `social_icons` list
in `_config.yml` limits which ones appear as icons. Leave that list empty to show them all.
Keep `scholar_userid` in the data file even when you hide its icon, because the publications
page uses it for the citation badges.

## Publish

Push to `main`. GitHub Actions builds the site and deploys it to GitHub Pages.

The workflow runs only when the push changes a file it watches, which covers every Markdown,
YAML and Liquid file and everything under `assets/`. It skips a push that changes only this
README.

## Credit and licence

This site uses the [al-folio](https://github.com/alshedivat/al-folio) theme by Maruan
Al-Shedivat and contributors, under the MIT licence. See [`LICENSE`](LICENSE). The upstream
repository holds the theme documentation, which this repository no longer carries.
