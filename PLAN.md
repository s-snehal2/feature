# PLAN — showcase image editor

Next.js 15.5.28 · React 19 · shadcn/ui · Tailwind v4 · Supabase Storage

## Current state (implemented)

Single route **`/showcase-button`** (root `/` redirects to it). The page is a simple
centered **Edit** button that opens the edit dialog.

```
app/
  layout.tsx                    # <Toaster />, globals.css, root metadata
  page.tsx                      # redirect("/showcase-button")
  showcase-button/
    page.tsx                    # "use client"; open state + centered Edit button
                                # imports the dialog from features/
features/
  showcase/
    components/
      showcase-edit-dialog.tsx  # the whole upload/replace/delete dialog
    lib/
      constants.ts              # galleryOptions, STORAGE_*, ALLOWED_*, ACCEPT_IMAGE_ATTR, getColors, getQualities
      filename.ts               # naming rules: normalizeShowcaseFilename, buildShowcaseFilename, isValidShowcaseFilename, isAllowedImageFile
      storage.ts                # list / upload / delete / replace (objectPath)
    types.ts                    # GalleryOption, StoredImage
components/ui/                  # shadcn: alert-dialog, badge, button, card,
                                # carousel, dialog, input, label, select, sonner
lib/
  utils.ts                      # cn()
  supabase/client.ts            # browser client (Storage access only)
  supabase/env.ts               # URL + publishable/anon key lookup
```

> **Structure:** feature-based. Non-React logic lives in `features/<name>/lib`,
> components in `features/<name>/components`, shared types in `features/<name>/types`.
> `components/ui` holds shadcn primitives only; `lib/` holds generic helpers
> (Supabase client, `cn()`). Next's private `_components` convention is unused
> here because the route page has no private components of its own.

**Routes** — `/`, `/_not-found`, `/showcase-button`.
**Verify** — `pnpm lint` → clean; `pnpm build` → success; `tsc --noEmit` → clean.

## Confirmed decisions

- **No auth** — anyone can view **and** edit. No login, no roles, no `middleware.ts`.
- Editing is unconditional: the dialog has no `canEdit` guard.
- View/carousel, header bar, card/slider/bookmatch content and PDF flow were all
  removed. The page is just the Edit button.
- Changes were scoped to `natural3` originally; that route was later folded into
  `/showcase-button` and `app/natural3/**` is **deleted**.

## Behaviour

1. Colour ▾ / Quality ▾ — mutually linked; changing one re-picks the first valid
   partner option so the pair always exists.
2. **Upload** — single multi-file picker, `.png/.jpg/.jpeg/.webp`, **max 5 MB** each,
   per-file errors reported in a pending list.
3. **Filename is kept as-is** (`targetName = file.name`), validated as uppercase
   `COLOR-QUALITY-NN.ext` for the *selected* colour/quality. No auto-rename, no
   sequence auto-numbering.
4. **Duplicates** are skipped (reported); **replace** = delete → upload.
5. **Delete** requires confirmation via shadcn `AlertDialog`.
6. Stored images are filtered to the selected colour/quality; the pending list is
   cleared when the selection changes.

### Gallery (static, `features/showcase/lib/constants.ts`)

| Color | Quality | Quantity |
|-------|---------|----------|
| EXOTIC | ACQUA BELLA | 904 |
| EXOTIC | ALPHINE WHITE | 789 |
| WHITE | AMETHYST WHITE | 6576 |

Example: `EXOTIC-ACQUA-BELLA-01.PNG` — spaces → `-`, uppercase, serial ≥ 2 digits,
regex-verified. Extension must be uppercase `PNG|JPG|JPEG|WEBP`.

### Storage

- Bucket **`qual-info`**, folder **`images/`** → `qual-info/images/EXOTIC-ACQUA-BELLA-01.PNG`
- Public bucket; policies `qual_info_public_read` / `_insert` / `_update` / `_delete` on
  the `public` role → **anyone with site access can upload, replace and delete**.

## Supabase

Own project **`qtzaoyoxpootcpkgsycg`** (`https://qtzaoyoxpootcpkgsycg.supabase.co`).
`.env` / `.env.local` hold only `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

> ⚠️ An earlier attempt migrated the wrong project (`ipiguiegymrirkqzuxlq`);
> those changes were fully reverted.

The app talks to **Storage only** — `lib/supabase/env.ts` + `lib/supabase/client.ts`.
No runtime DB client, no server-side Supabase session code.

## History (migration timeline)

Roles were added and then removed: draft (everyone can edit) → auth + `public.profiles`
+ `marketing` role → **auth removed again** (final model).

Drizzle owned the migrations; all are now **applied and the SQL files deleted**:

| Migration | Effect |
|-----------|--------|
| `drizzle/0000_*.sql` | created `public.profiles` (FK → `auth.users`) |
| `drizzle/0001_profiles_security.sql` | RLS, role check, `handle_new_user()` trigger |
| `drizzle/0002_storage_policies.sql` | bucket `qual-info` public read; writes for `marketing` |
| `drizzle/0003_revert_auth.sql` | public insert/update/delete policies; dropped trigger, `handle_new_user()`, `is_marketing()` |
| `drizzle/0004_*.sql` | `DROP TABLE "profiles"` (the generated `DROP TABLE "auth"."users"` line was stripped by hand so Supabase's `auth.users` survives) |

**Verified DB state:** `auth.users` intact; `public.profiles` dropped; helper
functions/trigger dropped; bucket `qual-info` public with the four `qual_info_*` policies.
Migrations recorded in `drizzle.__image_viewer_migrations` on `qtzaoyoxpootcpkgsycg`.

## Cleanup performed

- **Routes removed:** `app/api/`, `app/component/`, `app/components/`,
  `app/gallery-screen/`, `app/home/` … `app/home-v7/`, `app/natural/`,
  `app/natural2/`, `app/natural3/`, `app/test/`, `app/login/`.
- **Files removed:** `middleware.ts`, `hooks/use-role.ts`, `hooks/use-mobile.ts`,
  `lib/supabase/server.ts`, `db/index.ts`, `drizzle.config.ts`, `db/`, `drizzle/`,
  `supabase/`, `app/natural3/showcase/*`, `app/natural3/lots/*`.
- **Unused assets:** `public/acqua-bella/`, `public/cmc-images/`, `public/images/`,
  various logos/svgs; only `public/ui/` remains (referenced by legacy `data.ts`, now removed).
- **Unused modules:** ~43 `components/ui/*` pruned; `type.ts`, `convertimagetopdf.ts`,
  `pdfviewer.tsx` deleted.

## Known loose ends

- `package.json` still declares `db:generate` / `db:migrate` / `db:push` / `db:studio`,
  but **`drizzle.config.ts` and `db/`/`drizzle/` are gone** → those scripts now fail.
  Either restore a `drizzle.config.ts` or drop the scripts (and the `drizzle-kit`,
  `drizzle-orm`, `postgres` deps).
- `tsconfig.tsbuildinfo` is present; regenerated by tsc/build.
- Several unused runtime deps remain (`jspdf`, `pdf-lib`, `react-pdf`, `pptx-to-pdf`,
  `recharts`, `framer-motion`, …) — left as-is to avoid churn.
- `app/showcase-button/components/` is colocated under `app/`; fine for now, but could
  move to the root `components/` folder if more pages appear.
