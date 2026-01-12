import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { Recipe, CreateRecipeDTO, UpdateRecipeDTO } from '../models/recipe';

export const RECIPE_REPOSITORY = new InjectionToken<RecipeRepository>('RecipeRepository');

export interface RecipeRepository {
  getAll(): Observable<Recipe[]>;
  getById(id: string): Observable<Recipe | undefined>;
  create(recipe: CreateRecipeDTO): Observable<Recipe>;
  update(id: string, recipe: UpdateRecipeDTO): Observable<Recipe>;
  delete(id: string): Observable<void>;
}
