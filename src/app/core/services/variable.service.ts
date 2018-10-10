import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs/internal/Subject';
import { map} from 'rxjs/operators';

import {ParamsTableActions} from '../models/ParamsTableActions';

import {Variable} from '../models/Variable';

import {StoreVariable} from '../models/store-variable';

/**
 * Service wrapper StoreVariable for my needs connected with the table and editor.
 */
@Injectable({
  providedIn: 'root',
})
export class VariableService extends StoreVariable {
  /**
   * Subject when changing a variable, it emits a old Variables and new Variables.
   */
  public changesInVariables$: Subject<[Variable, Variable]> = new Subject<[Variable, Variable]>();

  /**
   * Subject when changing a variable, it emits a old Variables and new Variables.
   */
  public hoverVariable$: Subject<Variable> = new Subject<Variable>();
  /**
   * Init StoreVariables.
   */
  constructor() {
    super();
  }

  /**
   * Processes the state sorting or filtering it.
   *
   * @param paramsTableActions (sort,filter) Stores the values as needed to filter or sort.
   * @return Observable with variable with sorting,filter applied .
   */
  public getVariablesForTable(paramsTableActions: ParamsTableActions = new ParamsTableActions()): Observable<Variable[]> {
    return this.state$.pipe(
      map(variables => {
        return variables
          .filter(value => {
            return value.name.includes(paramsTableActions.keyword) || value.value.includes(paramsTableActions.keyword);
          })
          .sort(
            (firstVariable, secondVariable) => {
              if (paramsTableActions.sortParams.orderBy === 'name') {
                if (paramsTableActions.sortParams.sortOrder === 'asc') {
                  return this.compareString(firstVariable.name, secondVariable.name);
                } else {
                  return -1 * this.compareString(firstVariable.name, secondVariable.name);
                }
              }
              if (paramsTableActions.sortParams.orderBy === 'value') {
                if (paramsTableActions.sortParams.sortOrder === 'asc') {
                  return this.compareString(firstVariable.value, secondVariable.value);
                } else {
                  return -1 * this.compareString(firstVariable.value, secondVariable.value);
                }
              }
              return 0;
            },
          );
      }),
    );
  }

  /**
   * Compares in alphabetical order stringA and stringB.
   *
   * @param stringA first line for comparison.
   * @param stringB second line for comparison.
   * @return number if the first line is greater than the second return 1 less -1 and 0 they equal.
   */
  private compareString(stringA: string, stringB: string): number {
    stringA = stringA.toUpperCase();
    stringB = stringB.toUpperCase();
    if (stringA < stringB) {
      return -1;
    }
    if (stringA > stringB) {
      return 1;
    }
    return 0;
  }

  /**
   * Adds or replaces variable in variables and changesInVariables$ emit value with a new and old variable.
   *
   * @param oldVariable  variable which must be replaced.
   * @param newVariables variable which may be added.
   */
  public addOrEditVariable(oldVariable: Variable, newVariables: Variable): void {
    if (!oldVariable) {
      this.addVariable(newVariables);
      return;
    }
    const index = this.state.findIndex(variable => oldVariable.value === variable.value && oldVariable.name === variable.name);
    if (index === -1) {
      this.addVariable(newVariables);
    } else {
      this.editVariable(newVariables, index);
      this.changesInVariables$.next([oldVariable, newVariables]);
    }
  }
}
