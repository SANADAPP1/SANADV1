<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Backend is the owner's external Supabase project, never Lovable Cloud — the owner chose to keep data in their own account.
- UI is Arabic-first with `dir="rtl"` on `<html>`; use logical utilities (`ms-/me-/start/end`) rather than left/right so a future French LTR mode works.
- Public marketing pages wrap content in `PublicPage` (src/components/site); signed-in role dashboards will live under `src/routes/_authenticated/` once auth exists.
- Brand UI icons come from one icon-pack image cropped via `BrandIcon`; add new icons there instead of new image files.
- Money amounts render with the `num` utility and `formatDZD` so digits stay Latin and LTR inside RTL text.
