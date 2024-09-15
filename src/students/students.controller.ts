import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { EnrollItemsService } from 'src/enroll-items/enroll-items.service';

@Controller('students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly enrollItemService: EnrollItemsService
  ) {}


  

  @Get(":id/major-courses")
  findCourses(@Param("id") id: number){
    return this.studentsService.findAllCourses(id);
  }

  @Get(":id/enrollment-items")
  findEnrollCourses(@Param("id")id: number){
    return this.enrollItemService.findAll(id)
  }
  @Put(':enrollId/enrollment-items')
  update(@Param('enrollId') enrollId: number) {
    return this.studentsService.update(enrollId);
  }



}
