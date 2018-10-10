import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {QuillEditorComponent} from 'ngx-quill';
import {Quill, QuillOptionsStatic, RangeStatic, Sources, StringMap} from 'quill';
import Delta from 'quill-delta';
import {Subject} from 'rxjs/internal/Subject';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';

import {Attribute} from '../../../core/models/attribute';
import {Mention} from '../../../core/models/mention';
import {Variable} from '../../../core/models/Variable';
import {EditorService} from '../../../core/services/editor.service';
import {PreviewEditorService} from '../../../core/services/preview-editor.service';
import {ProcessesDeltaTreeService} from '../../../core/services/processes-delta-tree.service';
import {VariableService} from '../../../core/services/variable.service';
import {VariableComponent} from '../variable/variable.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class EditorComponent implements OnInit, OnDestroy {
  @ViewChild('toolbar')
  private toolbar: ElementRef;
  /**
   * Editor instance.
   */
  public editorQuill: Quill;
  /**
   * Configure/disable quill modules, e.g toolbar or add custom toolbar via html element default is.
   */
  public modules: StringMap;
  private $ngUnsubscribe: Subject<void> = new Subject<void>();

  private deltaWithOutHighlight: Delta;

  /**
   * @param editorService service that stores delta and flow new delta.
   * @param matDialog Service can be used to open modal dialogs.
   * @param variableService service storing variables.
   * @param previewEditorService service that stores delta preview and some methods of changing the preview editor.
   * @param processesDeltaTreeService service stores methods for working with Delta.
   */
  constructor(
    private editorService: EditorService,
    private matDialog: MatDialog,
    private variableService: VariableService,
    private previewEditorService: PreviewEditorService,
    private processesDeltaTreeService: ProcessesDeltaTreeService) {
  }

  /**
   * Subscribes to the change of variables, and change the mention with the value equal name variable  of the variable that changed.
   * Init modules editor.
   * Subscribe to hover variable row in table and highlight hover mention in editor.
   */
  public ngOnInit(): void {
    this.initModulesQuill();
    this.variableService.hoverVariable$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(
      variable => {
        if (variable) {
          if (!this.deltaWithOutHighlight) {
            this.deltaWithOutHighlight = this.editorQuill.getContents();
          }
          this.editorQuill.setContents(
            this.processesDeltaTreeService.highlightMentionInQuill(
              this.deltaWithOutHighlight,
              Mention.createMentionFromVariable(variable),
              new Attribute('color', 'red'),
            ),
            'silent',
          );
        } else {
          this.returnMentionToOriginalAttribute();
        }
      },
    );
    this.variableService.changesInVariables$
      .pipe(
        takeUntil(this.$ngUnsubscribe),
      ).subscribe(
      ([oldVariable, newVariable]) => {
        if (this.deltaWithOutHighlight) {
          this.changeVariablesInDeltaTree(oldVariable, newVariable, this.deltaWithOutHighlight);
          this.deltaWithOutHighlight = null;
        } else {
          this.changeVariablesInDeltaTree(oldVariable, newVariable);
        }
      },
    );
  }

  /**
   * return mention to original when highlight is not needed.
   */
  private returnMentionToOriginalAttribute(): void {
    if (this.deltaWithOutHighlight) {
      this.editorQuill.setContents(this.deltaWithOutHighlight);
      this.deltaWithOutHighlight = null;
    }
  }

  /**
   * Runs through the tree delta editor and replaces oldMention related to old variables to new mention related to new variables.
   *
   * @param oldVariable variable name which is  equal mention value, mentions which are now in the delta tree editor.
   * @param newVariable mentions which are now in the delta tree editor,
   * equal oldVariable value change to a newVariable name and value newVariable = id mention.
   * @param deltaTree Delta tree on which it want to run.
   */
  private changeVariablesInDeltaTree(
    oldVariable: Variable,
    newVariable: Variable,
    deltaTree: Delta = this.editorQuill.getContents(),
  ): void {
    this.editorQuill.setContents(
      this.processesDeltaTreeService.changeMentionOfOldDataToNewData(
        deltaTree,
        Mention.createMentionFromVariable(oldVariable),
        Mention.createMentionFromVariable(newVariable),
      ),
    );
  }

  /**
   * Create editor instance.
   */
  public createdQuill(editor: Quill): void {
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
    const dialogWithAddVariables = this.matDialog.open(VariableComponent, {
      data: new Variable(this.editorQuill.getText(selectionText.index, selectionText.length), ''),
    } as MatDialogConfig<any>);

    dialogWithAddVariables.afterClosed().subscribe(
      variable => {
        if (variable) {
          this.editorQuill.deleteText(selectionText.index, selectionText.length);
          this.editorQuill.insertEmbed(selectionText.index,
            'mention',
            Mention.createMentionFromVariable(variable, this.modules.mention.mentionDenotationChars[0]),
          );
        }
      },
    );
  }

  /**
   * Subscribes to changes content editor and sends delta in editor service.
   * @param editor Editor instance plus new delta and old delta.
   */
  public handleContentChange({delta}: any): void {
    this.editorService.setChangedDelta(delta);
  }

  /**
   Unsubscribe.
   */
  public ngOnDestroy(): void {
    this.$ngUnsubscribe.next();
    this.$ngUnsubscribe.complete();
  }

  /**
   * init highlights in the preview editor this range and does not highlight this oldRange.
   */
  public handleSelectChange({editor, range, oldRange}: any): void {
    this.previewEditorService.highlightRange(
      {
        range: range,
        oldRange: oldRange,
      },
    );
  }

  /**
   * init module with mention module and toolbar.
   */
  private initModulesQuill(): void {
    this.modules = {
      toolbar: this.toolbar.nativeElement,
      mention: {
        /**
         * Indicates that the mention should be displayed in the list.
         */
        renderItem: mention => mention.value,
        /**
         * Shows which chars show the list of variables.
         */
        mentionDenotationChars: ['$'],
        allowedChars: /^[a-zA-Z0-9а-я_]*$/,
        /**
         * Provides data for displaying a list.
         * @param searchTerm characters entered after denotation char.
         * @param renderList callback showing list with data mention.
         */
        source: (searchTerm: string, renderList: (data: Mention[] | { id: string, value: string }, searchTerm: string) => void) => {
          if (searchTerm.length === 0) {
            renderList(this.variableService.state.map(
              variable => Mention.createMentionFromVariable(variable),
            ), searchTerm);
          } else {
            const matches = [];
            for (let i = 0; i < this.variableService.state.length; i++) {
              if (-1 * this.variableService.state[i].name.toLowerCase().indexOf(searchTerm) <= 0) {
                matches.push(this.variableService.state[i]);
              }
            }
            renderList(matches.map(variable => Mention.createMentionFromVariable(variable)), searchTerm);
          }
        },
      },
    };
  }

}
