import { Injectable } from '@angular/core';
import { Resource } from '../models/resource.model';

@Injectable({ providedIn: 'root' })
export class ResourceService {
  private resources: Resource[] = [
    { id: 1, name: 'Переговорная 1' },
    { id: 2, name: 'Проектор' },
    { id: 3, name: 'Ноутбук' }
  ];

  getResources(): Resource[] {
    return this.resources;
  }
}
