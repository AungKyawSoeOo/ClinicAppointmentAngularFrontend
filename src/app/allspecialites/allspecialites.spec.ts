import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Allspecialites } from './allspecialites';

describe('Allspecialites', () => {
  let component: Allspecialites;
  let fixture: ComponentFixture<Allspecialites>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Allspecialites]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Allspecialites);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
