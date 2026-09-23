import { Test, TestingModule } from '@nestjs/testing';
import { GatewayService } from './gateway.service';

describe('GatewayService', () => {
  let service: GatewayService;

  beforeEach(async () => {
    // Every service here injects Mongoose models. They are auto-mocked rather
    // than listed one by one: this spec only checks the provider resolves.
    const module: TestingModule = await Test.createTestingModule({
      providers: [GatewayService],
    })
      .useMocker(() => ({}))
      .compile();

    service = module.get<GatewayService>(GatewayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
