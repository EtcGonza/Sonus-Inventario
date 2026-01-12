import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { StockEvent, StockEventDTO } from '../models/stock-event';

export const STOCK_EVENT_REPOSITORY = new InjectionToken<StockEventRepository>('StockEventRepository');

export interface StockEventRepository {
  getAll(): Observable<StockEvent[]>;
  getByMaterialId(materialId: string): Observable<StockEvent[]>;
  create(dto: StockEventDTO): Observable<StockEvent>;
}
