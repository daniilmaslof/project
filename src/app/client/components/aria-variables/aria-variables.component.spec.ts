import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AriaVariablesComponent } from './aria-variables.component';

describe('AriaVariablesComponent', () => {
  let component: AriaVariablesComponent;
  let fixture: ComponentFixture<AriaVariablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AriaVariablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AriaVariablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
