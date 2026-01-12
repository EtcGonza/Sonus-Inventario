import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe, CreateRecipeDTO, UpdateRecipeDTO } from '../../../core/models/recipe';
import { RecipeRepository, RECIPE_REPOSITORY } from '../../../core/repositories/recipe.repository';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  constructor(@Inject(RECIPE_REPOSITORY) private repository: RecipeRepository) {}

  getAll(): Observable<Recipe[]> {
    return this.repository.getAll();
  }

  getById(id: string): Observable<Recipe | undefined> {
    return this.repository.getById(id);
  }

  create(dto: CreateRecipeDTO): Observable<Recipe> {
    return this.repository.create(dto);
  }

  update(id: string, dto: UpdateRecipeDTO): Observable<Recipe> {
    return this.repository.update(id, dto);
  }

  delete(id: string): Observable<void> {
    return this.repository.delete(id);
  }
}
