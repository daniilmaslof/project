import {Component, OnInit} from '@angular/core';
import 'quill-mention';

import '../../quill/quill-blots/VariablesBlob/VariablesBlot';

@Component({
  selector: 'app-editor-with-variables',
  templateUrl: './editor-with-variables.component.html',
  styleUrls: ['./editor-with-variables.component.css'],
})
export class EditorWithVariablesComponent implements OnInit {
  constructor() {
  }

  public ngOnInit(): void {
  }
}
