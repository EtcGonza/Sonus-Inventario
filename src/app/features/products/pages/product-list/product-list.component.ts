import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { Product } from '../../../../core/models/product';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusLabelPipe, ReactiveFormsModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products$!: Observable<Product[]>;
  filteredProducts$!: Observable<Product[]>;

  searchControl = new FormControl('', { nonNullable: true });
  statusControl = new FormControl('', { nonNullable: true });

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.products$ = this.productService.getAll();

    this.filteredProducts$ = combineLatest([
      this.products$,
      this.searchControl.valueChanges.pipe(startWith('')),
      this.statusControl.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([products, search, status]) => {
        return products.filter(p => {
          const matchesSearch = p.nombre.toLowerCase().includes(search.toLowerCase());
          const matchesStatus = status === '' || p.estado === status;
          return matchesSearch && matchesStatus;
        });
      })
    );
  }

  goToDetail(id: string): void {
    this.router.navigate(['/products', id]);
  }
}
