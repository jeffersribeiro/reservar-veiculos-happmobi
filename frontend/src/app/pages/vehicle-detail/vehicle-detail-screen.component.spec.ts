import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailScreenComponent } from './vehicle-detail-screen.component';

describe('VehicleDetailScreenComponent', () => {
  let component: VehicleDetailScreenComponent;
  let fixture: ComponentFixture<VehicleDetailScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDetailScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDetailScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
