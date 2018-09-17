import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';

import {Mention} from '../../../core/models/mention';
import {Variable} from '../../../core/models/Variable';
import {EditorService} from '../../../core/services/editor.service';
import {VariableService} from '../../../core/services/variable.service';
import {VariableComponent} from '../variable/variable.component';
import {Subject} from 'rxjs/internal/Subject';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent implements OnInit, OnDestroy {
  /**
   * Editor instance.
   */
  public editorQuill: any;
  /**
   * Configure/disable quill modules, e.g toolbar or add custom toolbar via html element default is.
   */
  public modules: any;
  private $ngUnsubscribe: Subject<void> = new Subject<void>();

  /**
   * @param editorService service that stores delta and flow new delta.
   * @param matDialog Service can be used to open modal dialogs.
   * @param variableService service storing variables.
   */
  constructor(
    private editorService: EditorService,
    private matDialog: MatDialog,
    private variableService: VariableService) {
  }

  /**
   * Subscribes to the change of variables, and change the mention with the value equal name variable  of the variable that changed.
   * Init modules editor.
   */
  public ngOnInit(): void {
    this.variableService.changesInVariables$
      .pipe(takeUntil(this.$ngUnsubscribe)).subscribe(
      ([oldVariable, newVaraible]) => {
        this.changeVariablesInDeltaTree(oldVariable, newVaraible);
      },
    );
    this.modules = {
      toolbar: 'full',
      mention: {
        /**
         * Indicates that the mention should be displayed in the list.
         */
        renderItem: mention => mention.value,
        /**
         * Shows which chars show the list of variables.
         */
        mentionDenotationChars: ['@', '#'],

        /**
         * Provides data for displaying a list.
         * @param searchTerm characters entered after denotation char.
         * @param renderList callback showing list with data mention.
         */
        source: (searchTerm, renderList) => {
          if (searchTerm.length === 0) {
            renderList(this.variableService.state.map(
              variable => new Mention(variable.value, variable.name),
            ), searchTerm);
          } else {
            const matches = [];
            for (let i = 0; i < this.variableService.state.length; i++) {
              if (-1 * this.variableService.state[i].name.toLowerCase().indexOf(searchTerm) <= 0) {
                matches.push(this.variableService.state[i]);
              }
            }
            renderList(matches.map(variable => new Mention(variable.value, variable.name)), searchTerm);
          }
        },
      },
    };
  }

  /**
   * Runs through the tree delta editor and replaces oldMention related to old variables to new mention related to new variables.
   *
   * @param oldVariable variable name which is  equal mention value, mentions which are now in the delta tree editor.
   * @param newVariable mentions which are now in the delta tree editor,
   * equal oldVariable value change to a newVariable name and value newVariable = id mention.
   */
  private changeVariablesInDeltaTree(oldVariable: Variable, newVariable: Variable): void {
    this.editorQuill.setContents(
      this.editorQuill.getContents().map(
        deltaOperation => {
          if (deltaOperation.insert && deltaOperation.insert.mention && deltaOperation.insert.mention.value === oldVariable.name) {
            return {
              insert:
                {
                  mention: {
                    denotationChar: deltaOperation.insert.mention.denotationChar,
                    id: newVariable.value,
                    value: newVariable.name,
                  },
                },
            };
          } else {
            return deltaOperation;
          }
        },
      ) as any);
  }

  /**
   * Create editor instance.
   */
  public createdQuill(editor: any): void {
    this.editorQuill = editor;
  }

  /**
   * Get the selected text and replace this text to mention associated with variable the user creates now.
   */
  public addVariables(): void {
    const selectionText = this.editorQuill.getSelection();
    if (!selectionText) {
      this.matDialog.open(VariableComponent);
      return;
    }
    const dialogWithAddVaraibles = this.matDialog.open(VariableComponent, {
      data: new Variable(this.editorQuill.getText(selectionText.index, selectionText.length), ''),
    } as MatDialogConfig<any>);

    dialogWithAddVaraibles.afterClosed().subscribe(
      variable => {
        if (variable) {
          this.editorQuill.deleteText(selectionText.index, selectionText.length);
          this.editorQuill.insertEmbed(selectionText.index, 'mention', {
            denotationChar: this.modules.mention.mentionDenotationChars[0],
            id: variable.value,
            value: variable.name,
          });
        }
      },
    );
  }

  /**
   * Subscribes to changes content editor and sends delta in editor service.
   * @param editor Editor instance plus new delta and old delta.
   */
  public handleContentChange(editor: any): void {
    this.editorService.setChangedDelta(editor.delta);
  }

  /**
   Unsubscribe.
   */
  public ngOnDestroy(): void {
    this.$ngUnsubscribe.next();
    this.$ngUnsubscribe.complete();
  }
}
