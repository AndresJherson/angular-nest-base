import { Test, TestingModule } from '@nestjs/testing';
import { MovimientoProductoService } from './movimiento-producto.service';

describe('MovimientoProductoService', () => {
  let service: MovimientoProductoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovimientoProductoService],
    }).compile();

    service = module.get<MovimientoProductoService>(MovimientoProductoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
