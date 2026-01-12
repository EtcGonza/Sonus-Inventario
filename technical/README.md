# Documentación técnica — Sonus Inventario

Carpeta destinada a la documentación técnica para implementar el MVP.

Estructura inicial:

- `models/` — definiciones de modelos de datos (cada modelo en su `.md`).

Próximos pasos:

- Implementar esquemas (JSON Schema / ORM) a partir de los modelos.
- Crear ejemplos de datos y scripts de carga.
- Diseñar API mínima (endpoints) y/o CLI para las operaciones principales.

Principios de diseño y calidad

Este proyecto intentará aplicar, siempre que aporte valor sin introducir complejidad innecesaria, los principios SOLID en la implementación del código:

- Single Responsibility (SRP): cada clase o módulo debe tener una única responsabilidad. Los modelos deben representar datos; la lógica de negocio y la persistencia deben estar en capas separadas (servicios/repositories).
- Open/Closed (OCP): el sistema deberá ser extensible mediante la adición de nuevos módulos o comportamientos sin modificar código existente, por ejemplo usando interfaces/abstract classes y composición.
- Liskov Substitution (LSP): diseñar jerarquías de tipos que permitan reemplazo seguro de subtipos por sus supertypes.
- Interface Segregation (ISP): ofrecer interfaces específicas y pequeñas en lugar de una interfaz general que obligue a implementar métodos inútiles.
- Dependency Inversion (DIP): depender de abstracciones (interfaces) y no de implementaciones concretas; inyectar dependencias (repositorios, servicios) en las capas superiores.

Revisión rápida de los modelos actuales

He revisado los modelos en `technical/models/` (Material, BOMItem, Recipe, Product, StockEvent, ProductHistory). Observaciones generales:

- Estado actual: los archivos son definiciones de datos (schemas/documentación). Esto es coherente con SRP: cada archivo describe una sola entidad.
- Recomendación OCP/DIP: mantener los modelos como DTO/POCO sin lógica; crear capas `Repository` (interfaces) y `Service` para la lógica y persistencia. Así se podrá extender almacenamiento (JSON, SQLite, DB) sin tocar modelos.
- Validaciones: centralizar validaciones de negocio (p. ej. `cantidad >= 0`, existencia de `material_id`) en servicios o validadores (no en modelos con lógica compleja).
- Historias/Events: `StockEvent` y `ProductHistory` deben ser inmutables y registrarse de forma transaccional junto con cambios de stock/producto.

Si quieres, puedo:

- Generar esquemas JSON Schema para cada modelo.
- Proponer una estructura mínima de capas (models, repositories, services, api/cli) y ejemplos de interfaces para cumplir DIP.
- Implementar un ejemplo de `Repository` para almacenamiento en JSON o SQLite.

Indica cuál de estas tareas quieres que haga a continuación.

Persistencia en memoria (MVP)

Nota importante: en esta primera fase (MVP) la aplicación NO tendrá conexión a una API externa ni una base de datos persistente en el frontend. Toda la persistencia será en memoria (runtime) dentro de la aplicación Angular. Eso significa que los datos existen solo mientras la aplicación esté en ejecución; si el usuario recarga la página (`F5`) o cierra la aplicación, los datos se perderán. Esto es intencional: el objetivo del MVP es mostrar la idea y validar flujos, no almacenar datos a largo plazo.

Implicaciones:

- Las implementaciones de repositorios por defecto serán adaptadores en memoria para el MVP.
- El `UnitOfWork` y las transacciones pueden ser simuladas o implementadas con estrategias compensatorias en memoria.
- Todos los ejemplos, scripts y repositorios de ejemplo deberán indicar explícitamente que son efímeros.

Cuando se decida avanzar más allá del MVP, se documentará y añadirá la integración con API y/o persistencia estable (SQLite, server, etc.).

Plataforma y generación de IDs

Decisiones tecnológicas iniciales:

- Frontend: usaremos Angular (última versión estable) como framework de UI.
- Lenguaje: TypeScript en todo el proyecto (frontend y código compartido/CLI donde aplique).
- Generación de `id`: utilizaremos la librería `nanoid` para generar `id` únicos y compactos. `nanoid` funciona bien en Node y en navegadores, por lo que es adecuada para uso tanto en backend/CLI como en Angular.

Ejemplo de uso (TypeScript):

```ts
import {nanoid} from "nanoid";

const id = nanoid(); // ejemplo: "V1StGXR8_Z5jdHi6B-myT"
```

Si prefieres otra librería (por ejemplo `uuid`), puedo cambiar la documentación y los ejemplos.

Tailwind y práctica YAGNI

- UI/CSS: para el frontend Angular utilizaremos `Tailwind CSS` como biblioteca de utilidades y estilos. Tailwind nos permitirá desarrollar una interfaz limpia y consistente con bajo coste de CSS personalizado. También podrá emplearse junto a componentes preconstruidos compatibles con Tailwind.
- YAGNI / Evitar métodos innecesarios: en este repositorio queda expresamente indicado que NO se deben crear métodos o APIs que no sean necesarios en el momento. Implementar solamente lo requerido por las funcionalidades MVP o que aporten valor concreto. Esto evita complejidad innecesaria y facilita mantener SRP y la simplicidad de diseño.
