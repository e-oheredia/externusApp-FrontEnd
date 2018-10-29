import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteIndicadorVolumenComponent } from './reporte-indicador-volumen.component';

describe('ReporteIndicadorVolumenComponent', () => {
  let component: ReporteIndicadorVolumenComponent;
  let fixture: ComponentFixture<ReporteIndicadorVolumenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteIndicadorVolumenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteIndicadorVolumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
