import {Injectable} from '@angular/core';
import {ID} from '@datorama/akita';
import {EditorStore} from './editor.store';
import {VariablesDataService} from '../services/variables-data.service';

/**
 *  Service to change the state  store.
 */
@Injectable({
  providedIn: 'root',
})
export class EditorService {
  /**
   *  @param usersStore Store.
   *  @param usersDataServise Api to retrieve users data.
   */
  constructor(private editorStore: EditorStore,private variablesDataService: VariablesDataService) {
  }

  /**
   * Upload users of usersDataServise  and adds them to the store.
   */
  public uploadVariables() {

  }

  public EditorChange(editor): void {
    this.editorStore.setState(
      state => {
        return {
          ...state,
          editor: {
            html: editor.html,
          },
          outputHtml: editor.html,
        };
      },
    );

  }
}
