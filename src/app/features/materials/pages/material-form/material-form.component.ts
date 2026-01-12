import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialService } from '../../services/material.service';
import { switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-material-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './material-form.component.html'
})
export class MaterialFormComponent implements OnInit {
  materialForm: FormGroup;
  isEditing = false;
  materialId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private materialService: MaterialService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.materialForm = this.fb.group({
      nombre: ['', Validators.required],
      cantidad: [0, [Validators.required, Validators.min(0)]],
      unidad: ['', Validators.required],
      nota: [''],
      estado: ['draft'] // Only shown/used in edit usually, but handy to have
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.isEditing = true;
          this.materialId = id;
          return this.materialService.getById(id);
        }
        return of(null);
      })
    ).subscribe(material => {
      if (material) {
        this.materialForm.patchValue({
          nombre: material.nombre,
          cantidad: material.cantidad,
          unidad: material.unidad,
          nota: material.nota,
          estado: material.estado
        });
      }
    });
  }

  get nombre() { return this.materialForm.get('nombre'); }
  get unidad() { return this.materialForm.get('unidad'); }

  onSubmit(): void {
    if (this.materialForm.invalid) return;

    const val = this.materialForm.value;

    if (this.isEditing && this.materialId) {
      this.materialService.update(this.materialId, val).subscribe(() => {
        this.router.navigate(['/materials']);
      });
    } else {
      this.materialService.create(val).subscribe(() => {
        this.router.navigate(['/materials']);
      });
    }
  }
}
