import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductHistory, ProductHistoryDTO } from '../../core/models/product-history';
import { ProductHistoryRepository } from '../../core/repositories/product-history.repository';
import { IdService, ID_SERVICE } from '../../core/services/id-service.interface';

@Injectable({
  providedIn: 'root'
})
export class InMemoryProductHistoryRepository implements ProductHistoryRepository {
  private history: ProductHistory[] = [];

  constructor(@Inject(ID_SERVICE) private idService: IdService) {}

  getAll(): Observable<ProductHistory[]> {
    return of([...this.history]);
  }

  getByProductId(productId: string): Observable<ProductHistory[]> {
    return of(this.history.filter(h => h.entity_id === productId).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  }

  create(dto: ProductHistoryDTO): Observable<ProductHistory> {
    const newEntry: ProductHistory = {
      id: this.idService.generate(),
      timestamp: new Date().toISOString(),
      entity_type: 'Product',
      entity_id: dto.entity_id,
      campo_modificado: dto.campo_modificado,
      valor_anterior: dto.valor_anterior,
      valor_nuevo: dto.valor_nuevo,
      nota: dto.nota
    };
    this.history.push(newEntry);
    return of(newEntry);
  }
}
