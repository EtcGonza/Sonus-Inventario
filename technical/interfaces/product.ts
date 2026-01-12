import {MaterialState} from "./material";

export interface Product {
  id: string;
  nombre: string;
  receta_id?: string;
  precio?: number;
  nota?: string;
  estado: MaterialState;
}

export interface CreateProductDTO {
  nombre: string;
  receta_id?: string;
  precio?: number;
  nota?: string;
}

export interface UpdateProductDTO {
  nombre?: string;
  receta_id?: string | null;
  precio?: number;
  nota?: string;
  estado?: MaterialState;
}
