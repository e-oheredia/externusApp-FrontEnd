import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteIndicadorEficienciaComponent } from './reporte-indicador-eficiencia.component';

describe('ReporteIndicadorEficienciaComponent', () => {
  let component: ReporteIndicadorEficienciaComponent;
  let fixture: ComponentFixture<ReporteIndicadorEficienciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteIndicadorEficienciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteIndicadorEficienciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
