import { Injectable } from '@angular/core';
import {EntityState, EntityStore, Store, StoreConfig} from '@datorama/akita';
import {Data, Editor} from './editor.model';

/**
 * Initial state of the store.
 */
const initialState = {};

/**
 * Receives data from the service gives query( CQS/CQRS).
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'editor' })
export class EditorStore extends Store<Data> {

  /**
   * Init store.
   */
  constructor() {
    super(initialState);
  }
}
