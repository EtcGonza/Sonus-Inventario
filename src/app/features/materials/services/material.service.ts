import { Injectable, Inject } from '@angular/core';
import { Observable, switchMap, tap, of } from 'rxjs';
import { Material, CreateMaterialDTO, UpdateMaterialDTO } from '../../../core/models/material';
import { MaterialRepository, MATERIAL_REPOSITORY } from '../../../core/repositories/material.repository';
import { StockEventRepository, STOCK_EVENT_REPOSITORY } from '../../../core/repositories/stock-event.repository';
import { StockEvent } from '../../../core/models/stock-event';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  constructor(
    @Inject(MATERIAL_REPOSITORY) private repository: MaterialRepository,
    @Inject(STOCK_EVENT_REPOSITORY) private eventRepo: StockEventRepository
  ) {}

  getAll(): Observable<Material[]> {
    return this.repository.getAll();
  }

  getById(id: string): Observable<Material | undefined> {
    return this.repository.getById(id);
  }

  create(dto: CreateMaterialDTO): Observable<Material> {
    return this.repository.create(dto).pipe(
      tap(created => {
        if (created.cantidad !== 0) {
          this.eventRepo.create({
            entity_type: 'Material',
            entity_id: created.id,
            tipo: 'entrada',
            cantidad: created.cantidad,
            nota: 'Stock inicial'
          }).subscribe();
        }
      })
    );
  }

  update(id: string, dto: UpdateMaterialDTO): Observable<Material> {
      return this.repository.getById(id).pipe(
          switchMap(current => {
              if (!current) throw new Error('Material not found');
              
              const oldQty = current.cantidad;
              
              return this.repository.update(id, dto).pipe(
                  tap(updated => {
                      // Check for quantity change
                      if (dto.cantidad !== undefined && dto.cantidad !== oldQty) {
                          const diff = dto.cantidad - oldQty;
                          this.eventRepo.create({
                              entity_id: id,
                              entity_type: 'Material',
                              tipo: 'ajuste',
                              cantidad: diff,
                              nota: 'Actualización manual'
                          }).subscribe();
                      }

                      // Check for state change
                      if (dto.estado && dto.estado !== current.estado) {
                          this.eventRepo.create({
                              entity_id: id,
                              entity_type: 'Material',
                              tipo: 'ajuste', // abuse 'ajuste' for now as generic change
                              cantidad: 0,
                              nota: `Estado cambiado a: ${dto.estado}`
                          }).subscribe();
                      }
                  })
              );
          })
      );
  }

  delete(id: string): Observable<void> {
    return this.repository.delete(id);
  }

  getHistory(materialId: string): Observable<StockEvent[]> {
      return this.eventRepo.getByMaterialId(materialId);
  }
}
