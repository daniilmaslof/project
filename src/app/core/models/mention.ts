import {Variable} from './variable';

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
  constructor(id: string, value: string, public denotationChar?: string) {
    this.id = id;
    this.value = value;

  }

  /**
   * Creates a mention from a variable.
   *
   * @param variable from which the mention is created.
   * @param denotationChar of mention.
   * @return mention with variable data.
   */
  public static createMentionFromVariable(variable: Variable, denotationChar?: string): Mention {
    const mention = new Mention(variable.value, variable.name, denotationChar);
    mention.id = variable.value;
    mention.value = variable.name;
    mention.denotationChar = denotationChar;
    return mention;
  }
}
