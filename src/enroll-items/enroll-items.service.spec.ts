import { Test, TestingModule } from '@nestjs/testing';
import { EnrollItemsService } from './enroll-items.service';

describe('EnrollItemsService', () => {
  let service: EnrollItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrollItemsService],
    }).compile();

    service = module.get<EnrollItemsService>(EnrollItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
