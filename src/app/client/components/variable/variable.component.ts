import {Component, Inject, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import {Variable} from '../../../core/models/Variable';
import {VariableService} from '../../../core/services/variable.service';

@Component({
  selector: 'app-variable',
  templateUrl: './variable.component.html',
  styleUrls: ['./variable.component.css'],
})
export class VariableComponent implements OnInit {

  /**
   * Form for creation or change variable.
   */
  public variableForm: FormGroup;
  /**
   * Field name.
   */
  public name: FormControl;

  /**
   * Field value.
   */
  public value: FormControl;

  private description = new FormControl('');

  /**
   * @param dialogRef MatDialogRef and use it to close the dialog.
   * @param selectedVariable variable passed to the modal window.Initial value variable form.
   * @param variableService providers variables and methods for working with variables.
   */
  constructor(
    private dialogRef: MatDialogRef<VariableComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedVariable: Variable,
    private variableService: VariableService) {
  }

  /**
   * Create a form with validation and with the initial value if it exists.
   */
  public ngOnInit(): void {
    if (!this.selectedVariable) {
      this.name = new FormControl('',
        Validators.compose([Validators.required,
          Validators.pattern(/[\S]+/g),
          // Validators.pattern(/^[^0-9]/),
          this.checkForDifferentName(this.variableService.state)],
      ));
      this.value = new FormControl('');
    } else {
      this.name = new FormControl(
        this.selectedVariable.name,
        [
          Validators.required,
          Validators.pattern(/\S/g),
          // Validators.pattern(/[^(\s)]/g),
          // Validators.pattern(/^[^0-9]/),
          this.checkForDifferentName(this.variableService.state, this.selectedVariable),
        ],
      );
      this.value = new FormControl(this.selectedVariable.value);
    }
    this.variableForm = new FormGroup({
      'name': this.name,
      'value': this.value,
      'description': this.description,
    });
  }

  /**
   * Create name message when name variable is wrong.
   */
  public getErrorMessageName(): string {
    return this.name.hasError('required') ? 'Name variable is required' :
      this.name.hasError('sameName') ? 'entered name already registered' : '';
  }

  /**
   * Add or edit variable in variables.
   */
  public create(): void {
    let createdVariable;
    if (!this.selectedVariable) {
      this.variableService.addOrEditVariable(null, new Variable(this.variableForm.value.name, this.variableForm.value.value));
      this.dialogRef.close();
      return;
    }
    if (this.variableForm.value.name !== this.selectedVariable.name || this.variableForm.value.value !== this.selectedVariable.value) {
      createdVariable = new Variable(this.variableForm.value.name, this.variableForm.value.value);
      this.variableService.addOrEditVariable(
        this.selectedVariable,
        createdVariable,
      );
    }
    this.dialogRef.close(createdVariable);
  }

  /**
   * Close dialog.
   */
  public close(): void {
    this.dialogRef.close();
  }

  /**
   * Factory to create function that check name variable it does not exist in variables.
   */
  private checkForDifferentName(variables: Variable[], variableIsSelected: Variable = null): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (variableIsSelected && variableIsSelected.name === control.value) {
        return null;
      }
      if (variables.findIndex(variable => variable.name === control.value) !== -1) {
        return {'sameName': {value: control.value}};
      }
      return null;
    };
  }
}
