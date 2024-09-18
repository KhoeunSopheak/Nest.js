import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './students/students.module';
import { ConfigModule } from '@nestjs/config';
import { EnrollItemsModule } from './enroll-items/enroll-items.module';
import { EnrollRequestsModule } from './enroll-requests/enroll-requests.module';

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
      ssl: process.env.ENVIRONMENT == 'local' ? false : { rejectUnauthorized: false },
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
    }),
    StudentsModule,
    EnrollItemsModule,
    EnrollRequestsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
