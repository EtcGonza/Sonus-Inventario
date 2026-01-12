# Modelo: BOMItem (Recipe component)

Descripción: elemento que forma parte de una `Recipe`.

Campos:

- `material_id` (string, required) — Referencia a `Material.id`.
- `cantidad_requerida` (number, required, > 0) — Cantidad necesaria por unidad de producto.
- `unidad` (string, optional) — Unidad de medida, preferiblemente igual a la de `Material`.

Validaciones:

- `material_id` debe existir en el catálogo de materiales.
- `cantidad_requerida` > 0.

Ejemplo:

```
{ "material_id": "m-001", "cantidad_requerida": 2, "unidad": "metros" }
```

Methods (sugeridos)

- `static create(materialId: string, cantidad: number, unidad?: string): BOMItem` — fábrica para crear el componente.
- `validateExistence(materialsIndex): ValidationResult` — helper para validar que `material_id` existe en catálogo (usa datos externos).
- `toJSON(): object` — serializa el componente.

Notas:

- Mantener la validación de existencia fuera del modelo cuando implique acceso a datos (hacerlo en un `Service` o `Validator`).

Precaución de diseño:

- NO crear métodos que no sean necesarios: el modelo debe ser pequeño y solo exponer las fábricas y serializadores imprescindibles.
