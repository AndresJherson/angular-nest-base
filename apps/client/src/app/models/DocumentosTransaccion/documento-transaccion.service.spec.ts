import { TestBed } from '@angular/core/testing';

import { DocumentoTransaccionService } from './documento-transaccion.service';

describe('DocumentoTransaccionService', () => {
  let service: DocumentoTransaccionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentoTransaccionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
