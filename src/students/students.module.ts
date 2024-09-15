import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { EnrollItemsModule } from 'src/enroll-items/enroll-items.module';
import { EnrollItemsService } from 'src/enroll-items/enroll-items.service';
import { EnrollRequestsService } from 'src/enroll-requests/enroll-requests.service';

@Module({
  imports: [TypeOrmModule.forFeature([Student]), EnrollItemsModule],
  controllers: [StudentsController],
  providers: [StudentsService, EnrollItemsService, EnrollRequestsService],
})
export class StudentsModule {
  
}
