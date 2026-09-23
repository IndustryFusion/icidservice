import { Test, TestingModule } from '@nestjs/testing';
import { ScriptService } from './script.service';

describe('ScriptService', () => {
  let service: ScriptService;

  beforeEach(async () => {
    // Every service here injects Mongoose models. They are auto-mocked rather
    // than listed one by one: this spec only checks the provider resolves.
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScriptService],
    })
      .useMocker(() => ({}))
      .compile();

    service = module.get<ScriptService>(ScriptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
