import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorWithVariablesComponent } from './editor-with-variables.component';

describe('EditorWithVariablesComponent', () => {
  let component: EditorWithVariablesComponent;
  let fixture: ComponentFixture<EditorWithVariablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorWithVariablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorWithVariablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
