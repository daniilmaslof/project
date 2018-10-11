/**
 * Parameters occur when interacting with the user .
 */
export class ParamsTableActions {
  /**
   * Search for a keyword by user.
   */
  public keyword: string;
  /**
   * Sort Params for a keyword by user(selected in the table).
   */
  public sortParams: IsortParams;

  /**
   * Init Params.
   */
  constructor() {
    this.sortParams = {} as IsortParams;
    this.keyword = '';
  }
}

/**
 * Sort Params.
 */
export interface IsortParams {
  orderBy?: string;
  sortOrder?: string;
}
