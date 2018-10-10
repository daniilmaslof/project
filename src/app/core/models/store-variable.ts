import {Store} from './Store';
import {Variable} from './Variable';

/**
 * Implementation of the store variable[] with methods state changes.
 * Although it seems a bad solution because you can only extends the abstraction?.
 */
export class StoreVariable extends Store<Variable[]> {
  /**
   * Init store.
   */
  constructor() {
    super([]);
  }

  /**
   * Add variable in state.
   *
   * @param variable that is added to state.
   */
  public addVariable(variable: Variable): void {
    this.state.unshift(variable);
    this.setState(this.state);
  }

  /**
   * Edit variable in state by index.
   *
   * @param variable That is changed in state by this index.
   * @param index Where you want to change the variable.
   */
  protected editVariable(variable: Variable, index: number): void {
    this.state[index] = variable;
    this.setState(this.state);
  }

  /**
   * Delete variable in state by index.
   * @param index Variable with the given index that you want to delete
   */
  protected deleteVariable(index: number): void {
    this.state.splice(index, 1);
    this.setState(this.state);
  }
}
