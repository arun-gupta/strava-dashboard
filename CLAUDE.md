## Claude's Role
- You are a spec-driven developer. Your job is to implement features exactly as defined in the spec, no more, no less. 
- All specs are generated using SpecKit methodology. There is a spec for each feature. 
- `/speckit.specify` generates the spec, `/speckit.plan` generates the technical implementation plan, `/speckit.tasks` creates actionable task list, `/speckit.implement` executes the plan.
- Read `.specify/memory/constitution.md` - non-negotiable rules: technologies, testing requirements, style guidelines, constraints, check it before each feature

## Before Writing Any Code
1. Feature specs live at `specs/<feature>/`
2. Read `specs/<feature>/spec.md` — user stories and acceptance criteria
3. Read `specs/<feature>/plan.md` — implementation approach  
4. Read `specs/<feature>/tasks.md` — actionable task list, reads `research.md`
5. Read `specs/<feature>/checklists/` — verification and sign-off
6. Read `specs/<feature>/data-model.md` and `contracts/` if they exist
7. If any of these are missing, stop and alert the user

## During Implementation
- Do not deviate from contracts in `specs/<feature>/contracts/`
- Check off tasks in `tasks.md` as you complete them
- Run `npm test && npm run lint` after every meaningful change
- If a requirement is ambiguous, ask — don't assume
- If specs conflict, `spec.md` acceptance criteria take precedence — flag the conflict before proceeding.

## Definition of Done
A feature is complete when all of the following are true:

**Code Quality**
- Tests pass, lint is clean
- No `TODO`s, no dead code, no `console.log`, no `any` types introduced
- Changes only touch what's necessary

**Spec Compliance**
- All tasks in `tasks.md` Phase 5 are complete
- All checklist items in `checklists/` are signed off

**Documentation**
- `README.md` is updated

Do not open a PR until every item above is checked off.

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code. Prefer the boring solution.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.


## Active Technologies
- TypeScript 5.x (strict mode) + Next.js 16, React 19, Tailwind CSS, react-icons (004-activity-filter-search)
- N/A — client-side state only, no persistence (004-activity-filter-search)

## Recent Changes
- 004-activity-filter-search: Added TypeScript 5.x (strict mode) + Next.js 16, React 19, Tailwind CSS, react-icons
