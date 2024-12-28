import { Test, TestingModule } from '@nestjs/testing';
import { MovimientoPantallaService } from './movimiento-pantalla.service';

describe('MovimientoPantallaService', () => {
  let service: MovimientoPantallaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovimientoPantallaService],
    }).compile();

    service = module.get<MovimientoPantallaService>(MovimientoPantallaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
