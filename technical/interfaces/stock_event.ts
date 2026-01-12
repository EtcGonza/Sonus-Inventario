import {AuditEvent} from "./audit_event";

export type StockEventType = "entrada" | "salida" | "ajuste" | "baja";

export interface StockEvent extends AuditEvent {
  tipo: StockEventType;
  cantidad: number; // positive for entradas, negative for salidas/ajustes
}

export interface StockEventDTO {
  entity_type?: "Material";
  entity_id: string; // material id
  tipo: StockEventType;
  cantidad: number;
  nota?: string;
}
