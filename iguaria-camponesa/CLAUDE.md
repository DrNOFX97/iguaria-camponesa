# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the `iguaria-camponesa/` subdirectory:

```bash
npm run dev        # Dev server with HMR (Vite)
npm run build      # Production build → dist/
npm run preview    # Preview production build
npm run lint       # ESLint check
```

## Environment Setup

Requires `.env.local` in `iguaria-camponesa/` with:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

See `.env.example` for the template. The Supabase client in `src/lib/supabase.js` includes a fallback stub so the app loads without crashing if env vars are missing, but database operations will fail.

## Architecture

**Iguaria Camponesa** is a restaurant management SPA (React 19 + Vite + Supabase) with two distinct sections:

### Public Site (`src/components/`)
Single-page landing with smooth scroll sections: Hero → PratosDodia → Galeria → Sobre → Reservas → Footer. All public, no auth required.

### Admin Dashboard (`src/admin/`)
Protected area requiring Supabase email/password auth. Routes live under `/admin/*` and wrap inside `AdminLayout.jsx` (sidebar nav). Components map 1:1 to Supabase tables.

### Routing (`src/App.jsx`)
- `/` → public `HomePage` (assembles all `src/components/`)
- `/admin/login` → `Login.jsx`
- `/admin/*` → `AdminLayout.jsx` which renders child admin pages

### Data Layer
No backend API — all data ops go directly through `@supabase/supabase-js` client. Pattern: `.from('table').select/insert/update/delete()`. Photo uploads go to Supabase Storage bucket `galeria`.

## Database Schema

Five tables in Supabase PostgreSQL:

| Table | Purpose |
|-------|---------|
| `reservas` | Customer bookings (nome, data, hora, pessoas, estado: Pendente/Confirmada/Cancelada) |
| `pratos` | Full menu (nome, descricao, preco, categoria, ativo, ordem) |
| `pratos_do_dia` | Daily specials — links `pratos` to a specific `data` |
| `galeria` | Photo metadata (url, storage_path, destaque, ordem) |
| `calendario` | Per-date availability (estado: Disponível/Lotado/Fechado) |

RLS policies: public can insert `reservas` and read `galeria`/`calendario`; everything else requires auth.

Full schema with RLS policies in `supabase-schema.sql` at repo root.

## Styling

Tailwind CSS with a custom palette defined in `tailwind.config.js`:
- `dourado` — gold tones (primary accent)
- `bordeaux` — burgundy/wine (secondary)
- `creme` — warm cream (backgrounds)

Global styles and a CSS grain texture are in `src/index.css`. Animations use Framer Motion.
