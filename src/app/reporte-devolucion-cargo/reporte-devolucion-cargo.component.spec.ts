import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDevolucionCargoComponent } from './reporte-devolucion-cargo.component';

describe('ReporteDevolucionCargoComponent', () => {
  let component: ReporteDevolucionCargoComponent;
  let fixture: ComponentFixture<ReporteDevolucionCargoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteDevolucionCargoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteDevolucionCargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
