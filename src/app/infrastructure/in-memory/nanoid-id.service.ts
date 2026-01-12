import { Injectable } from '@angular/core';
import { nanoid } from 'nanoid';
import { IdService } from '../../core/services/id-service.interface';

@Injectable({
  providedIn: 'root'
})
export class NanoidIdService implements IdService {
  generate(): string {
    return nanoid();
  }
}
