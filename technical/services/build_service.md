# Servicio: BuildService (¿Qué puedo armar?)

Responsabilidad

- Calcular cuántas unidades de cada receta/producto se pueden armar con el stock actual y verificar pedidos deseados.

Dependencias (inyectadas)

- `RecipeRepository` o `RecipeService` (para obtener recetas)
- `InventoryService` (para `stockIndex`)

Métodos mínimos (firmas sugeridas)

- `calculateAllBuilds(): Promise<Array<{recipeId:string, maxBuilds:number}>>` — para cada receta activa calcula cantidad máxima construible.
- `checkOrder(requests: Array<{productId:string, quantity:number}>): Promise<OrderCheckResult>` — devuelve por producto si puede armar y faltantes por material.
- `calculateBuildsForRecipe(recipeId: string, stockIndex: Record<string,number>): number` — función pura para pruebas (acepta `stockIndex`).

Notas SOLID

- Mantener algoritmo puro cuando sea posible (aceptar `stockIndex` en las funciones internas) para facilitar pruebas y OCP.
- YAGNI: no añadir optimizaciones de performance hasta que sean necesarias.

Persistencia MVP

- `BuildService` obtendrá `stockIndex` de `InventoryService` que, en el MVP, será calculado a partir de repositorios en memoria. Recordar que los resultados reflejan el estado runtime y se perderán al recargar la aplicación.
