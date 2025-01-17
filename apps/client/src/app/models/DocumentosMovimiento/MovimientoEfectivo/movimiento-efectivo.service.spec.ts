import { TestBed } from '@angular/core/testing';

import { MovimientoEfectivoService } from './movimiento-efectivo.service';

describe('MovimientoEfectivoService', () => {
  let service: MovimientoEfectivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovimientoEfectivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
