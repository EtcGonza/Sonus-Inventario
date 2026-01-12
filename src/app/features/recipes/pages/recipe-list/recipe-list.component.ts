import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { Recipe } from '../../../../core/models/recipe';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusLabelPipe, ReactiveFormsModule],
  templateUrl: './recipe-list.component.html'
})
export class RecipeListComponent implements OnInit {
  recipes$!: Observable<Recipe[]>;
  filteredRecipes$!: Observable<Recipe[]>;

  searchControl = new FormControl('', { nonNullable: true });
  statusControl = new FormControl('', { nonNullable: true });

  constructor(
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recipes$ = this.recipeService.getAll();

    this.filteredRecipes$ = combineLatest([
      this.recipes$,
      this.searchControl.valueChanges.pipe(startWith('')),
      this.statusControl.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([recipes, search, status]) => {
        return recipes.filter(r => {
          const matchesSearch = r.nombre.toLowerCase().includes(search.toLowerCase());
          const matchesStatus = status === '' || r.estado === status;
          return matchesSearch && matchesStatus;
        });
      })
    );
  }

  goToDetail(id: string): void {
    this.router.navigate(['/recipes', id, 'edit']); // Recipes don't have a detail page, only edit for now according to routes
  }
}
