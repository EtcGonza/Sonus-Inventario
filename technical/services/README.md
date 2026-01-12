# Servicios — Sonus Inventario

Carpeta con la documentación de los servicios necesarios para implementar el MVP. Cada servicio sigue principios SOLID: responsabilidad única, dependencias sobre interfaces, y métodos mínimos (YAGNI).

Lista de servicios documentados:

- `MaterialService` — operaciones sobre materiales.
- `RecipeService` — gestión de recetas/BOM.
- `ProductService` — gestión de productos y su relación con recetas.
- `InventoryService` — ajuste y cálculo de stock; aplica `StockEvent`.
- `AuditService` — registro y consulta de eventos históricos (`AuditEvent`).
- `BuildService` (`WhatCanIBuildService`) — lógica para el módulo "¿Qué puedo armar?" y verificación de pedidos.
- `Repository` interfaces — `MaterialRepository`, `RecipeRepository`, `ProductRepository`, `EventRepository`.
- `UnitOfWork` / `TransactionService` — orquestación transaccional (persistencia + eventos).
- `IdService` — abstracción para generación de `id` (usa `nanoid`).

Persistencia (MVP)

Nota: en esta fase MVP todas las implementaciones concretas de los servicios y repositorios estarán basadas en almacenamiento en memoria (runtime) dentro de la aplicación Angular o en procesos Node de prototipo. No habrá API ni base de datos persistente en el frontend; por tanto los datos se perderán al recargar la página. Esta decisión debe reflejarse en las implementaciones y en las instrucciones del README del prototipo.

En cada archivo se describe: responsabilidad, métodos mínimos, dependencias (interfaces) y notas de diseño.
