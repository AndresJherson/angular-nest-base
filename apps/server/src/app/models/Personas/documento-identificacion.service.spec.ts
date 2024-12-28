import { Test, TestingModule } from '@nestjs/testing';
import { DocumentoIdentificacionService } from './documento-identificacion.service';

describe('DocumentoIdentificacionService', () => {
  let service: DocumentoIdentificacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentoIdentificacionService],
    }).compile();

    service = module.get<DocumentoIdentificacionService>(
      DocumentoIdentificacionService
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
