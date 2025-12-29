import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PillInputComponent } from './pill-input.component';

describe('PillInputComponent', () => {
  let component: PillInputComponent;
  let fixture: ComponentFixture<PillInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PillInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PillInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
