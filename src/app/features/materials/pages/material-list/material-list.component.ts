import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MaterialService } from '../../services/material.service';
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { Material } from '../../../../core/models/material';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';

@Component({
  selector: 'app-material-list',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusLabelPipe, ReactiveFormsModule],
  templateUrl: './material-list.component.html'
})
export class MaterialListComponent implements OnInit {
  materials$!: Observable<Material[]>;
  filteredMaterials$!: Observable<Material[]>;
  
  searchControl = new FormControl('', { nonNullable: true });
  statusControl = new FormControl('', { nonNullable: true });

  constructor(
    private materialService: MaterialService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.materials$ = this.materialService.getAll();
    
    this.filteredMaterials$ = combineLatest([
      this.materials$,
      this.searchControl.valueChanges.pipe(startWith('')),
      this.statusControl.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([materials, search, status]) => {
        return materials.filter(m => {
          const matchesSearch = m.nombre.toLowerCase().includes(search.toLowerCase());
          const matchesStatus = status === '' || m.estado === status;
          return matchesSearch && matchesStatus;
        });
      })
    );
  }

  goToDetail(id: string): void {
    this.router.navigate(['/materials', id]);
  }
}
