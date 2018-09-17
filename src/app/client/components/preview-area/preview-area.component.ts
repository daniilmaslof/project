import {Component, OnDestroy, OnInit} from '@angular/core';
import Quill from 'quill';

import {PreviewEditorService} from '../../../core/services/preview-editor.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs/internal/Subject';

@Component({
  selector: 'app-preview-area',
  templateUrl: './preview-area.component.html',
  styleUrls: ['./preview-area.component.css'],
})
export class PreviewAreaComponent implements OnInit, OnDestroy {
  /**
   * Preview editor instance.
   */
  public previewQuill: any;
  private $ngUnsubscribe: Subject<void> = new Subject<void>();
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
    this.previewEditorService.subscribeToEditsEditor().subscribe(
      delta => this.previewQuill.updateContents(delta),
      takeUntil(this.$ngUnsubscribe),
    );
  }

  public ngOnInit(): void {
  }

  /**
   Unsubscribe.
   */
  public ngOnDestroy(): void {
    this.$ngUnsubscribe.next();
    this.$ngUnsubscribe.complete();
  }
}
