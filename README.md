This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Git Workflow

Este proyecto utiliza **Git Flow simplificado** con semantic commits y versionado automático.

### Branch Strategy

- **`main`**: Rama de producción (protegida). Cada merge genera automáticamente una nueva versión.
- **`develop`**: Rama de desarrollo principal. Todo el trabajo diario se hace aquí o en feature branches.
- **Feature branches**: Ramas temporales para nuevas funcionalidades o fixes.

### Workflow de Desarrollo

1. **Crear feature branch desde develop**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/nombre-descriptivo
   # o
   git checkout -b fix/nombre-del-bug
   ```

2. **Hacer commits semánticos**:
   ```bash
   # Opción 1: Usar commitizen (recomendado)
   git add .
   npm run commit
   
   # Opción 2: Commit manual con formato conventional
   git commit -m "feat: agregar nueva funcionalidad"
   git commit -m "fix: corregir bug en componente"
   ```

3. **Push y crear PR a develop**:
   ```bash
   git push origin feature/nombre-descriptivo
   # Crear Pull Request a develop en GitHub
   ```

4. **Cuando esté listo para release**:
   - Crear Pull Request de `develop` → `main`
   - Al mergear, semantic-release generará automáticamente:
     - Nueva versión en package.json
     - Tag de git
     - GitHub Release
     - CHANGELOG.md actualizado

5. **Sincronizar develop después del release**:
   ```bash
   git checkout develop
   git merge main
   git push origin develop
   ```

### Tipos de Commits

- `feat`: Nueva funcionalidad (incrementa versión MINOR: 1.0.0 → 1.1.0)
- `fix`: Corrección de bug (incrementa versión PATCH: 1.0.0 → 1.0.1)
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan el código)
- `refactor`: Refactorización de código
- `perf`: Mejoras de rendimiento
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento
- `ci`: Cambios en CI/CD
- `build`: Cambios en el sistema de build

**Breaking Changes**: Agregar `BREAKING CHANGE:` en el body del commit o `!` después del tipo para incrementar versión MAJOR (1.0.0 → 2.0.0):
```bash
git commit -m "feat!: cambiar API de autenticación" -m "BREAKING CHANGE: el método login ahora requiere email en lugar de username"
```

### Branch Naming Convention

- `feature/nombre-descriptivo`: Nuevas funcionalidades
- `fix/descripcion-del-bug`: Correcciones de bugs
- `chore/tarea`: Tareas de mantenimiento
- `docs/actualizacion`: Cambios en documentación

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
