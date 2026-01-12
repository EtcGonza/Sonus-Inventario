# Servicio: RecipeService

Responsabilidad

- Gestión de recetas/BOM: crear, editar, validar materiales referenciados, y exponer datos para calcular builds.

Dependencias (inyectadas)

- `RecipeRepository`
- `MaterialRepository` (para validar existencia de `material_id`)
- `IdService`

Métodos mínimos (firmas sugeridas)

- `create(data: CreateRecipeDTO): Promise<Recipe>` — valida materiales existentes y persiste.
- `getById(id: string): Promise<Recipe | null>`
- `list(filter?: RecipeFilter): Promise<Recipe[]>`
- `update(id: string, fields: Partial<RecipeUpdateDTO>): Promise<Recipe>`
- `addItem(recipeId: string, item: BOMItemDTO): Promise<Recipe>`
- `removeItem(recipeId: string, materialId: string): Promise<Recipe>`
- `validateMaterialsExist(recipe: Recipe): Promise<ValidationResult>`
- `calculateMaxBuilds(recipeId: string, stockIndex: Record<string, number>): Promise<number>` — acepta `stockIndex` para mantener la función pura y fácilmente testeable.

Notas SOLID

- OCP: exponer interfaces y mantener algoritmo de cálculo puro para poder extender sin modificar código base.
- ISP: clientes que solo leen recetas usarán métodos de lectura, clientes que modifican recetas usarán métodos de escritura.
- YAGNI: evitar métodos de importación/transformación a menos que sean requeridos.

Persistencia MVP

- Para el MVP, `RecipeRepository` será una implementación en memoria. Las validaciones y operaciones seguirán siendo las mismas, pero con la limitación de que los datos son efímeros en runtime.
