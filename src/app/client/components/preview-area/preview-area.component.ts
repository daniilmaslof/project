import {Component, OnDestroy, OnInit} from '@angular/core';
import Quill, {RangeStatic} from 'quill';

import {Subject} from 'rxjs/internal/Subject';
import {takeUntil} from 'rxjs/operators';

import {Attribute} from '../../../core/models/attribute';
import {RangeAttribute} from '../../../core/models/range-attribute';

import {PreviewEditorService} from '../../../core/services/preview-editor.service';
import {ProcessesDeltaTreeService} from '../../../core/services/processes-delta-tree.service';

@Component({
  selector: 'app-preview-area',
  templateUrl: './preview-area.component.html',
  styleUrls: ['./preview-area.component.css'],

})
export class PreviewAreaComponent implements OnInit, OnDestroy {
  /**
   * Preview editor instance.
   */
  public previewQuill: Quill;
  private $ngUnsubscribe: Subject<void> = new Subject<void>();
  private isContentSelected: boolean;
  private backgroundOfSelectedContentChanged: boolean;
  private backgroundRanges: RangeAttribute[] = [];

  /**
   * @param previewEditorService service providing delta data to a preview editor.
   * @param processesDeltaTreeService service stores methods for working with Delta.
   */
  constructor(private previewEditorService: PreviewEditorService, private processesDeltaTreeService: ProcessesDeltaTreeService) {
  }

  /**
   * Create editor instance and subscribe to a delta provide by the service(subscribe to a change in the content editor).
   * And subscribe to a change selection on the editor.
   *
   * @param editor Editor instance.
   */
  public createdPreviewQuill(editor: Quill): void {
    this.previewQuill = editor;
    this.previewEditorService.subscribeToEditsEditor().subscribe(
      delta => {
        if (this.isContentSelected) {
          /**
           * If the user changes the selection attribute, do not restore the original attribute.
           */
          if (!this.backgroundOfSelectedContentChanged) {
            this.backgroundOfSelectedContentChanged = this.processesDeltaTreeService.checksDeltaForPresenceOfAttribute(
              delta,
              new Attribute('background'),
            );
          }
          /**
           * If the user enters a character, restores the attributes.
           */
          if (this.processesDeltaTreeService.checkDeltaForPresenceInsertOrRetrain(delta)) {
            this.returnToOriginalBackground();
          }
        }
        this.previewQuill.updateContents(delta);
      },
      takeUntil(this.$ngUnsubscribe),
    );

    /**
     * Remove  highlighting of the old range text and highlight new range.
     */
    this.previewEditorService.contentHighlightingPreview$.subscribe(
      ({range, oldRange}) => {
        this.notHighlight(oldRange);
        this.highlight(range);
      });
  }

  /**
   * Restores the original attributes that were before highlighting.
   *
   * @param oldRange the range in the preview where you want to restore the original attributes.
   */
  private notHighlight(oldRange: RangeStatic): void {
    let notHighlightVariables = false;
    if (oldRange && oldRange.length !== 0) {
      if (oldRange.length === 1) {
        const blot = this.previewQuill.getLeaf(oldRange.index + oldRange.length)[0];
        if (blot.statics.blotName === 'variables') {
          blot.doNotHighlight();
          notHighlightVariables = true;
        }
      }
      if (!notHighlightVariables) {
        this.returnToOriginalBackground();
      }
    }
  }

  /**
   * The range in the preview editor where you want to apply the selection attributes or if only a variable is selected, select it.
   *
   * @param range for which you want to highlight text.
   */
  private highlight(range: RangeStatic): void {
    if (range && range.length !== 0) {
      this.isContentSelected = true;
      let highlightVariables = false;
      if (range.length === 1) {
        const blot = this.previewQuill.getLeaf(range.index + range.length)[0];
        if (blot.statics.blotName === 'variables') {
          blot.highlight();
          highlightVariables = true;
        }
      }
      if (!highlightVariables) {
        const selectionAttribute = new Attribute('background', 'red');
        this.backgroundRanges = this.processesDeltaTreeService.getAttributeRanges(
          this.previewQuill.getContents(range.index, range.length),
          selectionAttribute,
          range.index,
        );
        this.previewQuill.formatText(range.index, range.length, selectionAttribute.key, selectionAttribute.value);
      }
    }
  }

  /**
   * returns the editor to the pre-selection state.
   */
  private returnToOriginalBackground(): void {
    this.previewQuill.setContents(
      this.processesDeltaTreeService.returnDeltaTreeToOriginalAttribute(this.previewQuill.getContents(), this.backgroundRanges),
    );
    this.backgroundRanges = [];
    this.isContentSelected = false;
    this.backgroundOfSelectedContentChanged = false;
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
