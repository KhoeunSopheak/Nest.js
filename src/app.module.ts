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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnrollModule } from './enroll/enroll.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      // url: "postgresql://postgres:zxfouDCoHDuVezriVfdbaidltCJXDRNg@meticulous-empathy.railway.internal:5432/railway",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
    }),
    StudentsModule,
    MajorsModule,
    UsersModule,
    CoursesModule,
    FacultiesModule,
    EnrollModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
