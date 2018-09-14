/**
 * Is needed to create mention in editor and transform to variable in Preview.
 */
export class Mention {
  /**
   * id mention  equal to the value of the variable.
   */
  public id: string;
  /**
   * value mention equal to the name of the variable.
   */
  public value: string;

  /**
   * init mention.
   */
  constructor(id: string, value: string) {
    this.id = id;
    this.value = value;
  }
}
