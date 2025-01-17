import { TestBed } from '@angular/core/testing';

import { MovimientoProductoService } from './movimiento-producto.service';

describe('MovimientoProductoService', () => {
  let service: MovimientoProductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovimientoProductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
