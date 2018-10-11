import {Injectable} from '@angular/core';
import Delta from 'quill-delta';
import {Observable} from 'rxjs/internal/Observable';
import {Subject} from 'rxjs/internal/Subject';
import {map, switchMap} from 'rxjs/operators';

import {RangesForHighlight} from '../models/ranges-for-highlight';

import {EditorService} from './editor.service';

/**
 * Service stores and provides data to preview editor.
 */
@Injectable({
  providedIn: 'root',
})
export class PreviewEditorService {
  private previewDeltaTree: Delta[];

  /**
   * Emits the range to be highlight content and the range to be deselected in preview content.
   */
  public contentHighlightingPreview$: Subject<RangesForHighlight> = new Subject<RangesForHighlight>();

  /**
   * @param editorService Service providing data to preview editor.
   */
  constructor(private editorService: EditorService) {
  }

  /**
   * Subscribes to changes in the delta tree of the editor.
   *
   * @return delta with modified mention on variables.
   */
  public subscribeToEditsEditor(): Observable<Delta> {
    return this.editorService.deltaUnitEditor$.pipe(
      map(delta => this.createDeltaForPreview(delta)));
  }

  /**
   * Converts the delta editor to delta preview namely change mention to a variable.
   *
   * @param deltaEditor received for change editor.
   */
  private createDeltaForPreview(deltaEditor: Delta): Delta {
    return new Delta(deltaEditor.ops.map(operationDelta => {
      if (operationDelta.insert && operationDelta.insert.mention) {
        return {
          ...operationDelta,
          insert:
            {
              variables: {
                name: operationDelta.insert.mention.value,
                value: operationDelta.insert.mention.id,
              },
            },
        };
      }
      return operationDelta;
    }));
  }

  /**
   * highlights this range.range and remove highlight range.oldRange.
   *
   * @param range which will emit contentHighlightingPreview$.
   */
  public highlightRange(range: RangesForHighlight): void {
    this.contentHighlightingPreview$.next(range);
  }
}
