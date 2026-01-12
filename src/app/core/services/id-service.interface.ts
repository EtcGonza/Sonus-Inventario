// Abstraction for id generation
import { InjectionToken } from '@angular/core';

export interface IdService {
  generate(): string;
}

export const ID_SERVICE = new InjectionToken<IdService>('IdService');
