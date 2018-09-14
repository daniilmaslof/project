import Parchment from 'parchment';
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
   * Provides data dom node to Variable.
   *
   * @param domNode.
   */
  public static value(domNode: any): Variable {
    return {
      name: domNode.dataset.name,
      value: domNode.dataset.value,
    };
  }
}

VariablesBlot.blotName = 'variables';
VariablesBlot.tagName = 'span';
VariablesBlot.className = 'variables';
Parchment.register(VariablesBlot);
Quill.register(VariablesBlot);
