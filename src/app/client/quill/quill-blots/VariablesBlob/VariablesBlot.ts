import Parchment from 'parchment';
import EmbedBlot from 'parchment/dist/src/blot/embed';
import Quill from 'quill';

import {Variable} from '../../../../core/models/Variable';

const Embed = Quill.import('blots/embed');

/**
 * Blot to  creating variables in quill editor.
 */
class VariablesBlot extends Embed {

  /**
   * Shows how to create node when attaching blot to the tree editor.
   * @param data Variable.
   */
  public static create(data: Variable): void {
    const node = super.create();
    node.innerHTML += data.value;
    node.dataset.name = data.name;
    node.dataset.value = data.value;
    return node;
  }

  /**
   *  Returns the value represented by domNode if it is this Blot's type.
   *
   *  @param domNode  represented by the domNode whose value you want to return.
   *  @return value variable with data from the dom node.
   */
  public static value(domNode: HTMLElement): Variable {
    return {
      name: domNode.dataset.name,
      value: domNode.dataset.value,
    };
  }

  /**
   * Don`t highlight this variable.
   */
  public doNotHighlight(): void {
    (this as any).contentNode.classList.remove('variables-highlight');
  }

  /**
   * Highlight this variable.
   */
  public highlight(): void {
    (this as any).contentNode.className = 'variables-highlight';
  }
}

(VariablesBlot as any).blotName = 'variables';
(VariablesBlot as any).tagName = 'span';
(VariablesBlot as any).className = 'variables';
Parchment.register(VariablesBlot);
Quill.register(VariablesBlot);
