import { Injectable } from '@angular/core';

export interface Resource {
  id: number;
  name: string;
  type: 'room' | 'equipment';
  capacity?: number;
}

@Injectable({ providedIn: 'root' })
export class ResourceService {
  private resources: Resource[] = [
    { id: 1, name: 'Переговорная A', type: 'room', capacity: 10 },
    { id: 2, name: 'Переговорная B', type: 'room', capacity: 6 },
    { id: 3, name: 'Проектор', type: 'equipment' },
    { id: 4, name: 'Ноутбук', type: 'equipment' },
    { id: 5, name: 'Конференц-зал', type: 'room', capacity: 20 }
  ];

  getResources(): Resource[] {
    return this.resources;
  }

  addResource(name: string, type: 'room' | 'equipment' = 'room', capacity?: number) {
    const newId = this.resources.length > 0
      ? Math.max(...this.resources.map(r => r.id)) + 1
      : 1;
    this.resources.push({ id: newId, name, type, capacity });
  }

  removeResource(id: number) {
    this.resources = this.resources.filter(r => r.id !== id);
  }

  getTotalResources(): number {
    return this.resources.length;
  }
}
