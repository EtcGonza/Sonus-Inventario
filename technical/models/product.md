# Modelo: Product

Descripción: entidad comercial que referencia una `Recipe` opcionalmente.

Campos:

- `id` (string) — Identificador único (generado automáticamente).
- `nombre` (string, required) — Nombre comercial.
- `receta_id` (string, optional) — Referencia a `Recipe.id`.
- `precio` (number, optional) — Precio sugerido.
- `nota` (string, optional) — Observaciones.
- `estado` (string, enum: `draft` | `active` | `disabled`) — Ciclo de vida del producto.

Reglas relevantes:

- Si `receta_id` es nulo/omitido, `estado` = `draft`.
- Al asignar `receta_id`, el sistema podrá setear `estado = active`.

Ejemplo:

```
{
  "id": "p-001",
  "nombre": "Mic Vintage X",
  "receta_id": "r-001",
  "precio": 120.0,
  "nota": "Edición limitada",
  "estado": "active"
}
```

Methods (sugeridos)

- `static create(data): Product` — fábrica que construye el `Product` con `id` generado por `nanoid`.
- `assignRecipe(recetaId: string): Product` — retorna nueva instancia con `receta_id` asignada y `estado` actualizado a `active`.
- `unassignRecipe(): Product` — retorna nueva instancia con `receta_id` removida y `estado` = `draft`.
- `updatePrice(newPrice: number): Product` — retorna nueva instancia con `precio` actualizado.
- `toJSON(): object` — serializa para persistencia.

Notas:

- La lógica que afecta inventario o consistencia global (por ejemplo, comprobar impactos al cambiar `receta_id`) debe implementarse en un `Service` que registre eventos en `ProductHistory`.

Precaución de diseño:

- NO crear métodos que no sean necesarios: limitar los métodos del modelo a fábricas, serializadores y cambios triviales; cualquier lógica que implique otras entidades o persistencia debe residir en `Service`.
