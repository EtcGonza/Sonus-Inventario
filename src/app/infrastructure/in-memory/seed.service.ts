import { Injectable, Inject } from '@angular/core';
import { forkJoin, switchMap, of } from 'rxjs';
import { MaterialRepository, MATERIAL_REPOSITORY } from '../../core/repositories/material.repository';
import { RecipeRepository, RECIPE_REPOSITORY } from '../../core/repositories/recipe.repository';
import { ProductRepository, PRODUCT_REPOSITORY } from '../../core/repositories/product.repository';
import { CreateMaterialDTO, Material } from '../../core/models/material';
import { CreateRecipeDTO, Recipe } from '../../core/models/recipe';
import { CreateProductDTO } from '../../core/models/product';

@Injectable({
  providedIn: 'root'
})
export class SeedService {
  constructor(
    @Inject(MATERIAL_REPOSITORY) private materialRepo: MaterialRepository,
    @Inject(RECIPE_REPOSITORY) private recipeRepo: RecipeRepository,
    @Inject(PRODUCT_REPOSITORY) private productRepo: ProductRepository
  ) {}

  init() {
    console.log('Seeding data...');

    // 1. Create Materials
    const materials: CreateMaterialDTO[] = [
      // Magnets
      { nombre: 'Alnico 5 Rod Magnet', cantidad: 200, unidad: 'unidades', nota: 'Para Strat/Tele', estado: 'active' },
      { nombre: 'Alnico 2 Bar Magnet', cantidad: 50, unidad: 'unidades', nota: 'Para Humbuckers (Vintage)', estado: 'active' },
      { nombre: 'Ceramic 8 Bar Magnet', cantidad: 100, unidad: 'unidades', nota: 'High output', estado: 'active' },
      { nombre: 'Alnico 3 Rod Magnet', cantidad: 0, unidad: 'unidades', nota: 'Stock agotado', estado: 'active' },

      // Wire
      { nombre: 'Copper Wire 42 AWG Heavy Formvar', cantidad: 15000, unidad: 'metros', nota: 'Vintage Fender spec', estado: 'active' },
      { nombre: 'Copper Wire 42 AWG Plain Enamel', cantidad: 8000, unidad: 'metros', nota: 'PAF spec', estado: 'active' },
      { nombre: 'Copper Wire 43 AWG Polysol', cantidad: 20000, unidad: 'metros', nota: 'High output / Tele Neck', estado: 'active' },

      // Flatwork / Bobbins
      { nombre: 'Strat Fiber Flatwork (Top)', cantidad: 50, unidad: 'unidades', estado: 'active' },
      { nombre: 'Strat Fiber Flatwork (Bottom)', cantidad: 50, unidad: 'unidades', estado: 'active' },
      { nombre: 'Tele Bridge Flatwork (Top)', cantidad: 30, unidad: 'unidades', estado: 'active' },
      { nombre: 'Tele Bridge Flatwork (Bottom)', cantidad: 30, unidad: 'unidades', estado: 'active' },
      { nombre: 'Humbucker Bobbin (Screw)', cantidad: 40, unidad: 'unidades', estado: 'active' },
      { nombre: 'Humbucker Bobbin (Slug)', cantidad: 40, unidad: 'unidades', estado: 'active' },

      // Hardware
      { nombre: 'Humbucker Baseplate (Nickel)', cantidad: 20, unidad: 'unidades', estado: 'active' },
      { nombre: 'Tele Bridge Baseplate (Copper)', cantidad: 15, unidad: 'unidades', estado: 'active' },
      { nombre: 'Polepiece Screws (Nickel)', cantidad: 120, unidad: 'unidades', estado: 'active' },
      { nombre: 'Polepiece Slugs (Steel)', cantidad: 120, unidad: 'unidades', estado: 'active' },
      { nombre: 'Mounting Screws (Generic)', cantidad: 500, unidad: 'unidades', estado: 'active' },
      
      // Consumables / Packaging
      { nombre: 'Pickup Wax (Potting)', cantidad: 5, unidad: 'kg', estado: 'active' },
      { nombre: 'Cloth Push-back Wire (Black)', cantidad: 100, unidad: 'metros', estado: 'active' },
      { nombre: 'Cloth Push-back Wire (White)', cantidad: 100, unidad: 'metros', estado: 'active' },
      
      // Draft/Disabled for testing
      { nombre: 'Experimental Alloy Magnet', cantidad: 10, unidad: 'unidades', estado: 'draft', nota: 'Testing phase' },
      { nombre: 'Old Plastic Bobbins', cantidad: 1000, unidad: 'unidades', estado: 'disabled', nota: 'Defective batch' }
    ];

    const materialObservables = materials.map(m => this.materialRepo.create(m));

    forkJoin(materialObservables).pipe(
      switchMap((createdMaterials: Material[]) => {
        const m = (namePartial: string) => createdMaterials.find(mat => mat.nombre.includes(namePartial))?.id;

        // Recipes
        const recipes: CreateRecipeDTO[] = [
          // 1. Vintage Strat Set
          {
            nombre: 'Vintage 60s Strat',
            descripcion: 'Classic single coil with scooped mids.',
            estado: 'active',
            materiales: [
              { material_id: m('Alnico 5 Rod')!, cantidad_requerida: 6, unidad: 'unidades' },
              { material_id: m('Wire 42 AWG Heavy')!, cantidad_requerida: 180, unidad: 'metros' }, // ~6000 turns aprox
              { material_id: m('Strat Fiber Flatwork (Top)')!, cantidad_requerida: 1, unidad: 'unidades' },
              { material_id: m('Strat Fiber Flatwork (Bottom)')!, cantidad_requerida: 1, unidad: 'unidades' },
              { material_id: m('Wire (Black)')!, cantidad_requerida: 0.25, unidad: 'metros' },
              { material_id: m('Wire (White)')!, cantidad_requerida: 0.25, unidad: 'metros' },
            ]
          },
          // 2. PAF Humbucker
          {
            nombre: 'PAF Style Humbucker',
            descripcion: 'Late 50s humbucker tone. Plain Enamel wire.',
            estado: 'active',
            materiales: [
              { material_id: m('Alnico 2 Bar')!, cantidad_requerida: 1, unidad: 'unidades' },
              { material_id: m('Wire 42 AWG Plain')!, cantidad_requerida: 350, unidad: 'metros' }, // Two coils
              { material_id: m('Humbucker Bobbin (Screw)')!, cantidad_requerida: 1, unidad: 'unidades' },
              { material_id: m('Humbucker Bobbin (Slug)')!, cantidad_requerida: 1, unidad: 'unidades' },
              { material_id: m('Polepiece Screws')!, cantidad_requerida: 6, unidad: 'unidades' },
              { material_id: m('Polepiece Slugs')!, cantidad_requerida: 6, unidad: 'unidades' },
              { material_id: m('Humbucker Baseplate')!, cantidad_requerida: 1, unidad: 'unidades' }
            ]
          },
          // 3. Hot Tele Bridge
          {
            nombre: 'Texas Hot Tele Bridge',
            descripcion: 'Overwound Telecaster bridge pickup.',
            estado: 'active',
            materiales: [
              { material_id: m('Alnico 5 Rod')!, cantidad_requerida: 6, unidad: 'unidades' },
              { material_id: m('Wire 43 AWG')!, cantidad_requerida: 220, unidad: 'metros' },
              { material_id: m('Tele Bridge Flatwork (Top)')!, cantidad_requerida: 1, unidad: 'unidades' },
              { material_id: m('Tele Bridge Flatwork (Bottom)')!, cantidad_requerida: 1, unidad: 'unidades' },
              { material_id: m('Tele Bridge Baseplate')!, cantidad_requerida: 1, unidad: 'unidades' }
            ]
          },
          // 4. Draft Recipe (Incomplete)
          {
            nombre: 'Prototype Jazzmaster',
            descripcion: 'Testing new wind.',
            estado: 'draft',
            materiales: [
              { material_id: m('Wire 42 AWG Heavy')!, cantidad_requerida: 200, unidad: 'metros' }
            ]
          },
          // 5. Recipe with missing stock (uses Alnico 3 which is 0 stock)
          {
            nombre: '1954 Strat Replica',
            descripcion: 'Uses Alnico 3 magnets (currently out of stock).',
            estado: 'active',
            materiales: [
              { material_id: m('Alnico 3 Rod')!, cantidad_requerida: 6, unidad: 'unidades' }, // Stock 0
              { material_id: m('Wire 42 AWG Heavy')!, cantidad_requerida: 180, unidad: 'metros' },
              { material_id: m('Strat Fiber Flatwork (Top)')!, cantidad_requerida: 1, unidad: 'unidades' },
              { material_id: m('Strat Fiber Flatwork (Bottom)')!, cantidad_requerida: 1, unidad: 'unidades' }
            ]
          }
        ];

        return forkJoin(recipes.map(r => this.recipeRepo.create(r)));
      }),
      switchMap((createdRecipes: Recipe[]) => {
        const findRecipe = (nameFragment: string) => createdRecipes.find(r => r.nombre.includes(nameFragment))?.id;

        const stratId = findRecipe('Vintage 60s');
        const pafId = findRecipe('PAF Style');
        const teleId = findRecipe('Texas Hot');
        const strat54Id = findRecipe('1954 Strat');

        // Products
        const products: CreateProductDTO[] = [
          {
            nombre: 'Sonus 60s Strat - Bridge',
            receta_id: stratId,
            precio: 89.99,
            estado: 'active',
            nota: 'Top seller'
          },
          {
            nombre: 'Sonus 60s Strat - Neck',
            receta_id: stratId, // Same recipe for simplicity in this seed
            precio: 89.99,
            estado: 'active',
            nota: 'Reverse wound available'
          },
          {
            nombre: 'Sonus 60s Strat - Middle (RWRP)',
            receta_id: stratId,
            precio: 94.99,
            estado: 'active',
            nota: 'Reverse wound, reverse polarity'
          },
          {
            nombre: 'Imperial PAF Humbucker Bridge',
            receta_id: pafId,
            precio: 149.99,
            estado: 'active',
            nota: 'Aged nickel cover optional'
          },
          {
            nombre: 'Imperial PAF Humbucker Neck',
            receta_id: pafId,
            precio: 149.99,
            estado: 'active',
            nota: 'Sweet woman tone'
          },
          {
            nombre: 'Austin Power Tele Bridge',
            receta_id: teleId,
            precio: 99.99,
            estado: 'active',
            nota: 'High output twang'
          },
          {
            nombre: '54 Anniversary Strat (Limited)',
            receta_id: strat54Id,
            precio: 199.99,
            estado: 'disabled', // Disabled product
            nota: 'Waiting for Alnico 3 magnets'
          },
          {
            nombre: 'Custom Shop Order #223',
            receta_id: null,
            precio: 250.00,
            estado: 'draft',
            nota: 'Custom specs pending customer approval'
          }
        ];

        return forkJoin(products.map(p => this.productRepo.create(p)));
      })
    ).subscribe({
      next: () => console.log('Seeding complete! Data loaded.'),
      error: (err) => console.error('Seeding failed', err)
    });
  }
}
