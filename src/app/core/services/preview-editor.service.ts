import {Injectable} from '@angular/core';
import {Delta} from 'quill';
import {Subject} from 'rxjs/internal/Subject';

import {EditorService} from './editor.service';

/**
 * Service stores and provides data to preview editor.
 */
@Injectable({
  providedIn: 'root',
})
export class PreviewEditorService {
  private previewDeltaTree: any[];

  /**
   * Observable of deltas that update preview Editor.
   */
  public deltaUnitPreview$: Subject<any> = new Subject<any>();

  /**
   * Subscribes to changes in the delta tree of the editor.
   * Can still use Akita or CQRS/CQS now the solution seems bad.
   *
   * @param editorService Service providing data to preview editor.
   */
  constructor(private editorService: EditorService) {
    this.editorService.deltaUnitEditor$.subscribe(
      delta => this.deltaUnitPreview$.next(this.createDeltaForPreview(delta)),
    );
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
}
