# Modelo: Recipe (Receta / BOM)

Descripción: define la lista de materiales y cantidades necesarias para fabricar un producto.

Campos:

- `id` (string) — Identificador único (generado automáticamente).
- `nombre` (string, required) — Nombre de la receta.
- `descripcion` (string, optional) — Observaciones.
- `materiales` (array of `BOMItem`, required) — Lista de componentes.
- `estado` (string, enum: `draft` | `active` | `disabled`) — Ciclo de vida de la receta.

Validaciones:

- La lista `materiales` no puede estar vacía (aunque se permita guardar en `draft`).
- Cada `material_id` debe existir en `Material`.
- Cada `cantidad_requerida` > 0.

Ejemplo (JSON):

```
{
  "id": "r-001",
  "nombre": "Micrófono Vintage X",
  "descripcion": "Micro con imán Alnico y bobina fina.",
  "materiales": [
    { "material_id": "m-001", "cantidad_requerida": 1, "unidad": "unidad" },
    { "material_id": "m-002", "cantidad_requerida": 2, "unidad": "metros" }
  ],
  "estado": "active"
}
```

Methods (sugeridos)

- `static create(data): Recipe` — fábrica que construye la receta (genera `id` con `nanoid`).
- `addItem(item: BOMItem): Recipe` — devuelve nueva instancia de `Recipe` con el `BOMItem` añadido.
- `removeItem(materialId: string): Recipe` — devuelve nueva instancia sin el `BOMItem` indicado.
- `updateItem(materialId: string, fields): Recipe` — actualiza cantidad/unidad de un ítem y devuelve nueva instancia.
- `calculateMaxBuilds(stockIndex): number` — calcula la cantidad máxima que se puede construir según `stockIndex` (map `material_id -> cantidad`).
- `validate(): ValidationResult` — valida que `materiales` no esté vacío (o registre como `draft`), que `cantidad_requerida > 0`, y que `material_id` tenga formato correcto.

Notas:

- La resolución de existencia de `material_id` y la lectura de `stockIndex` deben realizarse en capas de servicio; este método `calculateMaxBuilds` acepta un `stockIndex` precomputado para permanecer puro.

Precaución de diseño:

- NO crear métodos que no sean necesarios: mantener `Recipe` como una entidad pura de datos con utilidades mínimas; las operaciones compuestas o que requieran acceso a repositorios deben implementarse en `Service`.
