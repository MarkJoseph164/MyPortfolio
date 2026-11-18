# Mark Joseph Alborez — Portfolio

Personal portfolio built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

One content file (`content/site.json`) feeds the whole site: the home page, the
project pages, the web CV, and the generated CV PDF. Add a project once and it
appears everywhere, including the CV.

## Run it

```powershell
npm.cmd install
npm.cmd run dev
```

Open http://localhost:3000. On PowerShell, `npm` may be blocked by the execution
policy — use `npm.cmd`.

## Edit content

- **In the browser:** http://localhost:3000/admin — structured editor for profile,
  projects, experience, education, skills, and certifications. Saves straight to
  `content/site.json` in development. Every field on the CV (summary, skills,
  education, experience, languages, strengths) is editable there, so you never
  touch code to update it.
- **Experience is intentionally empty.** Use **Add role** in `/admin`. The CV
  section appears automatically once the first role exists, and disappears if you
  delete them all.
- **Portfolio link on the CV:** set **Portfolio / website URL** in `/admin`, or
  leave it empty and it uses `NEXT_PUBLIC_SITE_URL` (i.e. the deployed site URL).
- **On the deployed site:** the same `/admin` page commits `content/site.json` to
  GitHub, which triggers a Vercel redeploy. Requires `ADMIN_PASSWORD`,
  `GITHUB_TOKEN`, and `GITHUB_REPO` environment variables (see `.env.example`).
- **By hand:** edit `content/site.json`. The shape lives in `lib/types.ts`.

Adding a project automatically puts it on the home page (if featured), the
projects page, its own `/projects/<slug>` page, the CV page, and the CV PDF.

## Project status badges

Each project has a `status` field:

| value | badge |
| --- | --- |
| `auto` | probes the project URL — **Live** if it responds, **Paused** if not |
| `live` | Live |
| `paused` | Paused |
| `offline` | Offline |
| `archived` | Archived |
| `wip` | In progress |

`auto` calls `/api/status?url=…`, which is limited to URLs that exist in
`content/site.json` (no arbitrary fetching), times out after 7 seconds, and
recognises Vercel's paused-deployment response (HTTP 402/503 /
`DEPLOYMENT_PAUSED`). Results are cached for 30 seconds, and the badge re-checks
when the tab regains focus and every 60 seconds while the page stays open.

Lakbay, BookMark, and PayCore are set to `auto` with their live URLs, so each
badge follows its own deployment without editing anything.

## CV

- Web version: `/cv`
- Generated PDF: `/cv.pdf` (built with `@react-pdf/renderer`, one page)
- Print stylesheet is included, so Ctrl+P also works

The PDF is regenerated whenever the content changes and the site redeploys.

## Deploy to Vercel

1. Create the GitHub repo and push this folder.
2. On Vercel: **Add New → Project → Import** the repo. Framework is detected
   automatically; no build settings to change.
3. Add environment variables from `.env.example` (at minimum
   `NEXT_PUBLIC_SITE_URL`; add the admin ones if you want to edit in production).
4. Deploy, then open the live URL and check `/cv.pdf`, `/admin`, and the status
   badges.

## Structure

```
app/
  page.tsx                 home
  projects/                project list + detail pages
  cv/page.tsx              web CV
  api/cv/route.tsx         generated CV PDF
  api/status/route.ts      live/paused checker
  api/content/route.ts     read + save content
  admin/page.tsx           content editor
  sitemap.ts, robots.ts, opengraph-image.tsx
components/                UI pieces, CV PDF document
content/site.json          single source of truth
lib/                       types, content access, status probing
public/projects/           screenshots
```
