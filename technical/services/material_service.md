# Servicio: MaterialService

Responsabilidad

- Proveer operaciones de aplicación sobre el catálogo de `Material` (crear, listar, buscar, obtener por id, actualizar atributos básicos y gestionar ajustes de cantidad mediante eventos de stock).

Dependencias (inyectadas)

- `MaterialRepository` (interfaz)
- `EventRepository` o `AuditService` para registrar `StockEvent`
- `UnitOfWork` (opcional para operaciones transaccionales)
- `IdService` para generación de `id` (o usar fábrica del modelo)

Métodos mínimos (firmas sugeridas)

- `create(data: CreateMaterialDTO): Promise<Material>` — valida y persiste un nuevo material.
- `getById(id: string): Promise<Material | null>`
- `list(filter?: MaterialFilter): Promise<Material[]>`
- `search(query: string): Promise<Material[]>`
- `update(id: string, fields: Partial<MaterialUpdateDTO>): Promise<Material>` — actualiza campos no relacionados al stock.
- `adjustQuantity(materialId: string, delta: number, nota?: string): Promise<Material>` — aplica un ajuste transaccional: registra `StockEvent` y actualiza `Material.cantidad`.
- `getHistory(materialId: string, opts?: HistoryOptions): Promise<AuditEvent[]>`

Notas SOLID

- SRP: este servicio orquesta operaciones sobre `Material` y délégalas a repositorios y a `AuditService`.
- DIP: depende de interfaces `MaterialRepository` y `EventRepository`.
- YAGNI: no añadir métodos de conveniencia hasta que sean necesarios (p.ej. `bulkImport` solo si se requiere).

Persistencia MVP

- En el MVP la implementación de `MaterialRepository` será en memoria. Los métodos listados pueden ser implementados sobre estructuras runtime; documentar explícitamente que los datos se perderán al recargar la aplicación.
