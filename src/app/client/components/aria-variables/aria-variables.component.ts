import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog, MatDialogConfig, MatDialogRef, Sort} from '@angular/material';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {Subject} from 'rxjs/internal/Subject';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';

import {ParamsTableActions} from '../../../core/models/params-table-actions';
import {Variable} from '../../../core/models/variable';
import {VariableDatasourceService} from '../../../core/services/variable.datasource.service';
import {VariableService} from '../../../core/services/variable.service';
import {VariableComponent} from '../variable/variable.component';

/**
 * Component with table variables.
 */
@Component({
  selector: 'app-aria-variables',
  templateUrl: './aria-variables.component.html',
  styleUrls: ['./aria-variables.component.css'],
})
export class AriaVariablesComponent implements OnInit, OnDestroy {
  /**
   * The object class that implements the data source of the CDK for the table, stores the observed errors associated with the table.
   */
  public dataSource: VariableDatasourceService;
  private $actionsChangeTable: Subject<ParamsTableActions>;
  private paramsTableActions: ParamsTableActions;
  private $ngUnsubscribe: Subject<void> = new Subject<void>();
  private changeVariableDialogRef: MatDialogRef<VariableComponent>;
  /**
   * matHeaderRowDef enumeration of column names that we want to display Table.
   */
  public displayedColumns: string[] = [
    'name',
    'value',
  ];
  /**
   * search Field to sort the table.
   */
  public searchField: FormControl;

  /**
   * The service from which the data enters the table.
   */
  constructor(private variableService: VariableService, private matDialog: MatDialog) {
  }

  /**
   * Create a VariableDatasourceService that provides data to the table that,
   * gets them when emitting $actionsChangeTable emits a change of variableService.
   */
  public ngOnInit(): void {
    this.paramsTableActions = new ParamsTableActions();
    this.$actionsChangeTable = new BehaviorSubject<ParamsTableActions>(this.paramsTableActions);
    this.$actionsChangeTable.pipe(takeUntil(this.$ngUnsubscribe));
    this.createSearchInput();
    this.dataSource = new VariableDatasourceService(this.variableService, this.$actionsChangeTable);
  }

  /**
   When the user clicks the sort buttons,$actionsChangeTable emit paramsTableActions with  sort changes data.
   */
  public sortTableChange(eventSort: Sort): void {
    this.paramsTableActions.sortParams.sortOrder = eventSort.direction;
    this.paramsTableActions.sortParams.orderBy = eventSort.active;
    this.$actionsChangeTable.next(this.paramsTableActions);
  }

  /**
   When the user change search field table,$actionsChangeTable emit paramsTableActions with  search changes data.
   */
  public createSearchInput(): void {
    this.searchField = new FormControl();
    this.searchField.valueChanges.pipe(
      takeUntil(this.$ngUnsubscribe),
      debounceTime(150),
      distinctUntilChanged(),
    ).subscribe(
      (value: string) => {
        this.paramsTableActions.keyword = value;
        this.$actionsChangeTable.next(this.paramsTableActions);
      },
    );
  }

  /**
   Unsubscribe.
   */
  public ngOnDestroy(): void {
    this.$ngUnsubscribe.next();
    this.$ngUnsubscribe.complete();
  }

  /**
   * Open a modal window with a form for changing the variable.
   * @param variable the variable that you want to change.
   */
  public editVariable(variable: Variable): void {
    this.changeVariableDialogRef = this.matDialog.open(VariableComponent, {
      data: variable,
    } as MatDialogConfig<any>);
  }

  /**
   * Open a modal window with a form for creating a variable.
   */
  public addVariable(): void {
    this.matDialog.open(VariableComponent);
  }

  /**
   * Redrawing on change.
   *
   * @param index row in Table
   * @param item variable in row.
   */
  public trackByVariable(index: number, item: Variable): string {
    return item.name + item.value;
  }

  /**
   * Highlight the variables in the editor when row hover in table.
   *
   * @param variable which want to highlight.
   */
  public enter(variable: Variable): void {
    this.changeVariableDialogRef = null;
    this.variableService.hoverVariable$.next(variable);
  }

  /**
   * Does not highlight the variables in the editor when  row does not hover in table.
   * At the opening of the variable changes, the highlight stays on.
   * Emit empty value in hoverVariable$ to mouse leave with variables.
   */
  public leave(): void {
    if (!this.changeVariableDialogRef) {
      this.variableService.hoverVariable$.next(null);
    } else {
      this.changeVariableDialogRef.afterClosed().subscribe(
        () => this.variableService.hoverVariable$.next(null),
      );
    }
  }
}
