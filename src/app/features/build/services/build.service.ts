import { Injectable, Inject } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { MaterialRepository, MATERIAL_REPOSITORY } from '../../../core/repositories/material.repository';
import { RecipeRepository, RECIPE_REPOSITORY } from '../../../core/repositories/recipe.repository';
import { Recipe } from '../../../core/models/recipe';
import { Material } from '../../../core/models/material';

export interface BuildableResult {
  recipeId: string;
  recipeName: string;
  maxBuildable: number;
  limitingMaterialName?: string;
  // Could add more details like missing items for 1 unit
}

export interface OrderSimulationItem {
  recipeId: string;
  quantity: number;
}

export interface MissingMaterial {
  materialId: string;
  materialName: string;
  needed: number;
  available: number;
  missing: number;
  unit: string;
}

export interface SimulationResult {
  requestedItems: {
    recipeName: string;
    quantity: number;
    canBuild: boolean;
  }[];
  isWholeOrderPossible: boolean;
  missingMaterials: MissingMaterial[];
}

@Injectable({
  providedIn: 'root'
})
export class BuildService {
  constructor(
    @Inject(MATERIAL_REPOSITORY) private materialRepo: MaterialRepository,
    @Inject(RECIPE_REPOSITORY) private recipeRepo: RecipeRepository
  ) {}

  getBuildableOverview(): Observable<BuildableResult[]> {
    return combineLatest([
      this.recipeRepo.getAll(),
      this.materialRepo.getAll()
    ]).pipe(
      map(([recipes, materials]) => {
        return recipes
          .filter(r => r.estado === 'active') // Only active recipes
          .map(recipe => this.calculateForRecipe(recipe, materials));
      })
    );
  }

  simulateOrder(orderItems: OrderSimulationItem[]): Observable<SimulationResult> {
    return combineLatest([
      this.recipeRepo.getAll(),
      this.materialRepo.getAll()
    ]).pipe(
      map(([recipes, materials]) => {
        const totalNeeded = new Map<string, number>();
        const requestedResults: SimulationResult['requestedItems'] = [];

        // 1. Calculate total needs and individual feasibility (naive check for individual)
        for (const item of orderItems) {
          const recipe = recipes.find(r => r.id === item.recipeId);
          if (!recipe) continue;

          let individualPossible = true;
          for (const bomItem of recipe.materiales) {
            const mat = materials.find(m => m.id === bomItem.material_id);
            const neededForThis = bomItem.cantidad_requerida * item.quantity;
            
            // Track cumulative
            const currentTotal = totalNeeded.get(bomItem.material_id) || 0;
            totalNeeded.set(bomItem.material_id, currentTotal + neededForThis);

            if (!mat || mat.cantidad < neededForThis) {
              individualPossible = false;
            }
          }

          requestedResults.push({
            recipeName: recipe.nombre,
            quantity: item.quantity,
            canBuild: individualPossible
          });
        }

        // 2. Check cumulative feasibility
        const missingMaterials: MissingMaterial[] = [];
        let isWholeOrderPossible = true;

        totalNeeded.forEach((needed, materialId) => {
          const mat = materials.find(m => m.id === materialId);
          const available = mat ? mat.cantidad : 0;
          
          if (available < needed) {
            isWholeOrderPossible = false;
            missingMaterials.push({
              materialId,
              materialName: mat ? mat.nombre : 'Material desconocido',
              needed,
              available,
              missing: needed - available,
              unit: mat ? mat.unidad : ''
            });
          }
        });

        return {
          requestedItems: requestedResults,
          isWholeOrderPossible,
          missingMaterials
        };
      })
    );
  }

  private calculateForRecipe(recipe: Recipe, materials: Material[]): BuildableResult {
    let maxBuildable = Infinity;
    let limitingMat = null;

    if (!recipe.materiales || recipe.materiales.length === 0) {
      return {
        recipeId: recipe.id,
        recipeName: recipe.nombre,
        maxBuildable: 0,
        limitingMaterialName: 'No materials defined'
      };
    }

    for (const item of recipe.materiales) {
      const material = materials.find(m => m.id === item.material_id);
      if (!material) {
        // Material missing from DB entirely? Treat as 0 stock.
        maxBuildable = 0;
        limitingMat = 'Unknown Material';
        break;
      }

      if (item.cantidad_requerida <= 0) continue; // Should not happen given validation

      const canMake = Math.floor(material.cantidad / item.cantidad_requerida);
      if (canMake < maxBuildable) {
        maxBuildable = canMake;
        limitingMat = material.nombre;
      }
    }

    if (maxBuildable === Infinity) maxBuildable = 0; 

    return {
      recipeId: recipe.id,
      recipeName: recipe.nombre,
      maxBuildable: maxBuildable,
      limitingMaterialName: limitingMat || undefined
    };
  }
}
