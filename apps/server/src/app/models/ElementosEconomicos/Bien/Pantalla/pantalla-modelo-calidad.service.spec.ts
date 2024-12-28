import { Test, TestingModule } from '@nestjs/testing';
import { PantallaModeloCalidadService } from './pantalla-modelo-calidad.service';

describe('PantallaModeloCalidadService', () => {
  let service: PantallaModeloCalidadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PantallaModeloCalidadService],
    }).compile();

    service = module.get<PantallaModeloCalidadService>(
      PantallaModeloCalidadService
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
