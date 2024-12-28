import { TestBed } from '@angular/core/testing';

import { BienCategoriaService } from './bien-categoria.service';

describe('BienCategoriaService', () => {
  let service: BienCategoriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BienCategoriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
