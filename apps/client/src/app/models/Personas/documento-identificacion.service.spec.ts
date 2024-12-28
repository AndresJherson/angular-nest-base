import { TestBed } from '@angular/core/testing';

import { DocumentoIdentificacionService } from './documento-identificacion.service';

describe('DocumentoIdentificacionService', () => {
  let service: DocumentoIdentificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentoIdentificacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
