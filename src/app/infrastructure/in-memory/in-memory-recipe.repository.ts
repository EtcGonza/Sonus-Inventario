import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Recipe, CreateRecipeDTO, UpdateRecipeDTO } from '../../core/models/recipe';
import { RecipeRepository } from '../../core/repositories/recipe.repository';
import { IdService, ID_SERVICE } from '../../core/services/id-service.interface';

@Injectable({
  providedIn: 'root'
})
export class InMemoryRecipeRepository implements RecipeRepository {
  private recipes: Recipe[] = [];

  constructor(@Inject(ID_SERVICE) private idService: IdService) {}

  getAll(): Observable<Recipe[]> {
    return of([...this.recipes]);
  }

  getById(id: string): Observable<Recipe | undefined> {
    return of(this.recipes.find(r => r.id === id));
  }

  create(dto: CreateRecipeDTO): Observable<Recipe> {
    const newRecipe: Recipe = {
      id: this.idService.generate(),
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      materiales: dto.materiales,
      estado: dto.estado ?? 'draft'
    };
    this.recipes.push(newRecipe);
    return of(newRecipe);
  }

  update(id: string, dto: UpdateRecipeDTO): Observable<Recipe> {
    const index = this.recipes.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error(`Recipe with id ${id} not found`);
    }
    const updated = { ...this.recipes[index], ...dto };
    this.recipes[index] = updated;
    return of(updated);
  }

  delete(id: string): Observable<void> {
    this.recipes = this.recipes.filter(r => r.id !== id);
    return of(void 0);
  }
}
