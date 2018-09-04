import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class VariablesDataService {
  variables: Map<string, string> = new Map<string, string>();

  constructor() {
    this.variables.set('ad', 'asdasldlasldas');
  }

}
