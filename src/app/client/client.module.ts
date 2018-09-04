import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditorComponent} from './editor/editor.component';
import {QuillModule} from 'ngx-quill';
import {FormsModule} from '@angular/forms';
import {AriaVariablesComponent} from './aria-variables/aria-variables.component';
import {MatDialogModule, MatDividerModule, MatListModule} from '@angular/material';
import {VariablesModalComponent} from './variables-modal/variables-modal.component';

@NgModule({
  imports: [
    CommonModule,
    QuillModule,
    MatDividerModule,
    MatListModule,
    MatDialogModule,
    FormsModule,
  ],
  exports: [
    EditorComponent,
  ],
  entryComponents: [VariablesModalComponent],
  declarations: [EditorComponent, AriaVariablesComponent, VariablesModalComponent],
})
export class ClientModule {
}
