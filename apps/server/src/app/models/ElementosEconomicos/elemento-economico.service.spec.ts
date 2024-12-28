import { Test, TestingModule } from '@nestjs/testing';
import { ElementoEconomicoService } from './elemento-economico.service';

describe('ElementoEconomicoService', () => {
  let service: ElementoEconomicoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElementoEconomicoService],
    }).compile();

    service = module.get<ElementoEconomicoService>(ElementoEconomicoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
