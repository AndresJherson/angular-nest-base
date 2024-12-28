import { Test, TestingModule } from '@nestjs/testing';
import { MagnitudService } from './magnitud.service';

describe('MagnitudService', () => {
  let service: MagnitudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MagnitudService],
    }).compile();

    service = module.get<MagnitudService>(MagnitudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
