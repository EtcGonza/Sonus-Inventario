# Servicio: IdService

Responsabilidad

- Abstracción para la generación de identificadores únicos en todo el proyecto.

Implementación recomendada

- Usar `nanoid` como mecanismo de generación.

Métodos mínimos

- `generate(): string` — devuelve un `id` único.

Notas SOLID

- DIP: los servicios y repositorios dependerán de esta abstracción en lugar de llamar `nanoid` directamente, facilitando testing y si en el futuro se desea cambiar la librería.
- YAGNI: mantener una sola función `generate` por ahora.
