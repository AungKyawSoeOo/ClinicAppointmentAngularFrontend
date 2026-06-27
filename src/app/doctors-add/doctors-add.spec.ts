import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsAdd } from './doctors-add';

describe('DoctorsAdd', () => {
  let component: DoctorsAdd;
  let fixture: ComponentFixture<DoctorsAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorsAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
