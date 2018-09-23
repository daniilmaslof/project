import {Injectable} from '@angular/core';
import {Delta} from 'quill';
import {Observable} from 'rxjs/internal/Observable';
import {Subject} from 'rxjs/internal/Subject';
import {map, switchMap} from 'rxjs/operators';

import {EditorService} from './editor.service';

/**
 * Service stores and provides data to preview editor.
 */
@Injectable({
  providedIn: 'root',
})
export class PreviewEditorService {
  private previewDeltaTree: any[];
  public contentHighlightingPreview$: Subject<any> = new Subject<any>();

  /**
   * Can still use Akita or CQRS/CQS now the solution seems bad.
   *
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
    return deltaEditor.ops.map(OperationDelta => {
      if (OperationDelta.insert && OperationDelta.insert.mention) {
        return {
          insert:
            {
              variables: {
                name: OperationDelta.insert.mention.value,
                value: OperationDelta.insert.mention.id,
              },
            },
        };
      }
      return OperationDelta;
    }) as any;
  }

  public highlightInThisRange(range) {
    this.contentHighlightingPreview$.next(range);
  }
}
