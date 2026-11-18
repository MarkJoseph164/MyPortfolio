/** Turn arbitrary text into a URL-safe slug. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Return `base` as a slug that is not already in `taken`, appending `-2`, `-3`,
 * and so on when needed. Project slugs become routes, so duplicates would
 * collapse two projects into one page and duplicate React keys.
 */
export function uniqueSlug(
  base: string,
  taken: Iterable<string>,
  fallback = "project",
): string {
  const root = slugify(base) || fallback;
  const used = new Set(taken);
  if (!used.has(root)) return root;

  let counter = 2;
  while (used.has(`${root}-${counter}`)) counter += 1;
  return `${root}-${counter}`;
}

/** Slugs that appear more than once, in the order they were first duplicated. */
export function duplicateSlugs(slugs: string[]): string[] {
  const seen = new Set<string>();
  const dupes: string[] = [];
  for (const slug of slugs) {
    if (seen.has(slug)) {
      if (!dupes.includes(slug)) dupes.push(slug);
    } else {
      seen.add(slug);
    }
  }
  return dupes;
}
