import { TestBed } from '@angular/core/testing';

import { MovimientoPantallaService } from './movimiento-pantalla.service';

describe('MovimientoPantallaService', () => {
  let service: MovimientoPantallaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovimientoPantallaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
