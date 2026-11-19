# Changelog

## [1.0.0] - 2026-06-14
### Added
- Next.js 15 App Router monolith with clear FE/BE separation
- Backend layering: Route Handler → service → repository → model (mirrors Bun template)
- Route groups: (marketing) for public pages, (app) for authenticated pages
- NextAuth v5 skeleton (Credentials provider, swap to OAuth as needed)
- TanStack Query setup with typed API client + example hooks
- shadcn/ui-ready Tailwind config with CSS variables
- Env validation (server-only), structured logging, typed error classes
- Standardised API response helpers (ok, created, handleError)
- Docker + docker-compose (Postgres), CI workflow, Prisma seed
