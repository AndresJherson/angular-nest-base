import { TestBed } from '@angular/core/testing';

import { BienMarcaService } from './bien-marca.service';

describe('BienMarcaService', () => {
  let service: BienMarcaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BienMarcaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
