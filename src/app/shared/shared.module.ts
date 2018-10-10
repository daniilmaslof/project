import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatPaginatorModule,
  MatTableModule, MatTooltipModule,
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
  exports: [
    MatDialogModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
  ],
  declarations: [],
})
export class SharedModule {
}
