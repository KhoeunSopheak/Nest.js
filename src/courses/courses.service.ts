import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CoursesService {

  constructor(
    @InjectDataSource() private readonly datasource: DataSource
  ){}
  create(createCourseDto: CreateCourseDto) {
    return 'This action adds a new course';
  }

  findAll() {
    return `This action returns all courses`;
  }

  async findOne(id: number) {
    const query =`SELECT 
                      sah.student_id,
                      mc.major_id, 
                      mc.course_id,
                      courses.id,
                      mc.academic_period_id,
                      mc.program_class_type, 
                      majors.major_title,
                      courses.course_id,
                      courses.title, 
                      ap.nth_year, 
                      courses.credit
                  FROM 
                      student_academic_histories AS sah
                  INNER JOIN 
                      academic_peroids AS ap ON sah.academic_period_id = ap.id
                  INNER JOIN 
                      major_courses AS mc ON mc.academic_period_id = ap.id
                  INNER JOIN 
                      courses ON mc.course_id = courses.id
                  INNER JOIN
                    majors ON mc.major_id = majors.id
                  WHERE 
                      sah.student_id = 1;
                   `
    const data = await this.datasource.query(query)
    const cleanData = data.map(item =>({
      studentId: item.student_id,
      academicPeriod: item.academic_period_id,
      majorId: item.major_id,
      courseId: item.id,
      courseTitleId: item.course_id,
      majorTitle: item.major_title,
      courseTitle: item.title,
      credit: item.credit,
      programClassType: item.program_class_type,
    }))
    return cleanData
   
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
