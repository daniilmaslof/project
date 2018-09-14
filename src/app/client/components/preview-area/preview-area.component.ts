import {Component, OnInit} from '@angular/core';

import {PreviewEditorService} from '../../../core/services/preview-editor.service';

@Component({
  selector: 'app-preview-area',
  templateUrl: './preview-area.component.html',
  styleUrls: ['./preview-area.component.css'],
})
export class PreviewAreaComponent implements OnInit {
  /**
   * Preview editor instance.
   */
  public previewQuill: any;

  /**
   * @param previewEditorService service providing delta data to a preview editor.
   */
  constructor(private previewEditorService: PreviewEditorService) {
  }

  /**
   * Create editor instance and subscribe to a delta provide by the service(subscribe to a change in the content editor).
   *
   * @param editor Editor instance.
   */
  public createdPreviewQuill(editor: any): void {
    this.previewQuill = editor;
    this.previewEditorService.deltaUnitPreview$.subscribe(
      delta => this.previewQuill.updateContents(delta),
    );
  }

  public ngOnInit(): void {
  }

}
