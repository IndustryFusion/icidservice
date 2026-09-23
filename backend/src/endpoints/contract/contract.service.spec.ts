import { Test, TestingModule } from '@nestjs/testing';
import { ContractService } from './contract.service';

describe('ContractService', () => {
  let service: ContractService;

  beforeEach(async () => {
    // Every service here injects Mongoose models. They are auto-mocked rather
    // than listed one by one: this spec only checks the provider resolves.
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractService],
    })
      .useMocker(() => ({}))
      .compile();

    service = module.get<ContractService>(ContractService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
