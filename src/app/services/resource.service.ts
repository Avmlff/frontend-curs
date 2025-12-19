import { Injectable } from '@angular/core';
import { Resource } from '../models/resource.model';

@Injectable({ providedIn: 'root' })
export class ResourceService {
  private resources: Resource[] = [
    { id: 1, name: 'Переговорная A' },
    { id: 2, name: 'Переговорная B' },
    { id: 3, name: 'Проектор' },
    { id: 4, name: 'Ноутбук' }
  ];

  getResources() {
    return this.resources;
  }

  addResource(name: string) {
    const newId = Math.max(...this.resources.map(r => r.id)) + 1;
    this.resources.push({ id: newId, name });
  }

  removeResource(id: number) {
    this.resources = this.resources.filter(r => r.id !== id);
  }
}
