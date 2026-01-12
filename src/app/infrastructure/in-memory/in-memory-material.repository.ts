import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Material, CreateMaterialDTO, UpdateMaterialDTO } from '../../core/models/material';
import { MaterialRepository } from '../../core/repositories/material.repository';
import { IdService, ID_SERVICE } from '../../core/services/id-service.interface';

@Injectable({
  providedIn: 'root'
})
export class InMemoryMaterialRepository implements MaterialRepository {
  private materials: Material[] = [];

  constructor(@Inject(ID_SERVICE) private idService: IdService) {}

  getAll(): Observable<Material[]> {
    return of([...this.materials]);
  }

  getById(id: string): Observable<Material | undefined> {
    return of(this.materials.find(m => m.id === id));
  }

  create(dto: CreateMaterialDTO): Observable<Material> {
    const newMaterial: Material = {
      id: this.idService.generate(),
      nombre: dto.nombre,

      cantidad: dto.cantidad ?? 0,
      unidad: dto.unidad,
      nota: dto.nota,
      estado: dto.estado ?? 'draft'
    };
    this.materials.push(newMaterial);
    return of(newMaterial);
  }

  update(id: string, dto: UpdateMaterialDTO): Observable<Material> {
    const index = this.materials.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error(`Material with id ${id} not found`);
    }
    const updated = { ...this.materials[index], ...dto };
    this.materials[index] = updated;
    return of(updated);
  }

  delete(id: string): Observable<void> {
    this.materials = this.materials.filter(m => m.id !== id);
    return of(void 0);
  }
}
