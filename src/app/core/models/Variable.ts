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
   * Value of a variable.
   */
  public description?: string;

  /**
   * Init variable.
   */
  constructor(name: string, value: string, description: string = '') {
    this.name = name;
    this.description = description;
    this.value = value;
  }
}
