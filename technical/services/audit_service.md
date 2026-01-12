# Servicio: AuditService / EventService

Responsabilidad

- Registrar y consultar eventos de auditoría (`AuditEvent`, `StockEvent`, `ProductHistory`). Proveer APIs para obtener historiales por entidad.

Dependencias (inyectadas)

- `EventRepository` (persistencia de eventos)
- `IdService`

Métodos mínimos (firmas sugeridas)

- `recordEvent(event: AuditEventDTO): Promise<AuditEvent>` — persiste evento (id/timestamp si es necesario).
- `listEventsByEntity(entityType: string, entityId: string, opts?: ListOpts): Promise<AuditEvent[]>`
- `listEvents(filter?: EventFilter): Promise<AuditEvent[]>`

Notas SOLID

- SRP: solo gestión de eventos.
- DIP: depende de `EventRepository` (interface).
- YAGNI: no añadir indexados/retención avanzada sin necesidad.

Persistencia MVP

- `AuditService` persistirá eventos en un `EventRepository` en memoria durante el MVP. Los historiales serán accesibles solo durante la sesión runtime y se perderán al recargar la UI.
