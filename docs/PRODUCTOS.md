# Módulo Productos

Definición y reglas del módulo de productos. Un "producto" es una entidad comercial que normalmente referencia una `receta` (BOM).

Campos sugeridos para un `producto`:

- `id` (string): Identificador único (generado automáticamente por el sistema).
- `nombre` (string): Nombre del producto.
- `receta_id` (string, opcional): Referencia a la receta/BOM que define materiales necesarios. Puede dejarse vacío al crear el producto.
- `precio` (number, opcional): Precio de venta sugerido.
- `nota` (string, opcional): Observaciones.

Estado y borrador

- `estado` (string): Valor de ciclo de vida del producto. Valores sugeridos: `draft`, `active`, `disabled`.
  - `draft`: el producto no tiene receta vinculada o está en revisión.
  - `active`: el producto tiene receta asignada y está disponible para operaciones.
  - `disabled`: el producto fue deshabilitado manualmente.

Comportamientos relacionados a la receta

- Al crear un `producto`, el campo `receta_id` puede omitirse. Si no tiene una receta vinculada el sistema establecerá `estado = draft` automáticamente.
- Es posible vincular una receta a un producto después de creado. Al asignar una receta, el sistema podrá actualizar `estado = active` automáticamente.
- Es posible eliminar o reemplazar la receta asociada a un producto. Si se elimina la receta y no se asigna otra, el producto quedará en `estado = draft` y se ignorará en operaciones.

Historial de productos

Cada producto debe mantener un historial de cambios. Cada evento de historial debe incluir al menos:

- `timestamp` (ISO 8601)
- `campo_modificado` (string)
- `valor_anterior` (any)
- `valor_nuevo` (any)
- `nota` (string, opcional)

Operaciones mínimas:

- Crear producto (puede crearse sin receta y quedar en `draft`).
- Actualizar producto (registrar evento en historial).
- Vincular o reasignar `receta_id`.
- Consultar historial de un producto.

Validaciones y reglas de relación:

- Un `producto` puede estar relacionado a una única `receta`.
- Un producto sin `receta_id` se considera `draft` hasta que se le asigne una receta.

Consideración: cuando se modifica la `receta_id` de un producto, registrar con especial detalle el cambio y advertir sobre impactos en inventario y en el módulo "¿Qué puedo armar?".
