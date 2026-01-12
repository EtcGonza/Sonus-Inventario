import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { Product, CreateProductDTO, UpdateProductDTO } from '../models/product';

export const PRODUCT_REPOSITORY = new InjectionToken<ProductRepository>('ProductRepository');

export interface ProductRepository {
  getAll(): Observable<Product[]>;
  getById(id: string): Observable<Product | undefined>;
  create(product: CreateProductDTO): Observable<Product>;
  update(id: string, product: UpdateProductDTO): Observable<Product>;
  delete(id: string): Observable<void>;
}
