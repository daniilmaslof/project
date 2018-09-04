import { Injectable } from '@angular/core';
import {Query, QueryEntity} from '@datorama/akita';

import {EditorStore} from './editor.store';
import {Data} from './editor.model';
import {Observable} from 'rxjs/internal/Observable';
/**
 *  Reads from the store,contains various types of selector.
 */
@Injectable({
  providedIn: 'root',
})
export class EditorQuery extends Query<Data> {
  /**
   *  Init query.
   */
  constructor(protected store: EditorStore) {
    super(store);
  }
  /**
   *  Select all User.
   */
  public selectOutputHtml$: Observable<string> = this.select((store) => store.outputHtml);
}
