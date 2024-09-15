import { Module } from '@nestjs/common';
import { EnrollItemsService } from './enroll-items.service';
import { EnrollItemsController } from './enroll-items.controller';

@Module({
  controllers: [EnrollItemsController],
  providers: [EnrollItemsService],
})
export class EnrollItemsModule {}
