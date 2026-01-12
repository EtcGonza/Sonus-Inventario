import { Routes } from '@angular/router';
import { MaterialListComponent } from './pages/material-list/material-list.component';
import { MaterialFormComponent } from './pages/material-form/material-form.component';

import { MaterialDetailComponent } from './pages/material-detail/material-detail.component';

export const MATERIALS_ROUTES: Routes = [
  { path: '', component: MaterialListComponent },
  { path: 'new', component: MaterialFormComponent },
  { path: ':id/edit', component: MaterialFormComponent },
  { path: ':id', component: MaterialDetailComponent }
];
