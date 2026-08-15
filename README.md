# RiseSkill

Plateforme du centre de formation : vitrine publique, espace élève, back-office admin.

Monorepo pnpm : `apps/web` (Next.js, App Router), `apps/api` (NestJS + Prisma), `packages/shared` (schémas Zod partagés).

## Prérequis

- Node 20 LTS (voir `.nvmrc`)
- pnpm via Corepack : `corepack enable && corepack prepare pnpm@9.12.0 --activate`

## Démarrage

```bash
pnpm install
cp .env.example .env   # renseigner les vraies valeurs Supabase/R2 ensuite
pnpm dev
```

- Frontend : http://localhost:3000
- Backend : http://localhost:4000/api (docs Swagger sur `/docs`, health check sur `/health`)

## Règle d'architecture

Chaque module backend suit strictement le flux `Controller → Service → Repository → Prisma`, sans jamais sauter de couche. Seuls les fichiers `*.repository.ts` importent `PrismaService`. Voir `apps/api/src/modules/courses` comme référence.

## Conventions de commit

[Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, ...). Non imposé par un hook pour l'instant.
