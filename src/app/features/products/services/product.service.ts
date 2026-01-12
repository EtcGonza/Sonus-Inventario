import { Injectable, Inject } from '@angular/core';
import { Observable, switchMap, tap, of } from 'rxjs';
import { Product, CreateProductDTO, UpdateProductDTO } from '../../../core/models/product';
import { ProductRepository, PRODUCT_REPOSITORY } from '../../../core/repositories/product.repository';
import { ProductHistoryRepository, PRODUCT_HISTORY_REPOSITORY } from '../../../core/repositories/product-history.repository';
import { ProductHistory } from '../../../core/models/product-history';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private repository: ProductRepository,
    @Inject(PRODUCT_HISTORY_REPOSITORY) private historyRepo: ProductHistoryRepository
  ) {}

  getAll(): Observable<Product[]> {
    return this.repository.getAll();
  }

  getById(id: string): Observable<Product | undefined> {
    return this.repository.getById(id);
  }

  create(dto: CreateProductDTO): Observable<Product> {
    return this.repository.create(dto).pipe(
      tap(created => {
        this.historyRepo.create({
          entity_id: created.id,
          campo_modificado: 'CREATION',
          valor_nuevo: 'Created',
          nota: 'Producto creado'
        }).subscribe();
      })
    );
  }

  update(id: string, dto: UpdateProductDTO): Observable<Product> {
    return this.repository.getById(id).pipe(
      switchMap(current => {
        if (!current) throw new Error('Product not found');
        const oldProduct = { ...current };

        return this.repository.update(id, dto).pipe(
          tap(updated => {
            // Compare fields and log changes
            // Note: In a real app we might iterate keys, but here explicit checks are safer for types
            this.logChange(id, 'nombre', oldProduct.nombre, updated.nombre);
            this.logChange(id, 'receta_id', oldProduct.receta_id, updated.receta_id);
            this.logChange(id, 'precio', oldProduct.precio, updated.precio);
            this.logChange(id, 'nota', oldProduct.nota, updated.nota);
            this.logChange(id, 'estado', oldProduct.estado, updated.estado);
          })
        );
      })
    );
  }

  delete(id: string): Observable<void> {
    return this.repository.delete(id);
  }

  getHistory(productId: string): Observable<ProductHistory[]> {
    return this.historyRepo.getByProductId(productId);
  }

  private logChange(id: string, field: string, oldVal: any, newVal: any) {
    if (oldVal !== newVal) {
       // treat undefined/null equality loosely if needed, but stricter is better
       if ((oldVal === undefined || oldVal === null) && (newVal === undefined || newVal === null)) return;

       this.historyRepo.create({
         entity_id: id,
         campo_modificado: field,
         valor_anterior: oldVal,
         valor_nuevo: newVal
       }).subscribe();
    }
  }
}
