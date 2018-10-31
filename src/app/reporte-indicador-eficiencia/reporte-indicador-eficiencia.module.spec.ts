import { ReporteIndicadorEficienciaModule } from './reporte-indicador-eficiencia.module';

describe('ReporteIndicadorEficienciaModule', () => {
  let reporteIndicadorEficienciaModule: ReporteIndicadorEficienciaModule;

  beforeEach(() => {
    reporteIndicadorEficienciaModule = new ReporteIndicadorEficienciaModule();
  });

  it('should create an instance', () => {
    expect(reporteIndicadorEficienciaModule).toBeTruthy();
  });
});
