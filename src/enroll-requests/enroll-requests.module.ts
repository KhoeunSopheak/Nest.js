import { Module } from '@nestjs/common';
import { EnrollRequestsService } from './enroll-requests.service';
import { EnrollRequestsController } from './enroll-requests.controller';

@Module({
  controllers: [EnrollRequestsController],
  providers: [EnrollRequestsService],
})
export class EnrollRequestsModule {}
