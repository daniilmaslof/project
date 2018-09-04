import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariablesModalComponent } from './variables-modal.component';

describe('VariablesModalComponent', () => {
  let component: VariablesModalComponent;
  let fixture: ComponentFixture<VariablesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariablesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariablesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
