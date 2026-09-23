import { Test, TestingModule } from '@nestjs/testing';
import { CertificateService } from './certificate.service';

describe('CertificateService', () => {
  let service: CertificateService;

  beforeEach(async () => {
    // Every service here injects Mongoose models. They are auto-mocked rather
    // than listed one by one: this spec only checks the provider resolves.
    const module: TestingModule = await Test.createTestingModule({
      providers: [CertificateService],
    })
      .useMocker(() => ({}))
      .compile();

    service = module.get<CertificateService>(CertificateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
