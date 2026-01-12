import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StockEvent, StockEventDTO } from '../../core/models/stock-event';
import { StockEventRepository } from '../../core/repositories/stock-event.repository';
import { IdService, ID_SERVICE } from '../../core/services/id-service.interface';

@Injectable({
  providedIn: 'root'
})
export class InMemoryStockEventRepository implements StockEventRepository {
  private events: StockEvent[] = [];

  constructor(@Inject(ID_SERVICE) private idService: IdService) {}

  getAll(): Observable<StockEvent[]> {
    return of([...this.events]);
  }

  getByMaterialId(materialId: string): Observable<StockEvent[]> {
    return of(this.events.filter(e => e.entity_id === materialId).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  }

  create(dto: StockEventDTO): Observable<StockEvent> {
    const newEvent: StockEvent = {
        id: this.idService.generate(),
        timestamp: new Date().toISOString(),
        entity_type: dto.entity_type || 'Material',
        entity_id: dto.entity_id,
        tipo: dto.tipo,
        cantidad: dto.cantidad,
        nota: dto.nota
    };
    this.events.push(newEvent);
    return of(newEvent);
  }
}
