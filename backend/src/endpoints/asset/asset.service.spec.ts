import { Test, TestingModule } from '@nestjs/testing';
import { AssetService } from './asset.service';

describe('AssetService', () => {
  let service: AssetService;

  beforeEach(async () => {
    // Every service here injects Mongoose models. They are auto-mocked rather
    // than listed one by one: this spec only checks the provider resolves.
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetService],
    })
      .useMocker(() => ({}))
      .compile();

    service = module.get<AssetService>(AssetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
