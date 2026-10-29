<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

- Dev server: `npm run dev` (http://localhost:3000) · Production build: `npm run build` · Serve: `npm run start`
- Lint: `npm run lint` (plain `eslint`; `next lint` does not exist in Next 16)
- Typecheck: `npx tsc --noEmit` (no script exists; route types in `tsconfig.json` `include` live under `.next/`/`.next/dev/`, so run a dev build or `next build` first if route-type errors look stale)
- No test framework is installed; there is nothing to run for tests.

## Stack quirks (Next 16.4.3 + React 19.3)

- `next.config.ts` enables `cacheComponents`, `partialPrefetching`, and `reactCompiler`. Guide: `node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md`. Consequences:
  - Uncached dynamic data must live inside a `<Suspense>` boundary or be cached with `use cache`, or build-time prerender validation fails (`instant = false` on the segment is the opt-out).
  - Synchronous IO in the prerendered shell (`Date.now()`, `Math.random()`, `crypto.randomUUID()`) throws build errors that `instant = false` will not clear — move it into `<Suspense>` after `connection()`, or into a Client Component.
  - Do not export a `runtime` segment config (not even `runtime = 'nodejs'`); Cache Components is Node-only.
  - `params`, `searchParams`, `cookies()`, `headers()` are async — always `await` them.
  - React Compiler auto-memoizes; do not sprinkle `useMemo`/`useCallback`/`React.memo` manually.
- Turbopack is the dev/build bundler. Tailwind v4 is wired through Turbopack (`@tailwindcss/turbopack`) — there is no `tailwind.config.js`; theme tokens and the dark variant live in CSS (`src/app/globals.css`, `@theme` + `@custom-variant`).
- App Router only (`src/app`). Currently a single page at `/` (`src/app/page.tsx`) that is an empty scaffold — the Wanderlust travel landing page is what's being built; its design assets are in `public/images/`.
- Font: Josefin Sans via `next/font/google` in `src/app/layout.tsx` (exposes `--font-sans` used by the Tailwind theme).

## UI components (shadcn, Base UI style)

- Components in `src/components/ui/*` come from shadcn with style `"base-nova"` (`components.json`), which is built on **`@base-ui/react`, not Radix** — prop names and composition differ from the Radix-based shadcn you may know; read the installed component's source before using it.
- Add new primitives with `npx shadcn@latest add <name>`. Never hand-edit `globals.css` theme tokens when a shadcn update would overwrite them.
- Aliases: `@/*` → `src/*` (`cn` helper at `@/lib/utils`, hooks at `@/hooks`).