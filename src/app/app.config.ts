import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ID_SERVICE } from './core/services/id-service.interface';
import { NanoidIdService } from './infrastructure/in-memory/nanoid-id.service';
import { MATERIAL_REPOSITORY } from './core/repositories/material.repository';
import { InMemoryMaterialRepository } from './infrastructure/in-memory/in-memory-material.repository';
import { RECIPE_REPOSITORY } from './core/repositories/recipe.repository';
import { InMemoryRecipeRepository } from './infrastructure/in-memory/in-memory-recipe.repository';
import { PRODUCT_REPOSITORY } from './core/repositories/product.repository';
import { InMemoryProductRepository } from './infrastructure/in-memory/in-memory-product.repository';
import { STOCK_EVENT_REPOSITORY } from './core/repositories/stock-event.repository';
import { InMemoryStockEventRepository } from './infrastructure/in-memory/in-memory-stock-event.repository';
import { PRODUCT_HISTORY_REPOSITORY } from './core/repositories/product-history.repository';
import { InMemoryProductHistoryRepository } from './infrastructure/in-memory/in-memory-product-history.repository';
import { APP_INITIALIZER } from '@angular/core';
import { SeedService } from './infrastructure/in-memory/seed.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: ID_SERVICE, useClass: NanoidIdService },
    { provide: MATERIAL_REPOSITORY, useClass: InMemoryMaterialRepository },
    { provide: RECIPE_REPOSITORY, useClass: InMemoryRecipeRepository },
    { provide: PRODUCT_REPOSITORY, useClass: InMemoryProductRepository },
    { provide: STOCK_EVENT_REPOSITORY, useClass: InMemoryStockEventRepository },
    { provide: PRODUCT_HISTORY_REPOSITORY, useClass: InMemoryProductHistoryRepository },
    {
      provide: APP_INITIALIZER,
      useFactory: (seed: SeedService) => () => seed.init(),
      deps: [SeedService],
      multi: true
    }
  ]
};
