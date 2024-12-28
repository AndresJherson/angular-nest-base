import { Test, TestingModule } from '@nestjs/testing';
import { CreditoCobrarService } from './credito-cobrar.service';

describe('CreditoCobrarService', () => {
  let service: CreditoCobrarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreditoCobrarService],
    }).compile();

    service = module.get<CreditoCobrarService>(CreditoCobrarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
