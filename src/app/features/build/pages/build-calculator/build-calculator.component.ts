import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BuildService, BuildableResult, SimulationResult } from '../../services/build.service';
import { RecipeService } from '../../../recipes/services/recipe.service';
import { Recipe } from '../../../../core/models/recipe';
import { Observable, BehaviorSubject, map } from 'rxjs';

@Component({
  selector: 'app-build-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './build-calculator.component.html'
})
export class BuildCalculatorComponent implements OnInit {
  results$!: Observable<BuildableResult[]>;
  allRecipes: Recipe[] = [];
  simulationForm: FormGroup;
  simulationResult$ = new BehaviorSubject<SimulationResult | null>(null);

  constructor(
    private buildService: BuildService,
    private recipeService: RecipeService,
    private fb: FormBuilder
  ) {
    this.simulationForm = this.fb.group({
      items: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.results$ = this.buildService.getBuildableOverview();
    this.recipeService.getAll().pipe(
      map(recipes => recipes.filter(r => r.estado === 'active'))
    ).subscribe(recipes => {
      this.allRecipes = recipes;
    });
    this.addItem(); // Add one initial row
  }

  get items(): FormArray {
    return this.simulationForm.get('items') as FormArray;
  }

  getFilteredRecipes(currentIndex: number): Recipe[] {
    const selectedIds = this.items.value
      .map((item: any, idx: number) => idx !== currentIndex ? item.recipeId : null)
      .filter((id: string | null) => id !== null && id !== '');

    return this.allRecipes.filter(recipe => !selectedIds.includes(recipe.id));
  }

  addItem(): void {
    const group = this.fb.group({
      recipeId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
    this.items.push(group);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  onSimulate(): void {
    if (this.simulationForm.invalid) return;

    const val = this.simulationForm.value.items;
    this.buildService.simulateOrder(val).subscribe(res => {
      this.simulationResult$.next(res);
    });
  }
}
