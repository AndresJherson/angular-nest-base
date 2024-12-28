import { Test, TestingModule } from '@nestjs/testing';
import { MagnitudTipoService } from './magnitud-tipo.service';

describe('MagnitudTipoService', () => {
  let service: MagnitudTipoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MagnitudTipoService],
    }).compile();

    service = module.get<MagnitudTipoService>(MagnitudTipoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
