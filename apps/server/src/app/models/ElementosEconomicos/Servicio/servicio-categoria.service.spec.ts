import { Test, TestingModule } from '@nestjs/testing';
import { ServicioCategoriaService } from './servicio-categoria.service';

describe('ServicioCategoriaService', () => {
  let service: ServicioCategoriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicioCategoriaService],
    }).compile();

    service = module.get<ServicioCategoriaService>(ServicioCategoriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
