import { Test, TestingModule } from '@nestjs/testing';
import { BienMarcaService } from './bien-marca.service';

describe('BienMarcaService', () => {
  let service: BienMarcaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BienMarcaService],
    }).compile();

    service = module.get<BienMarcaService>(BienMarcaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
