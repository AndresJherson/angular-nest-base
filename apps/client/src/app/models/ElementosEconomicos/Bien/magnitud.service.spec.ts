import { TestBed } from '@angular/core/testing';

import { MagnitudService } from './magnitud.service';

describe('MagnitudService', () => {
  let service: MagnitudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MagnitudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
