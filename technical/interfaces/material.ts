// Interfaces and DTOs for Material

export type MaterialState = "draft" | "active" | "disabled";

export interface Material {
  id: string; // generated via IdService / nanoid
  nombre: string;
  codigo?: string;
  cantidad: number; // >= 0
  unidad: string;
  nota?: string;
  estado: MaterialState;
}

export interface CreateMaterialDTO {
  nombre: string;
  codigo?: string;
  cantidad?: number; // default 0
  unidad: string;
  nota?: string;
}

export interface UpdateMaterialDTO {
  nombre?: string;
  codigo?: string;
  cantidad?: number;
  unidad?: string;
  nota?: string;
  estado?: MaterialState;
}
