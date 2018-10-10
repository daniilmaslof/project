import {RangeStatic} from 'quill';

/**
 * Class stores range which will be highlight and old range from which remove highlight.
 */
export class RangesForHighlight {

  /**
   * @param range you want to select,highlight.
   * @param oldRange range from which you want to deselect,to remove highlighting.
   */
  constructor(public range: RangeStatic, public oldRange: RangeStatic) {
  }
}
