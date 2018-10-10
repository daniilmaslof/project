import {Injectable} from '@angular/core';
import {DeltaOperation, default as Quill, RangeStatic, StringMap} from 'quill';
import Delta from 'quill-delta';

import {Attribute} from '../models/attribute';
import {Mention} from '../models/mention';
import {RangeAttribute} from '../models/range-attribute';

/**
 * Service to work delta and provide information from the Delta tree.
 */
@Injectable({
  providedIn: 'root',
})
export class ProcessesDeltaTreeService {

  constructor() {
  }

  /**
   * Get an array of ranges attribute of the provided Delta tree with this attribute.
   *
   * @param content the selected Delta tree from which you want to stores all ranges with the specified attribute.
   * @param attribute  by which the highlight is made.
   * @param initialIndex the index at which to start the selection.
   */
  public getAttributeRanges(content: Delta, attribute: Attribute, initialIndex: number = 0): RangeAttribute[] {
    const rangesAttribute = [];
    let currentIndex = initialIndex;
    content.map(
      deltaOperation => {
        let attributeDeltaOperation = new Attribute(attribute.key, '');
        if (deltaOperation.attributes && deltaOperation.attributes[attribute.key]) {
          attributeDeltaOperation = new Attribute(attribute.key, deltaOperation.attributes[attribute.key]);
        }
        if (typeof deltaOperation.insert === 'string') {
          /**
           * When restoring the tree to its original state, if there are \n going on of differences of index.
           */
          let insertStringWithOutLineBreak = (deltaOperation.insert as string).replace(/^(\n+)/g, '');
          const indexStringWithOutLineBreak = deltaOperation.insert.length - insertStringWithOutLineBreak.length;
          insertStringWithOutLineBreak = insertStringWithOutLineBreak.replace(/(\n+)$/g, '');
          if (insertStringWithOutLineBreak.length) {
            const range = {
              index: currentIndex + indexStringWithOutLineBreak,
              length: insertStringWithOutLineBreak.length,
            } as RangeStatic;
            rangesAttribute.push(new RangeAttribute(range, attributeDeltaOperation));
          }
        } else {
          rangesAttribute.push(new RangeAttribute(
            {
              length: new Delta([deltaOperation]).length(),
              index: currentIndex,
            },
            attributeDeltaOperation,
          ));
        }
        currentIndex = currentIndex + new Delta([deltaOperation]).length();
      },
    );
    return rangesAttribute;
  }

  /**
   * Get an array of ranges attribute of the provided Delta tree with this attribute.
   *
   * @param content the selected Delta tree from which you want to stores all ranges with the specified attribute.
   * @param rangesAttribute
   */
  public returnDeltaTreeToOriginalAttribute(content: Delta, rangesAttribute: RangeAttribute[]): Delta {
    let currentRangeAttribute = rangesAttribute.shift();
    let deltaWithOriginalAttribute = [];
    let currentIndex = 0;
    return content.reduce(
      (deltasWithOriginalAttribute: Delta[], deltaOperation) => {
        const lengthDeltaOperation = new Delta([deltaOperation]).length();
        if (currentRangeAttribute && currentIndex === currentRangeAttribute.range.index) {
          if (lengthDeltaOperation === currentRangeAttribute.range.length) {
            deltasWithOriginalAttribute.push(
              this.changeDeltaAttribute(deltaOperation, currentRangeAttribute.attribute),
            );
            currentIndex += lengthDeltaOperation;
            currentRangeAttribute = rangesAttribute.shift();
            return deltasWithOriginalAttribute;
          }
          if (lengthDeltaOperation > currentRangeAttribute.range.length) {
            let indexInDeltaOperation = 0;
            while (currentRangeAttribute && lengthDeltaOperation > indexInDeltaOperation) {
              const newDeltaOperation = {
                insert: (deltaOperation.insert as string)
                  .slice(indexInDeltaOperation, indexInDeltaOperation + currentRangeAttribute.range.length),
              };
              deltasWithOriginalAttribute.push(
                this.changeDeltaAttribute(newDeltaOperation, currentRangeAttribute.attribute),
              );
              indexInDeltaOperation += currentRangeAttribute.range.length;
              currentRangeAttribute = rangesAttribute.shift();
            }
            currentIndex += indexInDeltaOperation;
            return deltasWithOriginalAttribute;
          }
          if ((new Delta(deltaWithOriginalAttribute)).length() < currentRangeAttribute.range.length) {
            deltaWithOriginalAttribute.push(
              this.changeDeltaAttribute(deltaOperation, currentRangeAttribute.attribute),
            );
            if ((new Delta(deltaWithOriginalAttribute)).length() >= currentRangeAttribute.range.length) {
              deltasWithOriginalAttribute = deltasWithOriginalAttribute.concat(deltaWithOriginalAttribute);
              deltaWithOriginalAttribute = [];
              currentIndex += currentRangeAttribute.range.length;
              currentRangeAttribute = rangesAttribute.shift();
            }
            return deltasWithOriginalAttribute;
          }
        } else {
          deltasWithOriginalAttribute.push(deltaOperation);
          currentIndex += lengthDeltaOperation;
          return deltasWithOriginalAttribute;
        }
      },
      [],
    );
  }

  /**
   * Replaces this attribute for Delta.
   *
   * @param delta which attribute should be replaced.
   * @param attribute the Delta attribute must be replaced with this.
   */
  public changeDeltaAttribute(delta: Delta, attribute: Attribute): Delta {
    const attributes = {...delta.attributes};
    if (attribute.value) {
      attributes[attribute.key] = attribute.value;
    } else if (delta.attributes) {
      delete delta.attributes[attribute.key];
    }
    if (delta.attributes && Object.keys(delta.attributes).length === 0) {
      delete delta.attributes;
      return delta;
    }
    return {
      ...delta,
      attributes,
    };
  }

  /**
   * Checks stores the Delta retain or insert.
   *
   * @param delta to be checked.
   */
  public checkDeltaForPresenceInsertOrRetrain(delta: Delta): boolean {
    let isDeltaContainInsert = false;
    delta.forEach(operationDelta => {
      if (operationDelta.insert || operationDelta.retain) {
        isDeltaContainInsert = true;
        return;
      }
    });
    return isDeltaContainInsert;
  }

  /**
   * Checks whether the selection attribute has changed.
   *
   * @param delta that is checked for an selection attribute.
   * @param selectionAttribute attribute highlight.
   */
  public checksDeltaForPresenceOfAttribute(delta: Delta, selectionAttribute: Attribute): boolean {
    let attributeOfSelectedContentChanged = false;
    delta.forEach(operationDelta => {
      if (operationDelta.attributes && operationDelta.attributes[selectionAttribute.key]) {
        attributeOfSelectedContentChanged = true;
        return;
      }
    });
    return attributeOfSelectedContentChanged;
  }

  /**
   * Replaces the old mention with new mention in delta tree.
   *
   * @param contentDeltaTree in this tree you need to replace.
   * @param oldMention the mention that will be replaced by.
   * @param newMention.
   */
  public changeMentionOfOldDataToNewData(contentDeltaTree: Delta, oldMention: Mention, newMention: Mention): Delta {
    return new Delta(contentDeltaTree.map(deltaOperation => {
        if (deltaOperation.insert && deltaOperation.insert.mention && deltaOperation.insert.mention.value === oldMention.value) {
          newMention.denotationChar = deltaOperation.insert.mention.denotationChar;

          return {
            insert: {
              mention: newMention,
            },
          };
        } else {
          return deltaOperation;
        }
      },
    ));
  }

  /**
   * Selects the highlight attribute all mention in the delta tree which is equal to mention.
   *
   * @param content the tree in which you want to select all the mention.
   * @param mention that you want to highlight.
   * @param attributeHighlight attribute that highlights mention.
   */
  public highlightMentionInQuill(content: Delta,
                                 mention: Mention,
                                 attributeHighlight: Attribute): Delta {
    return new Delta(content.map(
      deltaOperation => {
        if (deltaOperation.insert && deltaOperation.insert.mention && deltaOperation.insert.mention.value === mention.value) {
          const attributes = {...deltaOperation.attributes};
          attributes[attributeHighlight.key] = attributeHighlight.value;
          return {
            insert: deltaOperation.insert,
            attributes: attributes,
          };
        } else {
          return deltaOperation;
        }
      },
    ));
  }
}
