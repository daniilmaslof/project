import {Injectable} from '@angular/core';
import {Delta} from 'quill';
import {Subject} from 'rxjs/internal/Subject';

/**
 * Service associated with the editor e.g keep a copy of the delta tree editor.
 * Service providing data to Preview service.
 */
@Injectable({
  providedIn: 'root',
})
export class EditorService {
/**
 * The flow delta that comes with the change editor.
 */
  public deltaUnitEditor$: Subject<Delta> = new Subject<Delta>();
  /**
   * It is necessary to finish it is connected with preservation of that that the user entered.
   * Need to display templates.
   */
  private editorDeltaTree: Delta[];

  constructor() {
  }

  /**
   * Ddd a new delta to the stream.
   * @param newDelta Delta received when content editor is changed.
   */
  public setChangedDelta(newDelta: Delta): void {
    this.deltaUnitEditor$.next(newDelta);
  }

}
