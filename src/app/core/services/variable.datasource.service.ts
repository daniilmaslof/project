import {CollectionViewer} from '@angular/cdk/collections';
import {DataSource} from '@angular/cdk/table';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Subject} from 'rxjs/internal/Subject';
import {catchError, finalize, switchMap, takeUntil} from 'rxjs/operators';

import {ParamsTableActions} from '../models/params-table-actions';
import {Variable} from '../models/variable';

import {VariableService} from './variable.service';
/**
 * Class custom Observable-based Angular CDK Data Source.
 */
@Injectable({
  providedIn: 'root',
})
export class VariableDatasourceService implements DataSource<Variable> {
  private errorSubject = new Subject<string>();
  private loadingSubject = new Subject<boolean>();
  private $ngUnsubscribe: Subject<void> = new Subject<void>();
  /**
   * Observable emit at the table loading.
   */
  public loading$ = this.loadingSubject.asObservable();
  /**
   * provides error on the table.
   */
  public error$ = this.errorSubject.asObservable();

  /**
   * In the constructor service which receives the data in the table requests data occurs after actionsChangeTable emits values.
   *
   * @param variableService Service that sends data to the table in our case VariableService.
   * @param $actionsChangeTable ParamsTableActions come whenever one of three events occurs(change sort change , search).
   */
  constructor(private variableService: VariableService, private $actionsChangeTable: Subject<ParamsTableActions>) {
  }

  /**
   * This method will be called once by the Data Table at table bootstrap time.
   * The Data Table expects this method to return an Observable,
   * and the values of that observable contain the data that the Data Table needs to display.
   *
   * @param collectionViewer provides an Observable that emits information about what data is being displayed
   * @return observable variableService.getVariablesForTable which is called when $actionsChangeTable emit events,
   * Is going to be emitting the values in the table.
   */
  public connect(collectionViewer: CollectionViewer): Observable<Variable[]> {
    return this.$actionsChangeTable.pipe(
      switchMap(value => {
        return this.variableService.getVariablesForTable(value)
          .pipe(
          catchError(error => {
            this.errorSubject.next(error);
            return of([]);
          }),
          finalize(() => this.loadingSubject.next(false)),
        );
      }),
      takeUntil(this.$ngUnsubscribe),
    );
  }

  /**
   * Complete any observables that we have created internally in this class.
   * This method is called once by the data table at component destruction time.
   */
  public disconnect(collectionViewer: CollectionViewer): void {
    this.loadingSubject.complete();
    this.$ngUnsubscribe.next();
    this.$ngUnsubscribe.complete();
  }
}
