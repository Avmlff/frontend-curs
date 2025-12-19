import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ResourceService } from '../services/resource.service';

@Component({
  selector: 'app-resource-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatListModule,
    MatButtonModule,
    MatInputModule
  ],
  template: `
    <div style="padding: 20px;">
      <h2>Управление ресурсами</h2>

      <form [formGroup]="resourceForm" (ngSubmit)="addResource()">
        <mat-form-field appearance="fill" style="width: 300px; margin-right: 10px;">
          <mat-label>Название ресурса</mat-label>
          <input matInput formControlName="name">
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" [disabled]="resourceForm.invalid">
          Добавить
        </button>
      </form>

      <mat-list>
        <mat-list-item *ngFor="let resource of resources">
          {{ resource.name }}
          <button mat-button color="warn" (click)="removeResource(resource.id)" style="margin-left: auto;">
            Удалить
          </button>
        </mat-list-item>
      </mat-list>
    </div>
  `
})
export class ResourceManagementComponent implements OnInit {
  resourceForm: FormGroup;
  resources: any[] = [];

  constructor(
    private fb: FormBuilder,
    private resourceService: ResourceService
  ) {
    this.resourceForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.resources = this.resourceService.getResources();
  }

  addResource() {
    if (this.resourceForm.valid) {
      this.resourceService.addResource(this.resourceForm.value.name);
      this.resources = this.resourceService.getResources();
      this.resourceForm.reset();
    }
  }

  removeResource(id: number) {
    this.resourceService.removeResource(id);
    this.resources = this.resourceService.getResources();
  }
}
