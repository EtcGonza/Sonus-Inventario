import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../../../core/models/material';
import { StockEvent } from '../../../../core/models/stock-event';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';
import { Observable, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-material-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusLabelPipe],
  templateUrl: './material-detail.component.html'
})
export class MaterialDetailComponent implements OnInit {
  material$!: Observable<Material | undefined>;
  history$!: Observable<StockEvent[]>;

  constructor(
    private route: ActivatedRoute,
    private materialService: MaterialService
  ) {}

  ngOnInit(): void {
    this.material$ = this.route.paramMap.pipe(
        switchMap(params => {
            const id = params.get('id');
            return id ? this.materialService.getById(id) : of(undefined);
        })
    );

    this.history$ = this.route.paramMap.pipe(
        switchMap(params => {
            const id = params.get('id');
            return id ? this.materialService.getHistory(id) : of([]);
        })
    );
  }
}
