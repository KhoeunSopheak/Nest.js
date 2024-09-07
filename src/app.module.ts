import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './students/students.module';
import { Student } from './students/entities/student.entity';
import { MajorsModule } from './majors/majors.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { FacultiesModule } from './faculties/faculties.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      // url: "postgresql://postgres:zxfouDCoHDuVezriVfdbaidltCJXDRNg@meticulous-empathy.railway.internal:5432/railway",
      host: "127.0.0.1",
      port: 5432,
      database: "ppiu",
      username: "postgres",
      password: "root",
      entities: [Student],
      autoLoadEntities: true,
      synchronize: true
    }),
    StudentsModule,
    MajorsModule,
    UsersModule,
    CoursesModule,
    FacultiesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
