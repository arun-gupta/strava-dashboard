# Implementation Plan: Strava OAuth Login

**Branch**: `001-strava-oauth-login` | **Date**: 2026-03-25 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-strava-oauth-login/spec.md`

## Summary

Implement Strava OAuth 2.0 authentication using NextAuth.js with the Strava provider. Athletes authenticate via Strava, receive a secure server-side session, and are redirected to the dashboard. The implementation covers the full auth lifecycle: first-time login, returning user session persistence, token refresh, logout, and route protection.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 15 (App Router), NextAuth.js v5, Tailwind CSS
**Storage**: Server-side session (JWT or database session — see research.md)
**Testing**: Vitest + React Testing Library (unit), Playwright (e2e)
**Target Platform**: Web browser (desktop + mobile), deployed on Vercel
**Project Type**: Web application
**Performance Goals**: Login flow completes in under 30 seconds; returning users reach dashboard in under 2 seconds
**Constraints**: Strava access tokens expire every 6 hours; refresh tokens must be handled server-side; secrets never exposed to browser
**Scale/Scope**: Single athlete per session; personal dashboard

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| Webapp-First (Next.js 15, TypeScript) | ✅ Pass | Using Next.js App Router with TypeScript strict mode |
| Auth via NextAuth.js | ✅ Pass | Strava OAuth handled exclusively through NextAuth.js |
| Test-First (TDD) | ✅ Pass | Tests will be written before implementation code |
| Testing Layers (Vitest + Playwright) | ✅ Pass | Unit tests for auth logic, e2e for full login flow |
| Simplicity (one repo, no premature abstraction) | ✅ Pass | Single Next.js repo, using NextAuth.js built-in patterns |

**Constitution Check Result**: ✅ All gates pass — proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-strava-oauth-login/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
app/
├── page.tsx                        # Landing page (unauthenticated)
├── dashboard/
│   └── page.tsx                    # Dashboard (protected route)
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts            # NextAuth.js route handler
└── layout.tsx                      # Root layout with SessionProvider

components/
├── auth/
│   ├── LoginButton.tsx             # "Connect with Strava" button
│   └── LogoutButton.tsx            # Logout button
└── ui/
    └── ErrorMessage.tsx            # Auth error display

lib/
└── auth.ts                         # NextAuth.js config (Strava provider, callbacks)

middleware.ts                        # Route protection (redirect unauthenticated users)

tests/
├── unit/
│   ├── auth/
│   │   └── auth.test.ts            # Auth config and token refresh logic
│   └── components/
│       ├── LoginButton.test.tsx
│       └── LogoutButton.test.tsx
└── e2e/
    └── auth/
        └── login-flow.spec.ts      # Full OAuth login/logout Playwright tests
```

**Structure Decision**: Single Next.js App Router project. Auth logic centralized in `lib/auth.ts`. Route protection via `middleware.ts`. No separate backend — Next.js API routes handle OAuth callbacks.
