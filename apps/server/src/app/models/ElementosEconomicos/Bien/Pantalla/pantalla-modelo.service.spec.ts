import { Test, TestingModule } from '@nestjs/testing';
import { PantallaModeloService } from './pantalla-modelo.service';

describe('PantallaModeloService', () => {
  let service: PantallaModeloService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PantallaModeloService],
    }).compile();

    service = module.get<PantallaModeloService>(PantallaModeloService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
