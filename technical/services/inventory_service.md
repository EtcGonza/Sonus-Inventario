# Servicio: InventoryService (Stock)

Responsabilidad

- Ejecutar ajustes de stock, aplicar `StockEvent`, calcular índices de stock y proveer utilidades para consumo por `BuildService`.

Dependencias (inyectadas)

- `MaterialRepository`
- `EventRepository` / `AuditService`
- `UnitOfWork`

Métodos mínimos (firmas sugeridas)

- `applyStockEvent(event: StockEventDTO): Promise<void>` — registra event y actualiza `Material.cantidad` de forma transaccional.
- `getStockIndex(): Promise<Record<string, number>>` — devuelve mapa `material_id -> cantidad` para uso por `BuildService`.
- `adjustQuantity(materialId: string, delta: number, nota?: string): Promise<void>` — convenience que construye `StockEvent` y llama a `applyStockEvent`.
- `getMaterialHistory(materialId: string): Promise<AuditEvent[]>`

Notas SOLID

- SRP: este servicio se encarga solo de stock y eventos asociados.
- DIP: interfaces de repositorio inyectadas.
- YAGNI: evitar métodos de previsión de compra u órdenes complejas en esta fase MVP.

Persistencia MVP

- `InventoryService` usará `MaterialRepository` y `EventRepository` en memoria en el MVP. Los índices de stock se generarán desde estructuras runtime y por tanto se perderán al recargar la página.
