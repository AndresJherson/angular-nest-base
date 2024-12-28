import { TestBed } from '@angular/core/testing';

import { ServicioCategoriaService } from './servicio-categoria.service';

describe('ServicioCategoriaService', () => {
  let service: ServicioCategoriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioCategoriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
