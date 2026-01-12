# Funcionalidades principales

1. Gestión de stock de materiales

   - Alta de materiales con campos mínimos definidos en `MATERIALES.md`.
   - Actualización de cantidades (entradas y salidas).
   - Búsqueda y filtrado sencillo por nombre o código.
   - Historial de cada material: registrar y mostrar cambios (ver `MATERIALES.md`). No se almacenará información sobre el usuario que realizó el cambio.

2. Definición de recetas/BOM (Bill of Materials)

   - Para cada tipo de micrófono se define una receta que lista materiales y cantidades necesarias por unidad.
   - Formato: tabla, CSV o JSON según preferencia de implementación.

   - Al crear o actualizar una receta se debe validar que todos los `material_id` referenciados ya existen en el módulo de materiales. Si falta alguno, bloquear la creación y notificar qué materiales faltan.

   - Flujo de creación de receta (UX): permitir buscar materiales del catálogo, indicar la cantidad requerida por material y "Añadir" para componer la receta. El `id` de la receta será generado automáticamente por el sistema al guardar.

   - Una receta mínima debe incluir: `id` (generado automáticamente), `nombre`, `descripcion` (opcional), `materiales` (lista de `{material_id, cantidad_requerida, unidad}`).

3. Módulo "¿Qué puedo armar?"

   - Entrada: stock actual + lista de recetas.
   - Salida: para cada tipo de micrófono, la cantidad máxima que puede construirse con el stock actual.
   - Reglas:

     - Calcular por material: floor(stock / requerido_por_unidad).
     - El mínimo de esos valores entre todos los materiales de una receta determina la cantidad construible.

   - Listado de recetas: el módulo debe poder listar todas las recetas creadas y mostrar detalles (materiales requeridos, cantidades por unidad, notas). El listado debe excluir productos o recetas cuyo `estado` indique que están deshabilitados.

   - Funcionalidad de "pedido deseado": permitir al usuario ingresar una lista de productos y cantidades deseadas (ej.: 7 unidades de `MicX`, 4 unidades de `MicY`) y devolver:

     - Para cada producto solicitado, si hay materiales suficientes para cubrir la cantidad solicitada.
     - En caso de insuficiencia, listado de materiales faltantes con la cantidad adicional necesaria.

   - Algoritmo para verificar un pedido solicitado (por cada receta solicitada):

     1. Para cada material en la receta, calcular `necesario_total = requerido_por_unidad * cantidad_solicitada`.
     2. Comparar `necesario_total` con `stock_actual`.
     3. Si para todos los materiales `stock_actual >= necesario_total`, marcar como "suficiente" y (opcional) indicar stock remanente si se consumiera.
     4. Si existe alguno con `stock_actual < necesario_total`, listar las diferencias (`faltante = necesario_total - stock_actual`).

   - Salida del chequeo: formato amigable (tabla/JSON) que incluya por producto solicitado: `producto_id`, `solicitado`, `puede_armar` (boolean), `faltantes` (lista de materiales y cantidades) y `consumo_estimado` (opcional).

4. Histórico del módulo de productos

- El módulo de productos debe mantener un historial de cambios (nombre, receta asignada, notas). Cada evento incluirá `timestamp`, `campo_modificado`, `valor_anterior`, `valor_nuevo` y `nota`. No se almacenará información sobre el usuario que realizó el cambio.

Relaciones y validaciones de entidades

- Materiales: un `material` puede estar relacionado a cero, una o muchas `recetas`.
- Recetas: una `receta` puede estar relacionada a cero, una o muchas `productos`. Esto permite crear recetas en borrador y vincularlas a productos posteriormente.
- Productos: un `producto` está relacionado a una única `receta` cuando esta existe; sin embargo `receta_id` puede estar vacío al crear el producto. Si un `producto` no tiene receta vinculada, el sistema lo marcará como `draft` hasta que se le asigne una receta.

Operaciones permitidas sobre vínculos:

- Crear un `producto` sin `receta_id` (producto queda en `draft`).
- Vincular una receta a un producto existente en cualquier momento.
- Eliminar la receta asociada a un producto; si no se asigna otra receta, el producto quedará en `draft`.
- Reasignar una receta diferente a un producto (registro en el historial del producto).

Identificación de borradores

- Las entidades en borrador deben poder identificarse mediante el campo `estado = draft`.
- Los listados deberán ofrecer filtros por `estado` y/o una columna/etiqueta visible "Borrador" para facilitar su localización.

Comportamiento de productos deshabilitados

- Si un `producto` tiene `estado = disabled`, debe ser ignorado en:
  - Listados activos de productos.
  - Cálculos de disponibilidad y en el módulo "¿Qué puedo armar?".
  - Al procesar pedidos deseados (no se considerará disponible aunque su receta tenga materiales suficientes).

**IDs automáticos**

- Todos los `id` de las entidades principales (`materiales`, `recetas`, `productos`) serán generados automáticamente por el sistema; no los ingresa el usuario.

Consideraciones técnicas iniciales:

- Mantener datos en formato simple (JSON o base de datos ligera) para arrancar rápido.
- Diseñar la estructura de datos de las recetas para que sea fácil de leer y procesar por la lógica de cálculo.

- Registrar eventos de historial de forma transaccional para evitar inconsistencias entre stock y registros de consumo.
