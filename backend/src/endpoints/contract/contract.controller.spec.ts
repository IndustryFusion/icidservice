import { Test, TestingModule } from '@nestjs/testing';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';

describe('ContractController', () => {
  let controller: ContractController;

  beforeEach(async () => {
    // Every service here injects Mongoose models. They are auto-mocked rather
    // than listed one by one: this spec only checks the provider resolves.
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractController],
      providers: [ContractService],
    })
      .useMocker(() => ({}))
      .compile();

    controller = module.get<ContractController>(ContractController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
