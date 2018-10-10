import {RangeStatic} from 'quill';

import {Attribute} from './attribute';

/**
 * Stores a range and attribute in this range.
 */
export class RangeAttribute {
  /**
   * @param range of text with this attribute.
   * @param attribute text.
   */
  constructor(public range: RangeStatic, public attribute: Attribute) {
  }
}
