import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitFormComponent } from './permit-form.component';

describe('PermitFormComponent', () => {
  let component: PermitFormComponent;
  let fixture: ComponentFixture<PermitFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermitFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
