import { TestBed } from '@angular/core/testing';

import { PantallaMarcaService } from './pantalla-marca.service';

describe('PantallaMarcaService', () => {
  let service: PantallaMarcaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PantallaMarcaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
