import { Test, TestingModule } from '@nestjs/testing';
import { EnrollItemsController } from './enroll-items.controller';
import { EnrollItemsService } from './enroll-items.service';

describe('EnrollItemsController', () => {
  let controller: EnrollItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollItemsController],
      providers: [EnrollItemsService],
    }).compile();

    controller = module.get<EnrollItemsController>(EnrollItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
