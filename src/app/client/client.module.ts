import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatDividerModule, MatFormFieldModule, MatIconModule, MatInputModule,
  MatListModule,
  MatPaginatorModule, MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule, MatTooltipModule,
} from '@angular/material';
import {QuillModule} from 'ngx-quill';

import {AriaVariablesComponent} from './components/aria-variables/aria-variables.component';
import {EditorWithVariablesComponent} from './components/editor-with-variables/editor-with-variables.component';
import {EditorComponent} from './components/editor/editor.component';
import {PreviewAreaComponent} from './components/preview-area/preview-area.component';
import {VariableComponent} from './components/variable/variable.component';

@NgModule({
  imports: [
    CommonModule,
    QuillModule,
    MatSortModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule,
  ],
  exports: [
    EditorWithVariablesComponent,
  ],
  entryComponents: [VariableComponent],
  declarations: [EditorComponent, AriaVariablesComponent, PreviewAreaComponent, EditorWithVariablesComponent, VariableComponent],
})
export class ClientModule {
}
