# Especificación: Materiales (campos mínimos)

Este documento define los campos mínimos para el registro de materiales en el sistema.

- Campos mínimos por material:

- `id` (string): Identificador único interno (generado automáticamente por el sistema).
- `nombre` (string): Nombre legible del material (ej.: "Imán Alnico", "Cable blindado").
- `codigo` (string, opcional): Código interno o SKU.
- `cantidad` (number): Cantidad disponible en stock (valor numérico).
- `unidad` (string): Unidad de medida (ej.: "unidad", "metros", "pares").
- `nota` (string, opcional): Observaciones breves (estado, color, variante).

Relaciones con recetas

- Un material puede estar relacionado a cero, una o muchas `recetas` (BOM). Es decir, un material cargado puede no participar en ninguna receta o estar presente en múltiples recetas.

Estado y borrador

- Campo sugerido: `estado` (string) — Valores posibles: `draft`, `active`, `disabled`.

  - `draft`: el material no está vinculado a ninguna receta o está en revisión.
  - `active`: el material está vinculado a al menos una receta y disponible para uso.
  - `disabled`: el material fue marcado manualmente como no utilizable.

- Reglas automáticas:

  - Si un `material` no está vinculado a ninguna receta, el sistema lo marcará con `estado = draft`.
  - Cuando un material se asocia a una receta, su `estado` puede actualizarse a `active`.

- Identificación: para encontrar materiales en borrador, filtrar por `estado = draft` o incluir columna/etiqueta `estado` en listados.

Operaciones mínimas:

- Registrar nuevo material.
- Actualizar cantidad (entrada/salida).
- Consultar material por `id` o `nombre`.

Historial de cambios (auditoría)

El módulo de stock debe mantener un historial para cada material. Cada entrada del historial debería incluir al menos:

- `timestamp` (ISO 8601): Fecha y hora del cambio.
- `tipo` (string): Tipo de operación (`entrada`, `salida`, `ajuste`, `baja`).
- `cantidad` (number): Cantidad modificada (positivo para entradas, negativo para salidas/ajustes).
- `nota` (string, opcional): Comentario o motivo del cambio.

Nota: No se almacenará información sobre el usuario que realizó las modificaciones en los historiales.

Ejemplo de entrada de historial (JSON):

```
{
  "timestamp": "2026-01-10T14:30:00Z",
  "tipo": "salida",
  "cantidad": -2,
  "nota": "uso en lote de 2 micrófonos modelo X"
}
```

Operaciones relacionadas al historial:

- Registrar un nuevo evento en el historial al modificar `cantidad`.
- Consultar historial completo de un material (filtros por fecha y tipo).
- Revertir o anotar ajustes en caso de errores (registro de ajuste con nota requerida).

Formato de ejemplo (JSON):

```
{
  "id": "m-001",
  "nombre": "Imán Alnico",
  "codigo": "ALN-10",
  "cantidad": 20,
  "unidad": "unidad",
  "nota": "parcialmente pulido"
}
```
