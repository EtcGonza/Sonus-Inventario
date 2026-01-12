import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product, CreateProductDTO, UpdateProductDTO } from '../../core/models/product';
import { ProductRepository } from '../../core/repositories/product.repository';
import { IdService, ID_SERVICE } from '../../core/services/id-service.interface';

@Injectable({
  providedIn: 'root'
})
export class InMemoryProductRepository implements ProductRepository {
  private products: Product[] = [];

  constructor(@Inject(ID_SERVICE) private idService: IdService) {}

  getAll(): Observable<Product[]> {
    return of([...this.products]);
  }

  getById(id: string): Observable<Product | undefined> {
    return of(this.products.find(p => p.id === id));
  }

  create(dto: CreateProductDTO): Observable<Product> {
    const newProduct: Product = {
      id: this.idService.generate(),
      nombre: dto.nombre,
      receta_id: dto.receta_id ?? undefined,
      precio: dto.precio,
      nota: dto.nota,
      estado: dto.estado ?? 'draft'
    };
    this.products.push(newProduct);
    return of(newProduct);
  }

  update(id: string, dto: UpdateProductDTO): Observable<Product> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Product with id ${id} not found`);
    }
    const updated = { ...this.products[index], ...dto };
    if (updated.receta_id === null) {
        // @ts-ignore: handling DTO null to Model undefined mismatch
        updated.receta_id = undefined;
    }
    this.products[index] = updated as Product;
    return of(updated as Product);
  }

  delete(id: string): Observable<void> {
    this.products = this.products.filter(p => p.id !== id);
    return of(void 0);
  }
}
