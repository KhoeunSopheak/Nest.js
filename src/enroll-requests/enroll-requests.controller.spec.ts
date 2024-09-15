import { Test, TestingModule } from '@nestjs/testing';
import { EnrollRequestsController } from './enroll-requests.controller';
import { EnrollRequestsService } from './enroll-requests.service';

describe('EnrollRequestsController', () => {
  let controller: EnrollRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollRequestsController],
      providers: [EnrollRequestsService],
    }).compile();

    controller = module.get<EnrollRequestsController>(EnrollRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
