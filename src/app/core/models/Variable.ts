/**
 * Variable in preview editor.
 */
export class Variable {
  /**
   * Name variable there must be a unique for comfort.
   */
  public name: string;
  /**
   * Value of a variable.
   */
  public value: string;

  /**
   * Init variable.
   */
  constructor(name: string, value: string) {
    this.name = name;
    this.value = value;
  }
}
