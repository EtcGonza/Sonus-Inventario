export type MaterialState = 'draft' | 'active' | 'disabled';

export interface Material {
  id: string; // generated via IdService / nanoid
  nombre: string;
  cantidad: number; // >= 0
  unidad: string;
  nota?: string;
  estado: MaterialState;
}

export interface CreateMaterialDTO {
  nombre: string;
  cantidad?: number; // default 0
  unidad: string;
  nota?: string;
  estado?: MaterialState;
}

export interface UpdateMaterialDTO {
  nombre?: string;
  cantidad?: number;
  unidad?: string;
  nota?: string;
  estado?: MaterialState;
}

