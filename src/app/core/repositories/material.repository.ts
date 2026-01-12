import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { Material, CreateMaterialDTO, UpdateMaterialDTO } from '../models/material';

export const MATERIAL_REPOSITORY = new InjectionToken<MaterialRepository>('MaterialRepository');

export interface MaterialRepository {
  getAll(): Observable<Material[]>;
  getById(id: string): Observable<Material | undefined>;
  create(material: CreateMaterialDTO): Observable<Material>;
  update(id: string, material: UpdateMaterialDTO): Observable<Material>;
  delete(id: string): Observable<void>;
}
