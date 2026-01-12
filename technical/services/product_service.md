# Servicio: ProductService

Responsabilidad

- Operaciones sobre `Product`: crear, actualizar, vincular/desvincular recetas y exponer historial de cambios.

Dependencias (inyectadas)

- `ProductRepository`
- `RecipeRepository` (para validaciones al asignar receta)
- `EventRepository` / `AuditService` (para registrar `ProductHistory`)
- `UnitOfWork` para cambios que afecten consistencia
- `IdService`

Métodos mínimos (firmas sugeridas)

- `create(data: CreateProductDTO): Promise<Product>` — crea producto (si no hay `receta_id`, `estado` = `draft`).
- `getById(id: string): Promise<Product | null>`
- `list(filter?: ProductFilter): Promise<Product[]>`
- `update(id: string, fields: Partial<ProductUpdateDTO>): Promise<Product>`
- `assignRecipe(productId: string, recetaId: string): Promise<Product>` — registra `ProductHistory` y actualiza `estado`.
- `unassignRecipe(productId: string): Promise<Product>`
- `getHistory(productId: string): Promise<ProductHistory[]>`

Notas SOLID

- SRP: servicio coordina la validación y la persistencia; la lógica de impacto en inventario queda fuera salvo cuando sea necesario y se realizará vía `UnitOfWork`.
- DIP: depender de repositorios abstractos.
- YAGNI: no incluir funciones de catálogo extenso o sincronización externa si no hace falta.

Persistencia MVP

- En este MVP `ProductRepository` se implementará en memoria. Las operaciones de `assignRecipe` y `getHistory` seguirán funcionando, pero los cambios solo existirán en runtime y se perderán al recargar la aplicación.
