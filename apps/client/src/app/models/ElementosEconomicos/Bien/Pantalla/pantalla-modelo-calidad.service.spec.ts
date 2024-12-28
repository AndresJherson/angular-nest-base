import { TestBed } from '@angular/core/testing';

import { PantallaModeloCalidadService } from './pantalla-modelo-calidad.service';

describe('PantallaModeloCalidadService', () => {
  let service: PantallaModeloCalidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PantallaModeloCalidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
