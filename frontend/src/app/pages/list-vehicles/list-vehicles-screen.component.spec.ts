import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVehiclesScreenComponent } from './list-vehicles-screen.component';

describe('ListVehiclesScreenComponent', () => {
  let component: ListVehiclesScreenComponent;
  let fixture: ComponentFixture<ListVehiclesScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListVehiclesScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListVehiclesScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
