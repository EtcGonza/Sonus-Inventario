# Servicio: UnitOfWork / TransactionService

Responsabilidad

- Orquestar operaciones transaccionales que involucren múltiples repositorios (ej.: actualizar `Material.cantidad` y persistir `StockEvent`).

Dependencias (inyectadas)

- Repositorios involucrados (ej. `MaterialRepository`, `EventRepository`)

Métodos mínimos (firmas sugeridas)

- `execute<T>(work: (uowContext: UoWContext) => Promise<T>): Promise<T>` — ejecuta una unidad de trabajo; `uowContext` expone repositorios transaccionales o helpers.

Notas SOLID

- SRP: solo orquestación transaccional.
- DIP: inyectar implementaciones concretas del adaptador de transacciones (p.ej. DB transaction o emulación en JSON).
- YAGNI: mantener simple; si la implementación de persistencia no soporta transacciones, `UnitOfWork` puede simular comportamiento con estrategias compensatorias para MVP.

Nota sobre MVP en memoria:

- Dado que la persistencia del MVP es en memoria, el `UnitOfWork` puede implementarse como un coordinador que aplica cambios en memoria y asegura orden de operaciones; si se requiere, puede ofrecer una estrategia simple de rollback por compensación en caso de error. Estas implementaciones son temporales y deberán ser reemplazadas al integrar una base de datos transaccional.
