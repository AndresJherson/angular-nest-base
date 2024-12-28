import { Test, TestingModule } from '@nestjs/testing';
import { MovimientoEfectivoService } from './movimiento-efectivo.service';

describe('MovimientoEfectivoService', () => {
  let service: MovimientoEfectivoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovimientoEfectivoService],
    }).compile();

    service = module.get<MovimientoEfectivoService>(MovimientoEfectivoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
