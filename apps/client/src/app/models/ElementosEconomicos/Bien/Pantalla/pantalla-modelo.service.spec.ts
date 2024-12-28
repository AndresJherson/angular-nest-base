import { TestBed } from '@angular/core/testing';

import { PantallaModeloService } from './pantalla-modelo.service';

describe('PantallaModeloService', () => {
  let service: PantallaModeloService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PantallaModeloService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
