import { Test, TestingModule } from '@nestjs/testing';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';

describe('GatewayController', () => {
  let controller: GatewayController;

  beforeEach(async () => {
    // Every service here injects Mongoose models. They are auto-mocked rather
    // than listed one by one: this spec only checks the provider resolves.
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GatewayController],
      providers: [GatewayService],
    })
      .useMocker(() => ({}))
      .compile();

    controller = module.get<GatewayController>(GatewayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
