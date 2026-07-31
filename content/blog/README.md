# BookPlume blog content — publishing checklist

This folder holds drafts for the 5–7 SEO blog posts. Nothing here is read by
Shopify — it's just the versioned source for what gets pasted into Admin.
Theme-side support lives in code, in this branch:

- `sections/main-article.liquid` — added four new block types so articles can
  show **live, real** product/collection/article data (never hardcoded):
  - `products_intro` — heading above the book picks grid
  - `product_pick` — one real product (via Shopify's product picker) rendered
    with the existing `snippets/card-product.liquid` (real cover, title,
    price, link — nothing typed in by hand) + an editorial "why it's worth a
    look" note field
  - `collection_cta` — a button linking to a real collection (via the
    collection picker)
  - `related_reading` — a link to another real blog article (via the article
    picker), for cross-linking once more posts exist
- `templates/article.anatomy-atlases.json` (and one alternate template per
  article going forward) — pre-wires the block order so you only have to pick
  products/collections/articles in the theme editor, not build the layout.

## Why products aren't hardcoded in the draft text

Shopify blog post content (the HTML you paste into Admin → Blog posts) does
**not** execute Liquid — so `{% render 'card-product' %}` typed directly into
the post body would just show up as literal text, and any book title/price
typed by hand would be unverifiable, invented data. Instead, every product,
collection, and cross-link in these posts is rendered by the section blocks
above, which pull straight from your real Shopify catalog. The draft HTML
below has an HTML comment marking exactly where each block's output will
appear once you add it in the editor.

## Publishing steps, per article

1. **Admin → Content → Blog posts → Add blog post.**
   - Title: use the title given in the draft.
   - Content: switch the editor to "Show HTML" and paste the body HTML from
     the draft file.
   - Excerpt: optional, not required (the theme falls back to the article
     body for meta description if you skip it).
2. **Search engine listing** (bottom of the post editor):
   - Page title → the "Meta title" from the draft.
   - Meta description → the "Meta description" from the draft.
3. **Theme template** (right sidebar, "Template"): pick the matching
   `article.<slug>` template. If Shopify hasn't picked it up yet, choose
   "Create new template", name it to match the file already in this branch,
   or ask to have it merged first.
4. **Featured image**: upload a cover image for the post and give it a
   descriptive **alt text** (book title + context, e.g. "Stack of anatomy
   atlases for medical students on a desk") — the theme already renders
   `article.image.alt` automatically, nothing else to configure.
5. Save, then open **Customize** on the live post:
   - In each "Product pick" block, use the product picker to choose a real
     book from the matching collection, and write a 1–2 sentence "why it's
     worth a look" note.
   - In "Collection call-to-action", pick the real collection to link to.
   - In "Related article link" blocks, pick sibling posts once they exist
     (leave blank for now — empty blocks render nothing, so it's safe to
     leave them empty until later posts are published).
6. Publish.

## What's already automatic once you publish

- **Canonical URL** — resolves from your store's primary domain
  (`canonical_url` global). If your primary domain in Admin is
  `bookplume.com`, it'll be `https://bookplume.com/blogs/.../<handle>`
  automatically — nothing to hardcode. If it's still pointing at an old
  domain, that's an Admin → Domains setting, not a theme fix.
- **Breadcrumbs + BreadcrumbList JSON-LD** — via `snippets/breadcrumbs.liquid`
  (added previously), shows Home → Blog → Post.
- **Article JSON-LD** — via `{{ article | structured_data }}`, already in
  `main-article.liquid`.
- **H1** — the post title becomes the single `<h1>` via the `title` block;
  don't add another `<h1>` in the body HTML (drafts here start at `<h2>`).

## Articles

| # | Topic | Category | Draft | Status |
|---|-------|----------|-------|--------|
| 1 | Best Anatomical Atlases for Medical Students in 2026 | Anatomy & Medical | `01-best-anatomy-atlases-2026.html` | Ready for review |
| 2 | How to Choose an Adult Coloring Book: A Guide to the Series | Coloring & Journals | — | Pending review of #1 |
| 3 | Bibles for Every Occasion: Gift, Kids' and Pocket Editions | Bible & Faith | — | Pending review of #1 |
| 4 | Best Books for Learning Spanish at Any Level | Libros en Español | — | Pending review of #1 |
| 5–7 | TBD | — | — | Pending review of #1 |
