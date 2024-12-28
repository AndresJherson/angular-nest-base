import { Test, TestingModule } from '@nestjs/testing';
import { BienCategoriaService } from './bien-categoria.service';

describe('BienCategoriaService', () => {
  let service: BienCategoriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BienCategoriaService],
    }).compile();

    service = module.get<BienCategoriaService>(BienCategoriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
