import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../../../core/models/product';
import { ProductHistory } from '../../../../core/models/product-history';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';
import { Observable, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusLabelPipe],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  product$!: Observable<Product | undefined>;
  history$!: Observable<ProductHistory[]>;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.product$ = this.route.paramMap.pipe(
        switchMap(params => {
            const id = params.get('id');
            return id ? this.productService.getById(id) : of(undefined);
        })
    );

    this.history$ = this.route.paramMap.pipe(
        switchMap(params => {
            const id = params.get('id');
            return id ? this.productService.getHistory(id) : of([]);
        })
    );
  }
}
