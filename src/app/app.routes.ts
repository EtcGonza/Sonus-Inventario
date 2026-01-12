import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { 
    path: 'materials', 
    loadChildren: () => import('./features/materials/materials.routes').then(m => m.MATERIALS_ROUTES) 
  },
  { 
    path: 'recipes', 
    loadChildren: () => import('./features/recipes/recipes.routes').then(m => m.RECIPES_ROUTES) 
  },
  { 
    path: 'products', 
    loadChildren: () => import('./features/products/products.routes').then(m => m.PRODUCTS_ROUTES) 
  },
  { 
    path: 'build', 
    loadChildren: () => import('./features/build/build.routes').then(m => m.BUILD_ROUTES) 
  }
];
