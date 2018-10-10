import Quill from 'quill';

import {Mention} from '../../../../core/models/mention';

const Embed = Quill.import('blots/embed');

/**
 * Override mention blot with fix bug with change mention.
 * Mention is located in editor quill and replaced by variable blot in preview.
 */
class MentionBlot extends Embed {

  /**
   *  Function that creates a DOM Node from an initial value.
   *  @param data  initial value.
   *  @return node html element with initial value.
   */
  public static create(data: Mention): HTMLElement {
    const node: any = super.create();
    const denotationChar = document.createElement('span');
    denotationChar.className = 'ql-mention-denotation-char';
    denotationChar.innerHTML = data.denotationChar;
    node.appendChild(denotationChar);
    node.innerHTML += data.value;
    node.dataset.id = data.id;
    node.dataset.value = data.value;
    node.dataset.denotationChar = data.denotationChar;
    return node;
  }

  /**
   *  Returns the value represented by domNode if it is this Blot's type.
   *  @param domNode  represented by the domNode whose value you want to return.
   *  @return value mention with data from the dom node.
   */
  public static value(domNode: HTMLElement): Mention {
    return {
      id: domNode.dataset.id,
      value: domNode.dataset.value,
      denotationChar: domNode.dataset.denotationChar,
    };
  }

  /**
   *  Call the function when changes being made to the this blot DOM node.
   *  When you change a blot, it remove.
   *  @param mutations  represents an individuals DOM mutations.
   *  @param context shared context object is passed through all blots.
   */
  public update(mutations: MutationRecord[], context: { [key: string]: any }): void {
    mutations.forEach((mutation) => {
      if (mutation.removedNodes.length) {
        /**
         * If there is a left element moves the selection there.
         * If no error occurs The given range isn't in document.
         */
        if ((this as any).prev) {
          context.range = {
            startNode: (this as any).prev.domNode,
            startOffset: -1,
          };
        }
        super.remove();
      }
    });
    super.update(mutations, context);
  }
}

(MentionBlot as any).blotName = 'mention';
(MentionBlot as any).tagName = 'span';
(MentionBlot as any).className = 'mention';

Quill.register(MentionBlot);
