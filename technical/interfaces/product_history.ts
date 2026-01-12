import {AuditEvent} from "./audit_event";

export interface ProductHistory extends AuditEvent {
  campo_modificado: string;
  valor_anterior?: any;
  valor_nuevo?: any;
}

export interface ProductHistoryDTO {
  entity_id: string; // product id
  campo_modificado: string;
  valor_anterior?: any;
  valor_nuevo?: any;
  nota?: string;
}
