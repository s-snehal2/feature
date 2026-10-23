# PLAN — showcase-edit-dialog-2

Next.js 15.5.28 · React 19 · shadcn/ui · Tailwind v4 · Supabase Storage · @dnd-kit

> This document covers the **v2** editor (`showcase-edit-dialog-2`). The older
> v1 dialog and its route are described in the root `PLAN.md` and are kept for
> reference only.

## Overview

The editor is a **fullscreen** dialog for managing the showcase image set stored
in Supabase Storage. For a chosen colour + quality it lets you:

1. queue local files, preview them, reorder them, and upload (serials follow the
   arranged order);
2. browse the already-stored images, preview them, delete them, and **rearrange
   them** (renaming the stored objects so their serials match the new order).

## Entry points & routes

```
app/
  page.tsx                       # redirect("/showcase-button-2")
  showcase-button-2/page.tsx      # "use client"; <ShowcaseEditDialog2 open onOpenChange />
  showcase-button/page.tsx        # legacy v1 route (kept)
```

`features/showcase/components/showcase-edit-dialog-2.tsx` is the composition
shell: it wires the hook to the presentational components and renders the nested
delete + preview dialogs.

## Architecture / file map

```
features/showcase/
  components/
    showcase-edit-dialog-2.tsx    # shell; hook wiring + composition (~180 lines)
    showcase-selection.tsx        # colour + quality selects
    upload-controls.tsx           # file picker + "replace existing" switch
    pending-upload-grid.tsx       # header/Clear + DndContext over pending tiles
    sortable-thumbnail.tsx        # draggable pending tile (whole tile = handle)
    stored-image-list.tsx         # stored rows + Rearrange mode (DndContext)
    sortable-stored-row.tsx       # draggable stored row (grip handle)
    image-preview-dialog.tsx      # lightbox with prev/next + arrow keys
    delete-image-dialog.tsx       # nested AlertDialog for delete confirmation
  hooks/
    use-showcase-editor.ts        # all state + side effects (the state machine)
  lib/
    constants.ts                  # galleryOptions, STORAGE_*, ACCEPT_IMAGE_ATTR, getColors, getQualities
    filename.ts                   # buildShowcaseFilename, isValidShowcaseFilename, isAllowedImageFile
    upload.ts                     # formatSize, getFileExtension, buildTargetName
    storage.ts                    # list / upload / delete / replace / move / reorder
  types.ts                        # GalleryOption, StoredImage, PendingUpload, PreviewItem
```

**Layer rule:** `lib/` = pure logic + Supabase I/O (no React); `hooks/` = React
state/effects; `components/` = rendering only. `components/ui/*` are shadcn
primitives, untouched.

## Naming rules

- `buildShowcaseFilename(color, quality, seq, ext)` → uppercase,
  e.g. `EXOTIC-ACQUA-BELLA-01.PNG`; serial is 2-digit, 1-based, and is the
  **position in the arranged list**.
- Extension is preserved from the source file (uppercased).
- `isValidShowcaseFilename(name, color, quality)` filters the stored list to the
  selected colour/quality.

| Color | Quality | Quantity |
|-------|---------|----------|
| EXOTIC | ACQUA BELLA | 904 |
| EXOTIC | ALPHINE WHITE | 789 |
| WHITE | AMETHYST WHITE | 6576 |

## Storage

- Bucket **`qual-info`**, folder **`images/`** → `qual-info/images/EXOTIC-ACQUA-BELLA-01.PNG`.
- Public bucket; public read/write policies. No DB/table — **order is derived from
  the filename serial**.
- `listShowcaseImages()` appends a cache-buster `?v=<updated_at>` to each public
  URL so replaced/renamed files are not served stale.
- `uploadShowcaseFile` (`upsert:false`), `deleteShowcaseFile`,
  `replaceShowcaseFile` (delete → upload), `moveShowcaseFile`
  (`storage.move`).
- **Original filename** is persisted as object metadata
  (`upload(..., { metadata: { originalName: file.name } })`). Because `list()`
  does **not** return custom metadata (Supabase issue #759), it is read back per
  file via the **Info endpoint** — `getOriginalNames()` → `info(path)` →
  `data.metadata.originalName` (see `getOriginalNames` in `storage.ts`), then
  merged into the displayed list by the hook. This lives in Supabase Storage —
  **no DB table / migration**. `move` preserves it during reorder. Files
  uploaded before this feature have no metadata → shown as "—" (no backfill
  possible; the original was never recorded).

## Runtime flows

### Open
`open` effect → `refreshStored()`; pending queue + preview + rearrange are reset.

### Selection
Colour ▾ and Quality ▾ are mutually linked (`handleColorChange` /
`handleQualityChange`). Changing either resets the pending queue, preview and
rearrange mode (generated names depend on the selection).

### Add files
`addFiles` validates type via `isAllowedImageFile`, creates object URLs for
previews, and appends `PendingUpload` items with status `ready`.

### Reorder pending
`pending-upload-grid` owns the `DndContext` (`rectSortingStrategy`); on drop it
calls `reorder(arrayMove(...))`. Serials update live because
`buildTargetName(color, quality, index, file)` is computed from the current index.

### Upload
`handleUpload` walks the pending list in order and for each item:
- if the name already exists and **replace is off** → `skipped`;
- if it exists and **replace is on** → `replaceShowcaseFile`;
- otherwise → `uploadShowcaseFile`.
Download-style status is tracked per item (`uploading/done/error`); a summary
toast is shown; only failed items are kept for retry; `refreshStored()` runs after.

### Rearrange stored (rename on storage)
Available via the **Rearrange** button, which appears only when a colour **and**
quality are selected and the group has **2+ images** (`canRearrange`).

- `startRearrange()` seeds `draftOrder` from `filteredStored`; the list switches
  to sortable rows and shows Save/Cancel.
- `moveStored(from,to)` uses `arrayMove`.
- `saveRearrange()` calls `reorderShowcaseImages(draftOrder, color, quality)` in
  `storage.ts`, which performs a **two-phase rename**:
  1. park every file under a unique temp name (`__tmp_<ts>_<i>.<EXT>`);
  2. promote temp files to their final `COLOUR-QUALITY-<NN>.<EXT>` names.
  On error, already-applied moves are reversed best-effort. Then `refreshStored()`,
  exit mode, success toast. `cancelRearrange()` discards the draft.

### Preview (before and after upload)
Each section header has a bulk **Preview** button (beside **Clear** for pending,
beside **Refresh** for stored) that opens at the first image and lets you page
through the whole group. Per-image Eye buttons were removed.

- pending → local `blob:` URL (`item.previewUrl`);
- stored → public cache-busted URL (`image.url`).

The dialog shows the image large with a title (generated name + `Original:` line),
**Prev/Next** (disabled at the ends) and **ArrowLeft / ArrowRight** keys; it is a
nested `Dialog` (same pattern as the nested delete `AlertDialog`). Preview state
lives in the hook (`preview: { items: PreviewItem[]; index: number } | null`) and
is cleared on reset/selection change so a revoked blob URL is never shown.

### Filenames on screen
- Pending tiles show `Original: <file.name>` and `Saved as: <generated>`, both
  wrapped (`break-all`, not truncated).
- Stored rows show the generated name, an `Original:` line (resolved via
  `info()`), and the storage path.

### Delete
`handleDelete` → confirmation `AlertDialog` → `confirmDelete` deletes the object,
mutates the list, toasts.

## Dependencies

- `@dnd-kit/core@6.3.1`, `@dnd-kit/sortable@10.0.0`, `@dnd-kit/utilities@3.2.2`
  (reordering only — drag-*drop upload* was intentionally removed).
- shadcn `dialog`, `alert-dialog`, `button`, `badge`, `select`, `label`, `sonner`.

## Verify

```
npx.cmd tsc --noEmit
& pnpm.cmd lint
& pnpm.cmd build
```

(On Windows PowerShell use `& pnpm.cmd ...` — `pnpm.ps1` is blocked by policy.)

## Known loose ends

- v1 route `/showcase-button` and `showcase-edit-dialog.tsx` are kept but unused
  by v2.
- "max 5 MB" is stated in the copy but **not enforced** in code.
- `normalizeShowcaseFilename` in `filename.ts` is unused by dialog-2.
- Reorder renames in place; a mid-operation network failure relies on the
  best-effort rollback (no transactional guarantee across objects).
- Files uploaded before the `originalName` metadata change show `Original: —`
  until they are re-uploaded/replaced.
