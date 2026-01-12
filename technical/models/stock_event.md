# Modelo: StockEvent (Evento de stock / historial)

Descripción: evento específico que registra una modificación en la cantidad de un `Material`.

Extiende: `AuditEvent` (ver `technical/models/audit_event.md`).

Campos específicos:

- `material_id` (string, required) — Referencia a `Material.id`.
- `tipo` (string, enum: `entrada` | `salida` | `ajuste` | `baja`) — Tipo de operación.
- `cantidad` (number, required) — Magnitud del cambio (positivo para entradas, negativo para salidas/ajustes).

Notas:

- No se almacenará información sobre el usuario que realizó la acción.
- Los eventos deben registrarse de forma transaccional junto con la actualización de `Material.cantidad`.

Ejemplo:

```
{
  "id": "e-20260111-001",
  "timestamp": "2026-01-11T10:00:00Z",
  "entity_type": "Material",
  "entity_id": "m-002",
  "tipo": "salida",
  "cantidad": -2,
  "nota": "uso en lote de 2 micrófonos"
}
```

Methods (sugeridos)

- `static createForMaterial(materialId: string, tipo: string, cantidad: number, nota?: string): StockEvent` — fábrica que construye el evento y rellena `entity_type`/`entity_id`.
- `applyToStock(material: Material): Material` — helper puro que devuelve una nueva instancia de `Material` con `cantidad` ajustada (no persistir aquí; el `Service` debe orquestar persistencia y eventos).
- `toRecord(): object` — serializa para persistencia.

Notas:

- No ejecutar persistencia dentro del modelo. El `Service` debe llamar a `applyToStock` y luego registrar el `StockEvent` en un repositorio de eventos.

Precaución de diseño:

- NO crear métodos que no sean necesarios: mantener el evento simple y delegar orquestación a servicios y repositorios.
