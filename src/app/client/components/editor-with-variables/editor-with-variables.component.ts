import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import 'quill-mention';

import '../../quill/quill-blots/mention-blot/Mention-blot';
import '../../quill/quill-blots/VariablesBlob/VariablesBlot';

/**
 * Imports blot and joins table variables and editors.
 */
@Component({
  selector: 'app-editor-with-variables',
  templateUrl: './editor-with-variables.component.html',
  styleUrls: ['./editor-with-variables.component.css'],
})
export class EditorWithVariablesComponent  {

}
