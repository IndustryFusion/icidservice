import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    // Every service here injects Mongoose models. They are auto-mocked rather
    // than listed one by one: this spec only checks the provider resolves.
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    })
      .useMocker(() => ({}))
      .compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
