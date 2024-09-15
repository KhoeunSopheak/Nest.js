import { Test, TestingModule } from '@nestjs/testing';
import { EnrollRequestsService } from './enroll-requests.service';

describe('EnrollRequestsService', () => {
  let service: EnrollRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrollRequestsService],
    }).compile();

    service = module.get<EnrollRequestsService>(EnrollRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
