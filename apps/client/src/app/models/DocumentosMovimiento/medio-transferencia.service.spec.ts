import { TestBed } from '@angular/core/testing';

import { MedioTransferenciaService } from './medio-transferencia.service';

describe('MedioTransferenciaService', () => {
  let service: MedioTransferenciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedioTransferenciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
