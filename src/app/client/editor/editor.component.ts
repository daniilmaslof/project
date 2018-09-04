import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {QuillEditorComponent} from 'ngx-quill';
import {Delta, DeltaStatic, Sources} from 'quill';
import Quill from 'quill';

import 'quill-mention';
import {Observable, of} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, switchMap} from 'rxjs/operators';

import {EditorQuery} from '../../core/state/editor.query';
import {EditorService} from '../../core/state/editor.service';
import {VariablesModalComponent} from '../variables-modal/variables-modal.component';


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent implements OnInit, AfterViewInit {
  @ViewChild('editor')
  public editor: QuillEditorComponent;

  @ViewChild('editorWatch')
  public editorWatch: QuillEditorComponent;
  public text$: Observable<string>;
  public modules: any;

  public values = [
    {id: 1, value: 'Fredrik Sundqvist'},
    {id: 2, value: 'Patrik Sjölin'},
  ];

  constructor(private editorService: EditorService, private editorQuery: EditorQuery, private matDialog: MatDialog) {
  }

  public ngOnInit() {

    this.modules = {
      mention: {
        renderItem: (item) => {
          return item.id;
        },
        source: (searchTerm, renderList) => {
          console.log(searchTerm);
          if (searchTerm.length === 0) {
            renderList(this.values, searchTerm);
          } else {
            const matches = [];
            for (let i = 0; i < this.values.length; i++)
              if (~this.values[i].value.toLowerCase().indexOf(searchTerm)) matches.push(this.values[i]);
            renderList(matches, searchTerm);
          }
        },
      },
    };
    this.editor.onContentChanged
      .pipe(
        distinctUntilChanged()).subscribe(
      editor => {

        this.editorService.EditorChange(editor);
      },
    );
    this.text$ = this.editorQuery.selectOutputHtml$;
  }

  public changeList() {
    this.values = [
      {id: 1, value: 'Fredrikdsfds'},
      {id: 2, value: 'Patrikdsfdsf'},
    ];
    this.editorWatch.quillEditor.update();
    this.editor.quillEditor.update();
  }

  public ngAfterViewInit(): void {
    // this.quill = new Quill(this.editor.editorElem);
    // let a = this.quill.on('text-change', this.textChangeHandler.bind(this));
  };

  public textChangeHandler(delta: DeltaStatic, oldContents: DeltaStatic, source: Sources) {
    // this.quill.root.innerHTML = this.quill..setContents(delta);
  }
}

const Parchment = Quill.import('parchment');
const Block = Parchment.query('block');

class block extends Block {

}
