import { Test, TestingModule } from '@nestjs/testing';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';

describe('AssetController', () => {
  let controller: AssetController;

  beforeEach(async () => {
    // Every service here injects Mongoose models. They are auto-mocked rather
    // than listed one by one: this spec only checks the provider resolves.
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetController],
      providers: [AssetService],
    })
      .useMocker(() => ({}))
      .compile();

    controller = module.get<AssetController>(AssetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
