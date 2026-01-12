import { Routes } from '@angular/router';
import { RecipeListComponent } from './pages/recipe-list/recipe-list.component';
import { RecipeFormComponent } from './pages/recipe-form/recipe-form.component';

export const RECIPES_ROUTES: Routes = [
  { path: '', component: RecipeListComponent },
  { path: 'new', component: RecipeFormComponent },
  { path: ':id/edit', component: RecipeFormComponent }
];
