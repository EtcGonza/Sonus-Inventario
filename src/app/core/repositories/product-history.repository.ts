import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { ProductHistory, ProductHistoryDTO } from '../models/product-history';

export const PRODUCT_HISTORY_REPOSITORY = new InjectionToken<ProductHistoryRepository>('ProductHistoryRepository');

export interface ProductHistoryRepository {
  getAll(): Observable<ProductHistory[]>;
  getByProductId(productId: string): Observable<ProductHistory[]>;
  create(dto: ProductHistoryDTO): Observable<ProductHistory>;
}
