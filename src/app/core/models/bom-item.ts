// BOM item (recipe component)
export interface BOMItem {
  material_id: string;
  cantidad_requerida: number; // > 0
  unidad?: string;
}

export interface BOMItemDTO {
  material_id: string;
  cantidad_requerida: number;
  unidad?: string;
}
