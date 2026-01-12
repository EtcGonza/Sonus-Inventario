# Modelo: Material

Descripción: representa un insumo o componente físico en stock.

Campos:

- `id` (string) — Identificador único (generado automáticamente).
- `nombre` (string, required) — Nombre legible del material.
- `codigo` (string, optional) — Código interno / SKU.
- `cantidad` (number, required, >= 0) — Cantidad disponible en stock.
- `unidad` (string, required) — Unidad de medida ("unidad", "metros", etc.).
- `nota` (string, optional) — Observaciones.
- `estado` (string, enum: `draft` | `active` | `disabled`) — Ciclo de vida del material.

Relaciones:

- Se referencia desde `Recipe` a través de `material_id`.

Validaciones importantes:

- `cantidad` >= 0.
- `nombre` no vacío.

Ejemplo (JSON):

```
{
  "id": "m-001",
  "nombre": "Imán Alnico",
  "codigo": "ALN-10",
  "cantidad": 20,
  "unidad": "unidad",
  "nota": "parcialmente pulido",
  "estado": "active"
}
```

Methods (sugeridos)

- `static create(data): Material` — fábrica para construir una instancia válida (genera `id` con `nanoid`).
- `adjustQuantity(delta: number): Material` — retorna una nueva instancia (inmutable) con `cantidad` ajustada; validar `cantidad >= 0`.
- `update(fields): Material` — retorna nueva instancia con campos actualizados (no ejecutar lógica de negocio compleja aquí).
- `validate(): ValidationResult` — valida formato básico (`nombre` no vacío, `cantidad >= 0`, `estado` en enum).
- `toJSON(): object` — serializa el material para persistencia/traslado.

Notas de implementación:

- Mantener al modelo como DTO/POCO; las operaciones que impliquen reglas de negocio compuestas deben residir en `Service`.

Precaución de diseño:

- NO crear métodos que no sean necesarios: implementar solo los métodos que vayan a usarse en un `Service` o `Repository`. Evitar agregar funcionalidad por adelantado.
