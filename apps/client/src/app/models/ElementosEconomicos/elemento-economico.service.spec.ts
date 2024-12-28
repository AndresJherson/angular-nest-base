import { TestBed } from '@angular/core/testing';

import { ElementoEconomicoService } from './elemento-economico.service';

describe('ElementoEconomicoService', () => {
  let service: ElementoEconomicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElementoEconomicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
