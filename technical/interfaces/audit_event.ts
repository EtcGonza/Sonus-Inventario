// Generic audit event

export interface AuditEvent {
  id: string;
  timestamp: string; // ISO 8601
  entity_type: string; // e.g. 'Material', 'Product'
  entity_id: string;
  nota?: string;
}

export interface AuditEventDTO {
  entity_type: string;
  entity_id: string;
  nota?: string;
}
