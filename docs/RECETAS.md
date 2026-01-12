# Recetas / Bill of Materials (BOM)

Este documento define la estructura y validaciones para las recetas (BOM) usadas por el sistema.

Estructura mínima de una receta:

- `id` (string): Identificador único de la receta (generado automáticamente por el sistema).
- `nombre` (string): Nombre legible del producto o micrófono.
- `descripcion` (string, opcional): Observaciones sobre el producto.
- `materiales` (lista): Cada elemento es un objeto con:
  - `material_id` (string): id del material ya cargado en el sistema.
  - `cantidad_requerida` (number): cantidad necesaria por unidad del producto.
  - `unidad` (string, opcional): unidad de medida (si aplica).

Estado y borrador

- Campo sugerido: `estado` (string) — Valores posibles: `draft`, `active`, `disabled`.

  - `draft`: la receta no está vinculada a ningún producto o está en revisión.
  - `active`: la receta está vinculada a uno o más productos y lista para uso.
  - `disabled`: la receta fue marcada manualmente como no utilizable.

- Reglas automáticas:

  - Si una `receta` no está vinculada a ningún `producto`, el sistema la marcará como `draft`.
  - Al vincular la receta a un producto, su `estado` podrá cambiar a `active`.

- Identificación: las recetas en borrador deben poder filtrarse con `estado = draft` y mostrarse con una etiqueta "Borrador" en listados.

Validaciones al crear/editar una receta:

- Todos los `material_id` deben existir en el catálogo de materiales. Si alguno falta, la operación falla y devuelve la lista de materiales faltantes.
- `cantidad_requerida` debe ser mayor que 0.

Flujo recomendado para creación de recetas (UX):

- El formulario de creación debe permitir buscar materiales ya cargados en el catálogo (búsqueda por `nombre` o `codigo`).
- Para cada material encontrado, el usuario podrá indicar la `cantidad_requerida` por unidad y pulsar **Añadir** para incluirlo en la receta.
- La lista de materiales añadidos debe mostrarse en el formulario con opción de editar cantidad o eliminar antes de guardar la receta.

Al guardar la receta, el sistema genera automáticamente el `id` y valida que todos los `material_id` usados existen.

Operaciones mínimas:

- Crear receta (validar materiales existentes).
- Actualizar receta (mantener historial de cambios).
- Eliminar receta (con advertencia si está asociada a productos activos).
- Listar recetas y ver detalles (materiales y cantidades por unidad).

Edición de recetas (UI/UX):

- En la interfaz de edición/creación de una receta el usuario podrá:

  - Buscar materiales existentes por `nombre` o `codigo`.
  - Para cada material encontrado indicar la `cantidad_requerida` y la `unidad`.
  - Pulsar **Añadir** para incluir el material en la receta.
  - Ver la lista de materiales añadidos con opciones para **editar** la cantidad/unidad o **eliminar** el material de la receta antes de guardar.

- Al guardar la receta, el sistema valida los `material_id` y genera automáticamente el `id` de la receta.

Regla de relación con productos:

- Una receta puede estar asociada a cero, uno o muchos `productos`. Esto permite crear una receta y vincularla a un producto más tarde, o crear varias recetas y asignarlas a productos en distintos momentos.

Nota sobre flujo recomendado:

- Si una receta no está vinculada a ningún producto, se considera una receta en borrador; el sistema deberá permitir guardarla pero se recomienda vincularla a un producto antes de marcarlo como activo.

Ejemplo de receta (JSON):

```
{
  "id": "r-001",
  "nombre": "Micrófono Vintage X",
  "descripcion": "Micro construido con imán Alnico y bobina de cobre fina.",
  "materiales": [
    { "material_id": "m-001", "cantidad_requerida": 1, "unidad": "unidad" },
    { "material_id": "m-002", "cantidad_requerida": 2, "unidad": "metros" }
  ]
}
```
