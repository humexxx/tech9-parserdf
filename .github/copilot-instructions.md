# Copilot Instructions

## Tech Stack
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui components

## Code Style Guidelines
- Write all code, comments, and documentation in English
- Do not add unnecessary comments
- Do not use JSDoc comments
- Prefer self-documenting code with clear variable and function names
- Use TypeScript types instead of JSDoc annotations
- Keep code clean and concise

## Component Guidelines
- Use "use client" directive only when necessary (interactivity, hooks, browser APIs)
- Prefer Server Components by default
- Use functional components with TypeScript
- Implement proper error boundaries when needed

## Styling
- Use Tailwind CSS utility classes
- Follow the existing color scheme (primary: #3CBCEC / oklch(0.75 0.11 210))
- Use CSS variables from globals.css for theming
- Maintain consistent spacing and layout patterns

## Git Workflow & Commits
- Use conventional commits format: `type(scope): description`
- Always use `npm run commit` (commitizen) for guided commits
- Create feature branches from develop: `feature/name`, `fix/name`, `chore/name`
- Never commit directly to main
- Commit types:
  - `feat`: New feature (bumps MINOR version)
  - `fix`: Bug fix (bumps PATCH version)
  - `docs`: Documentation only
  - `style`: Code formatting (no logic change)
  - `refactor`: Code restructuring
  - `perf`: Performance improvements
  - `test`: Adding/modifying tests
  - `chore`: Maintenance tasks
  - `ci`: CI/CD changes
  - `build`: Build system changes
- Use `feat!:` or `BREAKING CHANGE:` in commit body for breaking changes (bumps MAJOR version)
- Keep commit messages concise and descriptive in English
