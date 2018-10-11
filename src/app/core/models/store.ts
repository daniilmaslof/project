import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {Observable} from 'rxjs/internal/Observable';

/**
 * Store which stores T based on BehaviorSubject.
 */
export class Store<T> {
  private _state$: BehaviorSubject<T>;

  /**
   * Sets initial value of the store.
   */
  protected constructor (initialState: T) {
    this._state$ = new BehaviorSubject(initialState);
  }

  /**
   * Get observable store.
   */
  get state$ (): Observable<T> {
    return this._state$.asObservable();
  }

  /**
   * Get value of the last value BehaviorSubject.
   */
  get state (): T {
    return this._state$.getValue();
  }

  /**
   * Set new state in the _state$.
   */
  protected setState (nextState: T): void {
    this._state$.next(nextState);
  }
}
