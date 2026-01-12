# Modelo: ProductHistory

Descripción: evento histórico específico que registra cambios relevantes sobre un `Product`.

Extiende: `AuditEvent` (ver `technical/models/audit_event.md`).

Campos específicos:

- `producto_id` (string, required) — Referencia a `Product.id`.
- `campo_modificado` (string, required) — Nombre del campo modificado.
- `valor_anterior` (any) — Valor anterior del campo.
- `valor_nuevo` (any) — Nuevo valor del campo.

Notas:

- No se almacenará información sobre el usuario que realizó la acción.

Ejemplo:

```
{
  "id": "ph-001",
  "timestamp": "2026-01-11T11:00:00Z",
  "entity_type": "Product",
  "entity_id": "p-001",
  "campo_modificado": "receta_id",
  "valor_anterior": null,
  "valor_nuevo": "r-001",
  "nota": "Asignada receta inicial"
}
```

Methods (sugeridos)

- `static createForProduct(productoId: string, campo: string, anterior: any, nuevo: any, nota?: string): ProductHistory` — fábrica que genera el evento y rellena `entity_type`/`entity_id`.
- `toRecord(): object` — serializa para persistencia.

Notas:

- La creación de `ProductHistory` debe ser realizada por servicios que gestionen los cambios de `Product` y registren los eventos de forma transaccional.

Precaución de diseño:

- NO crear métodos que no sean necesarios: los eventos históricos deben generarse desde los servicios y permanecer como objetos inmutables y simples.
