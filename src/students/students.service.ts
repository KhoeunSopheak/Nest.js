import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class StudentsService {
  constructor(
    @InjectDataSource() private readonly datasource: DataSource
  ){}

  create(createStudentDto: CreateStudentDto) {
   return "";
  }

  findAll() {
     
    const query = `select * from students`;
    
    return this.datasource.query(query);

  }

  findOne(id: string) {
    return ""
  }

  update(id: string, updateStudentDto: UpdateStudentDto) {
    return ""
  }

  remove(id: string) {
    return ""
  }
}
