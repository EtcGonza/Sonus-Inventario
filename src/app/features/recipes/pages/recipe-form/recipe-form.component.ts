import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { MaterialService } from '../../../materials/services/material.service';
import { Material } from '../../../../core/models/material';
import { switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recipe-form.component.html'
})
export class RecipeFormComponent implements OnInit {
  recipeForm: FormGroup;
  isEditing = false;
  recipeId: string | null = null;
  materials$!: Observable<Material[]>;

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private materialService: MaterialService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.recipeForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      materiales: this.fb.array([]),
      estado: ['draft']
    });
  }

  ngOnInit(): void {
    this.materials$ = this.materialService.getAll();

    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.isEditing = true;
          this.recipeId = id;
          return this.recipeService.getById(id);
        }
        return of(null);
      })
    ).subscribe(recipe => {
      if (recipe) {
        this.recipeForm.patchValue({
          nombre: recipe.nombre,
          descripcion: recipe.descripcion,
          estado: recipe.estado
        });
        
        recipe.materiales.forEach(m => {
          this.addMaterial(m.material_id, m.cantidad_requerida, m.unidad);
        });
      } else if (!this.isEditing) {
          // Maybe add one empty row by default?
          // this.addMaterial();
      }
    });
  }

  get materiales(): FormArray {
    return this.recipeForm.get('materiales') as FormArray;
  }

  addMaterial(materialId: string = '', cantidad: number = 1, unidad: string = ''): void {
    const group = this.fb.group({
      material_id: [materialId, Validators.required],
      cantidad_requerida: [cantidad, [Validators.required, Validators.min(0.001)]],
      unidad: [unidad] // Optional, maybe we want to fetch it from material reference
    });
    this.materiales.push(group);
  }

  removeMaterial(index: number): void {
    this.materiales.removeAt(index);
  }

  onSubmit(): void {
    if (this.recipeForm.invalid) return;

    const val = this.recipeForm.value;

    if (this.isEditing && this.recipeId) {
      this.recipeService.update(this.recipeId, val).subscribe(() => {
        this.router.navigate(['/recipes']);
      });
    } else {
      this.recipeService.create(val).subscribe(() => {
        this.router.navigate(['/recipes']);
      });
    }
  }
}
