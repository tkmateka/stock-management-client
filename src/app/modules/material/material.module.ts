import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';

const components = [
  MatButtonModule, MatSnackBarModule, FormsModule, ReactiveFormsModule, MatInputModule,
  MatCardModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatTooltipModule, MatTableModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    components
  ],
  exports: [
    components
  ]
})
export class MaterialModule { }
