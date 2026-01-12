import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusLabel',
  standalone: true
})
export class StatusLabelPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    if (!value) return '';
    switch (value.toLowerCase()) {
      case 'active': return 'Activo';
      case 'draft': return 'Borrador';
      case 'disabled': return 'Deshabilitado';
      default: return value;
    }
  }
}
