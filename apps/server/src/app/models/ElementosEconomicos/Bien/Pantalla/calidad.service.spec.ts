import { Test, TestingModule } from '@nestjs/testing';
import { CalidadService } from './calidad.service';

describe('CalidadService', () => {
  let service: CalidadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalidadService],
    }).compile();

    service = module.get<CalidadService>(CalidadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
