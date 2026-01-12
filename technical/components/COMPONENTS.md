# Componentes clave — guía de diseño (Angular 21, standalone)

Este documento enumera los componentes que recomendamos implementar para el MVP. Cada componente incluye: propósito, propiedades (inputs), eventos/salidas (outputs), métodos públicos principales, y notas de implementación (incluyendo que deben ser `standalone: true`).

Convenciones

- Todos los componentes deben ser `standalone` (Angular 21).
- Nombres: `PascalCase` para clases y `kebab-case` para ficheros (ej.: `materials-list.component.ts`).
- Props: `@Input()`; Eventos: `@Output()` con `EventEmitter<T>`.

---

## Pages (páginas principales)

### `MaterialsListPageComponent` (standalone)

- Propósito: mostrar listado paginado de materiales, permitir búsqueda, filtro y acciones (crear, editar, ver detalle).
- Inputs: none (consume `MaterialService` via inyección).
- Outputs: none (usa servicios o navegación).
- Métodos públicos:
  - `loadPage(page?: number): Promise<void>` — carga página de materiales.
  - `search(query: string): void` — aplica filtro de búsqueda.
  - `openCreate(): void` — navega a formulario de creación.
  - `openEdit(id: string): void` — navega a editor.
- Notas: debe exponer un observable `materials$` para la UI y `isLoading`.

### `MaterialDetailPageComponent` (standalone)

- Propósito: mostrar información detallada de un material (datos, stock, historial).
- Inputs:
  - `id: string` (ruta o Input)
- Methods:
  - `load(id: string): Promise<void>` — carga detalle.
  - `openEdit(): void` — abrir editor.
- Notas: mostrar `ProductHistoryTimeline` y `StockEventList` como hijos.

### `MaterialEditPageComponent` (standalone)

- Propósito: crear/editar material.
- Inputs:
  - `id?: string` (si existe, modo edición)
- Outputs:
  - `saved: EventEmitter<Material>`
- Methods:
  - `save(dto: CreateOrUpdateMaterialDTO): Promise<void>` — valida y guarda via `MaterialService`.
  - `cancel(): void` — regresar.
- Notas: usar `MaterialFormComponent` como hijo.

### `RecipesListPageComponent`, `RecipeDetailPageComponent`, `RecipeEditPageComponent`

- Propósito: análogos a materiales, pero para recetas. `RecipeDetail` debe mostrar BOM, rendimientos y materiales requeridos.
- Métodos y props: como los de materiales, con `calculateYield()` en `RecipeDetail`.

### `ProductsListPageComponent`, `ProductDetailPageComponent`

- Propósito: listar productos, ver composición, historial y stock disponible.

### `InventoryDashboardPageComponent`

- Propósito: vista resumen (stock total, alertas por bajo stock, movimientos recientes).
- Outputs: none
- Methods:
  - `refresh(): Promise<void>`
  - `loadAlerts(): Promise<void>`

### `BuildPageComponent`

- Propósito: interfaz para crear builds (armar productos) usando `BuildService`.
- Inputs: none
- Methods:
  - `calculateBuild(productId: string, qty: number): Promise<BuildPlan>`
  - `executeBuild(plan: BuildPlan): Promise<BuildResult>`
- Notas: mostrar modal de confirmación y resumen de consumo de materiales.

---

## Shared / Presentational components (reutilizables)

### `HeaderComponent` (standalone)

- Propósito: encabezado global con título, búsqueda global y navegación.
- Inputs: `title?: string`
- Outputs: `search: EventEmitter<string>`
- Methods: `onSearch(query: string): void`

### `SidebarComponent` (standalone)

- Propósito: navegación lateral para features.
- Inputs: `collapsed: boolean`
- Outputs: `toggle: EventEmitter<boolean>`

### `FooterComponent`

- Propósito: footer informativo.

### `ConfirmDialogComponent` (standalone)

- Propósito: modal reutilizable para confirmaciones.
- Inputs: `title: string`, `message: string`, `confirmLabel?: string`, `cancelLabel?: string`
- Outputs: `confirmed: EventEmitter<void>`, `cancelled: EventEmitter<void>`
- Methods: `open()`, `close()` (si se implementa como servicio/modal programático).

### `ToastComponent` / `NotificationComponent` (standalone)

- Propósito: mostrar mensajes breves (éxito, error, info).
- Inputs: `message: string`, `type: 'success'|'error'|'info'`

### `LoadingSpinnerComponent` (standalone)

- Propósito: indicador de carga.
- Inputs: `size?: 'sm'|'md'|'lg'`

### `TableListComponent<T>` (standalone, genérico)

- Propósito: tabla reutilizable con paginación y sorting.
- Inputs:
  - `columns: ColumnDef[]`
  - `items: T[]`
  - `pageSize?: number`
- Outputs:
  - `sortChange: EventEmitter<SortDef>`
  - `pageChange: EventEmitter<number>`
- Methods: `goToPage(n: number): void`

### `SearchInputComponent` (standalone)

- Propósito: campo de búsqueda con debounce.
- Outputs: `search: EventEmitter<string>`
- Props: `placeholder?: string`, `debounceMs?: number`

---

## Feature / Domain components (componentes hijos específicos)

### `MaterialCardComponent` (standalone)

- Propósito: mostrar resumen de un material (nombre, unidad, stock, botón acción).
- Inputs: `material: Material`
- Outputs: `edit: EventEmitter<string>`, `view: EventEmitter<string>`
- Methods: `onEdit()`, `onView()`

### `MaterialFormComponent` (standalone)

- Propósito: formulario para crear/editar material (reactive form).
- Inputs: `initial?: Partial<Material>`
- Outputs: `submit: EventEmitter<CreateOrUpdateMaterialDTO>`, `cancel: EventEmitter<void>`
- Methods: `validate(): boolean`, `reset()`

### `ProductCardComponent`, `RecipeCardComponent`

- Propósito: similares a `MaterialCardComponent` para sus entidades.

### `BOMListComponent` (standalone)

- Propósito: lista de `BOMItem` en una receta o producto, con cantidades y opciones para ajustar.
- Inputs: `items: BOMItem[]`
- Outputs: `change: EventEmitter<BOMItem[]>`

### `StockEventListComponent` (standalone)

- Propósito: mostrar movimientos/entradas y salidas de stock.
- Inputs: `events: StockEvent[]`

### `ProductHistoryTimelineComponent` (standalone)

- Propósito: timeline visual del historial del producto (creaciones, builds, ajustes).
- Inputs: `history: ProductHistory[]`

---

## UI primitives / Helpers

### `IconButtonComponent` (standalone)

- Propósito: boton iconográfico reutilizable.
- Inputs: `icon: string`, `ariaLabel?: string`, `disabled?: boolean`
- Outputs: `click: EventEmitter<void>`

### `PaginationComponent` (standalone)

- Propósito: control de paginación simple.
- Inputs: `total: number`, `pageSize: number`, `current: number`
- Outputs: `pageChange: EventEmitter<number>`

### `EmptyStateComponent` (standalone)

- Propósito: mostrar estado vacío con llamada a acción.
- Inputs: `title: string`, `message?: string`, `ctaLabel?: string`
- Outputs: `cta: EventEmitter<void>`

---

## Notas de implementación y convenciones

- Todos los componentes deben ser `standalone: true` y declarar sus imports (`CommonModule`, `ReactiveFormsModule`, `RouterModule`) localmente.
- Preferir `OnPush` change detection para componentes presentacionales.
- Separar lógica de negocio en servicios (`MaterialService`, `InventoryService`, etc.) y mantener componentes enfocados en UI y orquestación.
- Usar utilidades Tailwind para estilos: los componentes deben recibir clases opcionales (`class`/`ngClass`) para permitir composición.
- Emitir eventos en lugar de acoplar a rutas desde componentes pequeños; la navegación se hace en pages o coordenadores.

---

Si te parece, puedo generar plantillas `*.component.ts` y `*.component.html` minimalistas (standalone) para un subconjunto de estos componentes (por ejemplo: `MaterialsListPageComponent`, `MaterialFormComponent`, `MaterialCardComponent`, `ConfirmDialogComponent`).
