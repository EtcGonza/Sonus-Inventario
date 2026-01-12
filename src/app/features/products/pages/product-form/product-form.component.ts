import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { RecipeService } from '../../../recipes/services/recipe.service';
import { Recipe } from '../../../../core/models/recipe';
import { switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditing = false;
  productId: string | null = null;
  recipes$!: Observable<Recipe[]>;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      receta_id: [null],
      precio: [0, [Validators.min(0)]],
      nota: [''],
      estado: ['draft']
    });
  }

  ngOnInit(): void {
    this.recipes$ = this.recipeService.getAll();

    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.isEditing = true;
          this.productId = id;
          return this.productService.getById(id);
        }
        return of(null);
      })
    ).subscribe(product => {
      if (product) {
        this.productForm.patchValue({
          nombre: product.nombre,
          receta_id: product.receta_id,
          precio: product.precio,
          nota: product.nota,
          estado: product.estado
        });
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const val = this.productForm.value;
    // ensure null/undefined consistency if needed
    if (!val.receta_id) val.receta_id = null;

    if (this.isEditing && this.productId) {
      this.productService.update(this.productId, val).subscribe(() => {
        this.router.navigate(['/products']);
      });
    } else {
      this.productService.create(val).subscribe(() => {
        this.router.navigate(['/products']);
      });
    }
  }
}
