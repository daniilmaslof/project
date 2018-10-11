import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule,
  MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatSidenavModule, MatSortModule,
  MatTableModule, MatTabsModule, MatTooltipModule,
} from '@angular/material';
import {MdePopoverModule} from '@material-extended/mde';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    FormsModule,
    MatSortModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    MdePopoverModule,
    MatButtonModule,
    MatDialogModule,
  ],
  declarations: [],
})
export class SharedModule {
}
