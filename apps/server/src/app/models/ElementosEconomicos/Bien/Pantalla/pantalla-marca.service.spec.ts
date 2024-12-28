import { Test, TestingModule } from '@nestjs/testing';
import { PantallaMarcaService } from './pantalla-marca.service';

describe('PantallaMarcaService', () => {
  let service: PantallaMarcaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PantallaMarcaService],
    }).compile();

    service = module.get<PantallaMarcaService>(PantallaMarcaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
