# Estructura propuesta del proyecto — Angular 21 (Standalone) + TypeScript

Objetivo: proponer una estructura escalable y coherente para un proyecto mediano usando Angular 21 (orientado a componentes standalone), Tailwind, persistencia en memoria (MVP) y principios SOLID.

Principios guía

- Mantener SRP: cada módulo/carpetas tiene responsabilidad única.
- DIP/OCP: código dependerá de interfaces; adaptadores concretos (repositorios) se inyectan.
- YAGNI: no implementar métodos innecesarios; añadir solo lo requerido por MVP.
- Tailwind: estilos con utilidades; estilos globales mínimos.

Top-level (repositorio)

- angular.json
- package.json
- tsconfig.json
- tailwind.config.js
- postcss.config.js
- README.md
- technical/ (documentación técnica)
- src/
- e2e/

src/ (app frontend)

src/
├─ app/
│ ├─ main.ts # bootstraps the standalone AppComponent via `bootstrapApplication`
│ ├─ app.component.ts # `AppComponent` (standalone)
│ ├─ core/ # Singletons, providers globales, interceptors
│ │ ├─ services/ # Implementaciones Angular de servicios (IdService, UnitOfWork)
│ │ ├─ repositories/ # Interfaces de repositorio (abstracciones)
│ │ ├─ models/ # Modelos / types compartidos si necesarios (re-export desde technical/interfaces)
│ │ └─ guards/ # Guards, auth (si aplica)
│ ├─ shared/ # Componentes/pipes/directives reutilizables y utilidades
│ │ ├─ components/ # botones, inputs, layout primitives
│ │ ├─ pipes/
│ │ └─ directives/
│ ├─ features/ # Feature modules (lazy-loaded cuando aplica)
│ │ ├─ materials/ # Feature module: MaterialModule
│ │ │ ├─ pages/ # pages: list, detail, edit
│ │ │ ├─ components/ # presentational components usados solo por este feature
│ │ │ ├─ services/ # Angular services específicos (adaptadores a repositorios)
│ │ │ └─ materials-routing.module.ts
│ │ ├─ recipes/
│ │ ├─ products/
│ │ ├─ inventory/
│ │ └─ build/ # "¿Qué puedo armar?" feature
│ ├─ pages/ # Página-síntesis de nivel superior (landing, dashboard)
│ ├─ components/ # Componentes de uso amplio dentro de app (no global)
│ ├─ environment/ # environment.ts, environment.prod.ts
│ └─ styles/ # estilos globales, tailwind imports
├─ assets/
└─ main.ts

Notas sobre diseño y lazy-loading (Standalone)

- Uso de Angular 21: preferir componentes standalone en todo el proyecto. No se crearán NgModules para nuevas features.
- Cada feature se organiza como un conjunto de `standalone` components y servicios locales. El enrutamiento y lazy-loading se hace con `loadComponent`/rutas que importan componentes mediante import dinámico.
- Lazy-load usando `loadComponent: () => import('./...').then(m => m.FeatureComponent)` o rutas con `providers` locales cuando haga falta.

Servicios y capa de dominio (core)

- `core/services/` contendrá adaptadores que implementan las interfaces descritas en `technical/services`.
  - `material.service.ts` (Angular wrapper que usa `MaterialRepository`)
  - `recipe.service.ts` etc.
- `core/repositories/` contendrá las interfaces (TypeScript) y en `infrastructure/in-memory/` las implementaciones concretas para el MVP.
- En Angular 21 los providers para implementaciones concretas se registran en `main.ts` dentro del llamado a `bootstrapApplication(...)` o usando `provideXxx()`; no se depende de `AppModule`.
- `technical/interfaces/` mantiene los tipos definitivos; `src/app/core/models` puede re-exportar/consumirlos.

Infrastructure / adaptadores

- `src/app/infrastructure/in-memory/`:
  - `material-repo.memory.ts`
  - `recipe-repo.memory.ts`
  - `product-repo.memory.ts`
  - `event-repo.memory.ts`
  - `id-service.nanoid.ts` (IdService con nanoid)
- Estas implementaciones cumplen las interfaces definidas en `core/repositories` y se registran como providers en `main.ts` cuando se llama a `bootstrapApplication(...)` para el MVP.

Testing

- De momento **no se implementarán tests** en el MVP. Las pruebas unitarias e de integración se planificarán e introducirán en fases posteriores, cuando la aplicación tenga persistencia real y mayor alcance.
- Cuando se habiliten tests se recomienda:
  - Tests unitarios junto a archivos (`*.spec.ts`) para services y utilidades.
  - Tests de integración para `BuildService` y `InventoryService` usando las implementaciones en memoria o mocks.

Folder for technical/implementations and seeds

- `technical/implementations/in-memory/` — ejemplo de adaptadores TypeScript y demo script.
- `technical/seeds/` — JSON con ejemplos de materiales, recetas y productos para cargar en memoria durante demos.

Naming conventions

- Files: `kebab-case` (e.g., `materials-list.component.ts`).
- Classes: `PascalCase` (e.g., `MaterialService`).
- Interfaces/Types: `PascalCase` (no usar prefijo `I`): `Material`, `CreateMaterialDTO`.
- Components: `*.component.ts`, modules: `*.module.ts`.

State management

- No usar NgRx para MVP (complejidad). Preferir servicios inyectables y Observables/Subjects para compartir estado.
- Documentar migración a NgRx en `technical/MIGRATION.md` si se decide escalar.

Styling

- Tailwind: incluir `tailwind.config.js` y añadir en `src/styles.css` las directivas `@tailwind base; @tailwind components; @tailwind utilities;`.
- El proyecto deberá tener Tailwind instalado como dependencia y usaremos las utilidades y componentes de Tailwind para diseñar la UI (estilos y componentes basados en Tailwind).
- Mantener componentes presentacionales pequeños y reutilizables.

Build & scripts (package.json)

- `start` — `ng serve`
- `build` — `ng build`
- `test` — `ng test`
- `lint` — `ng lint`
- `demo:seed` — script para cargar seeds en el repositorio en memoria (opcional)

Documentación adicional a crear (siguientes pasos)

- `technical/SETUP.md` — pasos para levantar el proyecto, instalar dependencias, configurar Tailwind.
- `technical/implementations/in-memory/README.md` — cómo funcionan los repositorios en memoria y cómo ejecutar el demo.
- `technical/MIGRATION.md` — guía para migrar a persistencia real.

Ejemplo de árbol simplificado

src/app/
core/
services/
repositories/
models/
shared/
components/
features/
materials/
pages/
components/
services/
recipes/
products/
inventory/
build/
infrastructure/
in-memory/
pages/
components/
styles/

---

Esta estructura prioriza modularidad, testabilidad, y la separación de responsabilidades. Si querés, puedo generar una plantilla de `AppModule` y un ejemplo de `material-repo.memory.ts` y `id-service.nanoid.ts` para arrancar el prototipo.
