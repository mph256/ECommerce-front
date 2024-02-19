import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneFormComponent } from './phone-form.component';

describe('PhoneFormComponent', () => {
  let component: PhoneFormComponent;
  let fixture: ComponentFixture<PhoneFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhoneFormComponent]
    });
    fixture = TestBed.createComponent(PhoneFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
