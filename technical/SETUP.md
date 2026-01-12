# SETUP — Instalación, dependencias y comandos útiles

Este documento recoge los pasos mínimos para empezar el proyecto (Angular 21, TypeScript, Tailwind) y la configuración mínima recomendada de ESLint para mantener calidad de código.

Requisitos locales

- Node.js v18+ (recomendado) o v20
- npm (incluido con Node) o `pnpm`/`yarn`
- Git (opcional)

Dependencias importantes

Dependencias (runtime)

- `@angular/core@21`, `@angular/common@21`, `@angular/router@21` — framework Angular 21.
- `nanoid` — generación de IDs.

Dependencias de desarrollo (recomendadas)

- `@angular/cli` — herramientas Angular (local devDependency).
- `typescript` — tipado (usar la versión recomendada por Angular 21).
- `tailwindcss`, `postcss`, `autoprefixer` — Tailwind setup.
- `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin` — lint TypeScript.
- `@angular-eslint/eslint-plugin`, `@angular-eslint/eslint-plugin-template`, `@angular-eslint/template-parser` — reglas y parser Angular.
- `prettier`, `eslint-config-prettier` — formateo (opcional, recomendado).

Comandos para instalar (npm)

Ejemplo: crear proyecto y añadir dependencias mínimas

```bash
# inicializar package.json si aún no existe
npm init -y

# instalar Angular (paquetes runtime básicos) y nanoid
npm install @angular/core@21 @angular/common@21 @angular/platform-browser@21 @angular/platform-browser-dynamic@21 @angular/router@21 nanoid

# instalar devDependencies recomendadas
npm install -D @angular/cli typescript tailwindcss postcss autoprefixer eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin @angular-eslint/eslint-plugin @angular-eslint/eslint-plugin-template @angular-eslint/template-parser eslint-config-prettier prettier
```

Tailwind: setup rápido

```bash
# generar config de Tailwind (crea tailwind.config.cjs y postcss.config.cjs)
npx tailwindcss init -p
```

Añadir a `src/styles.css` (o `src/styles.scss`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Scripts útiles para `package.json`

- `start` — iniciar servidor de desarrollo (Angular CLI): `ng serve`.
- `build` — `ng build`.
- `lint` — `eslint "src/**/*.{ts,html}" --fix`.
- `format` — `prettier --write "src/**/*.{ts,html,css,scss,json,md}"` (si se usa Prettier).
- `demo:seed` — script ad-hoc para cargar datos de `technical/seeds/` en la implementación en memoria (crear según necesidad).

Ejemplo de `package.json` scripts

```json
"scripts": {
  "start": "ng serve",
  "build": "ng build",
  "lint": "eslint \"src/**/*.{ts,html}\" --fix",
  "format": "prettier --write \"src/**/*.{ts,html,css,scss,json,md}\"",
  "demo:seed": "node technical/implementations/in-memory/demo-seed.js"
}
```

Comandos básicos para trabajar

```bash
# instalar dependencias
npm install

# dev server
npm run start

# lint y arreglar problemas automáticos
npm run lint

# formatear con prettier (si aplica)
npm run format
```

ESLint — configuración mínima recomendada

Puntos clave:

- Usar `@typescript-eslint` para analizar `.ts`.
- Usar `@angular-eslint` para plantillas y patrones Angular.
- Mantener reglas mínimas: `no-unused-vars` (warn), `prefer-const`, `no-console` (warn), `@typescript-eslint/no-explicit-any` (warn) para no bloquear desarrollo.
- Integrar con `prettier` para evitar conflictos estilísticos.

Ejemplo mínimo de `.eslintrc.cjs` (copiar a la raíz del repo)

```js
module.exports = {
  root: true,
  ignorePatterns: ["projects/**/*", "dist", "node_modules"],
  overrides: [
    {
      files: ["*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {project: ["./tsconfig.json"], sourceType: "module"},
      plugins: ["@typescript-eslint", "@angular-eslint"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@angular-eslint/recommended",
        "prettier",
      ],
      rules: {
        "prefer-const": "warn",
        "no-console": "warn",
        "no-unused-vars": "warn",
        "@typescript-eslint/no-explicit-any": "warn",
      },
    },
    {
      files: ["*.html"],
      parser: "@angular-eslint/template-parser",
      plugins: ["@angular-eslint/template"],
      extends: ["plugin:@angular-eslint/template/recommended"],
      rules: {},
    },
  ],
};
```

Notas sobre ESLint

- Esta configuración es intencionalmente conservadora para el MVP: alerta en lugar de error para no frenar el desarrollo.
- Más adelante, cuando se estabilice la base de código, subir reglas a `error` y habilitar CI para `npm run lint`.
- Si se usa `prettier`, agregar `eslint-config-prettier` para evitar conflictos.

Siguientes pasos recomendados

- Crear `technical/implementations/in-memory/` con un script `demo-seed.js` que cargue JSONs de `technical/seeds/`.
- Opcional: crear archivo `.eslintrc.cjs` en la raíz con el contenido de ejemplo.
- Añadir `technical/SETUP.md` (este archivo) en el repo (ya creado).

Si querés, puedo:

- crear el archivo `.eslintrc.cjs` en la raíz con la configuración de ejemplo,
- generar `technical/implementations/in-memory/demo-seed.js` y un `technical/seeds/` con ejemplos,
- o generar plantillas de `main.ts` y `app.component.ts` (standalone) para Angular 21.

Indica cuál de esas acciones quieres que haga a continuación.
