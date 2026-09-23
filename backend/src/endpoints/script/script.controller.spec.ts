import { Test, TestingModule } from '@nestjs/testing';
import { ScriptController } from './script.controller';
import { ScriptService } from './script.service';

describe('ScriptController', () => {
  let controller: ScriptController;

  beforeEach(async () => {
    // Every service here injects Mongoose models. They are auto-mocked rather
    // than listed one by one: this spec only checks the provider resolves.
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScriptController],
      providers: [ScriptService],
    })
      .useMocker(() => ({}))
      .compile();

    controller = module.get<ScriptController>(ScriptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
