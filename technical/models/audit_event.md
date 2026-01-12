# Modelo: AuditEvent (Base para eventos/historial)

Descripción: entidad base que unifica metadatos comunes a eventos de auditoría/historial.

Campos comunes:

- `id` (string) — Identificador único (generado automáticamente, ver nota sobre librería `nanoid`).
- `timestamp` (string, ISO 8601) — Fecha/hora del evento.
- `entity_type` (string) — Tipo de entidad afectada (ej.: `Material`, `Product`).
- `entity_id` (string) — Identificador de la entidad afectada.
- `nota` (string, optional) — Comentario o motivo del cambio.

Notas de diseño:

- `AuditEvent` es inmutable: una vez creado no se modifica.
- Los eventos deben registrarse de forma transaccional con la actualización de las entidades implicadas.
- El campo `id` se generará automáticamente usando la librería `nanoid` (preferida por su tamaño y rendimiento; usable tanto en Node como en frontend Angular).

Ejemplo genérico:

```
{
  "id": "e-20260111-0001",
  "timestamp": "2026-01-11T10:00:00Z",
  "entity_type": "Material",
  "entity_id": "m-002",
  "nota": "uso en lote de 2 micrófonos"
}
```

Methods (sugeridos)

- `static create(entityType: string, entityId: string, nota?: string): AuditEvent` — fábrica que crea un `AuditEvent` con `id` (generado por `nanoid`) y `timestamp` actual.
- `toRecord(): object` — serializa el evento a un objeto listo para persistir.
- `fromRecord(rec: object): AuditEvent` — reconstruye el objeto desde un registro persistido.

Notas de implementación:

- Mantener la clase como un DTO inmutable; la lógica de persistencia debe vivir en un `Repository`.
- Implementar las fábricas en TypeScript usando `nanoid` para generación de `id`.

Precaución de diseño:

- NO crear métodos que no sean necesarios: implementar únicamente las fábricas y utilitarios que se vayan a usar por los `Service` o `Repository`. Evitar añadir helpers adicionales hasta que haya una necesidad real.
