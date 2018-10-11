import {TestBed, inject} from '@angular/core/testing';
import Delta from 'quill-delta';

import {Attribute} from '../models/attribute';
import {RangeAttribute} from '../models/range-attribute';

import {ProcessesDeltaTreeService} from './processes-delta-tree.service';

describe('CheckService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProcessesDeltaTreeService],
    });
  });

  it('should be created', inject([ProcessesDeltaTreeService], (service: ProcessesDeltaTreeService) => {
    expect(service).toBeTruthy();
  }));
  it('check Delta Content with no attributes', inject([ProcessesDeltaTreeService], (service: ProcessesDeltaTreeService) => {
    expect(service.returnDeltaTreeToOriginalAttribute(
      new Delta([
        {
          insert: 'aaaaaaaaaaaaaaaaaaaaa',
          attributes: {background: 'red'},
        },
        {insert: '↵'},
      ]),
      [
        new RangeAttribute({index: 0, length: 21},
          new Attribute('background', '')),
      ],
    )).toEqual([
      {insert: 'aaaaaaaaaaaaaaaaaaaaa'},
      {insert: '↵'},
    ]);
  }));
  it('Delta test with different background colors', inject([ProcessesDeltaTreeService], (service: ProcessesDeltaTreeService) => {
    expect(service.returnDeltaTreeToOriginalAttribute(
      new Delta([
        {
          insert: 'ab',
          attributes: {background: 'red'},
        },
        {insert: '↵'},
      ]),
      [
        new RangeAttribute({index: 0, length: 1},
          new Attribute('background', '#ff9900')),
        new RangeAttribute({index: 1, length: 2},
          new Attribute('background', '#ffffcc')),
      ],
    )).toEqual([
      {
        insert: 'a',
        attributes: {
          background: '#ff9900',
        },
      },
      {
        insert: 'b',
        attributes: {
          background: '#ffffcc',
        },
      },
      {insert: '↵'},
    ]);
  }));

  it('many deltas in one attribute', inject([ProcessesDeltaTreeService], (service: ProcessesDeltaTreeService) => {
    expect(service.returnDeltaTreeToOriginalAttribute(
      new Delta([
          {insert: '↵'},
          {
            attributes: {background: 'red'},
            insert: 'ф',
          },
          {insert: '↵↵'},
          {
            attributes: {background: 'red'},
            insert: 'ф',
          },
          {insert: '↵↵'},
        ],
      ),
      [
        new RangeAttribute({
            index: 1,
            length: 4,
          },
          new Attribute('background', '')),
      ],
    )).toEqual([
      {insert: '↵'},
      {
        insert: 'ф',
      },
      {insert: '↵↵'},
      {
        insert: 'ф',
      },
      {insert: '↵↵'},
    ]);
  }));
  it('many deltas in two attribute', inject([ProcessesDeltaTreeService], (service: ProcessesDeltaTreeService) => {
    expect(service.returnDeltaTreeToOriginalAttribute(
      new Delta([
          {insert: '↵'},
          {
            attributes: {background: 'red'},
            insert: 'ф',
          },
          {insert: '↵↵'},
          {
            attributes: {background: 'red'},
            insert: 'ф',
          },
          {insert: '↵↵'},
        ],
      ),
      [
        new RangeAttribute({
            index: 1,
            length: 1,
          },
          new Attribute('background', '#ff9900')),
        new RangeAttribute({
            index: 4,
            length: 1,
          },
          new Attribute('background', '#66b966')),
      ],
    )).toEqual([
      {insert: '↵'},
      {
        insert: 'ф',
        attributes: {background: '#ff9900'},
      },
      {insert: '↵↵'},
      {
        insert: 'ф',
        attributes: {background: '#66b966'},
      },
      {insert: '↵↵'},
    ]);
  }));
  it('variable with original attribute', inject([ProcessesDeltaTreeService], (service: ProcessesDeltaTreeService) => {
    expect(service.returnDeltaTreeToOriginalAttribute(
      new Delta([
          {
            attributes: {background: 'red'},
            insert: {
              variables: {
                name: 'qwerty',
                value: 'hello',
              },
            },
          },
          {insert: '↵'},
        ],
      ),
      [
        new RangeAttribute({
            index: 0,
            length: 1,
          },
          new Attribute('background', ''),
        ),
      ],
    )).toEqual([
      {
        insert: {
          variables: {
            name: 'qwerty',
            value: 'hello',
          },
        },
      },
      {insert: '↵'},
    ]);
  }));
  it('variable with no original attribute', inject([ProcessesDeltaTreeService], (service: ProcessesDeltaTreeService) => {
    expect(service.returnDeltaTreeToOriginalAttribute(
      new Delta([
          {
            attributes: {background: 'red'},
            insert: {
              variables: {
                name: 'qwerty',
                value: 'hello',
              },
            },
          },
          {insert: '↵'},
        ],
      ),
      [
        new RangeAttribute({
            index: 0,
            length: 1,
          },
          new Attribute('background', '#66b966'),
        ),
      ],
    )).toEqual([
      {
        attributes: {background: '#66b966'},
        insert: {
          variables: {
            name: 'qwerty',
            value: 'hello',
          },
        },
      },
      {insert: '↵'},
    ]);
  }));
});
