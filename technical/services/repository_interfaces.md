# Repository Interfaces

Definir repositorios como interfaces permite cumplir DIP y facilitar pruebas/mocking.

Interfaces recomendadas:

- `MaterialRepository`:

  - `save(material: Material): Promise<Material>`
  - `findById(id: string): Promise<Material | null>`
  - `list(filter?: any): Promise<Material[]>`
  - `search(query: string): Promise<Material[]>`

- `RecipeRepository`:

  - `save(recipe: Recipe): Promise<Recipe>`
  - `findById(id: string): Promise<Recipe | null>`
  - `list(filter?: any): Promise<Recipe[]>`

- `ProductRepository`:

  - `save(product: Product): Promise<Product>`
  - `findById(id: string): Promise<Product | null>`
  - `list(filter?: any): Promise<Product[]>`

- `EventRepository`:
  - `save(event: AuditEvent): Promise<AuditEvent>`
  - `findByEntity(entityType: string, entityId: string, opts?: any): Promise<AuditEvent[]>`
  - `list(filter?: any): Promise<AuditEvent[]>`

Notes:

- Implementar adaptadores concretos (JSON file, SQLite) que implementen estas interfaces cuando se implemente persistencia estable.
- Para el MVP se crearán adaptadores **en memoria** que implementen estas interfaces y almacenen los datos en estructuras runtime (maps/arrays). Estos adaptadores son efímeros: los datos se perderán al recargar la aplicación.
- Repositorios no deben contener lógica de negocio; solo operaciones CRUD y consultas necesarias.
