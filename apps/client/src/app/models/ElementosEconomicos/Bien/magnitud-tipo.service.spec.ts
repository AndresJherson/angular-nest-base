import { TestBed } from '@angular/core/testing';

import { MagnitudTipoService } from './magnitud-tipo.service';

describe('MagnitudTipoService', () => {
  let service: MagnitudTipoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MagnitudTipoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
