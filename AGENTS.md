<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Frontend-only: pages use `src/services/*` (mock, Promise-based) via TanStack Query hooks in `src/hooks`; never import `src/mocks` from pages — so services can later be swapped for the real REST API.
- Auth is a mock React context (`useMockAuth`) persisted in localStorage; `_authenticated` layout guards routes, `AdminOnly` guards admin pages.
- Leaflet is loaded only via lazy wrappers in `src/components/map/Maps.tsx` because it breaks SSR.
- Recharts SVG fills must use literal colors (`hex` in `lib/constants.ts`), not CSS `var()`, in Pie cells.
