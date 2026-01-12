import {BOMItem} from "./bom_item";
import {MaterialState} from "./material";

export interface Recipe {
  id: string;
  nombre: string;
  descripcion?: string;
  materiales: BOMItem[];
  estado: MaterialState; // reuse same states
}

export interface CreateRecipeDTO {
  nombre: string;
  descripcion?: string;
  materiales: BOMItem[]; // initial list
}

export interface UpdateRecipeDTO {
  nombre?: string;
  descripcion?: string;
  materiales?: BOMItem[];
  estado?: MaterialState;
}
