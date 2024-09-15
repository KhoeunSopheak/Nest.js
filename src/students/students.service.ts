import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EnrollItemsService } from 'src/enroll-items/enroll-items.service';
import { EnrollRequestsService } from 'src/enroll-requests/enroll-requests.service';

@Injectable()
export class StudentsService {
  constructor(
    @InjectDataSource() private readonly datasource: DataSource,
    private readonly enrollItemService: EnrollItemsService,
    private readonly enrollRequestService: EnrollRequestsService
  ) { }

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

  update(enrollId: number) {
    return this.enrollRequestService.update(enrollId);
  }

  remove(id: string) {
    return ""
  }

  async findAllCourses(id: number) {
    const query = `SELECT 
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
                      sah.student_id = ${id};
                  `
    
    const data = await this.datasource.query(query)
    const coursesInMajor = data.map(item => ({
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

    const selectedCourses = await this.enrollItemService.findAll(id);
    const courses = coursesInMajor.filter(course => !selectedCourses.courses.find(c => c.courseTitleId === course.courseTitleId ))

    const result = courses.reduce((acc, item) => {
      // Check if programType exists in the accumulator
      let programTypeObj = acc.find(obj => obj.programType === item.programClassType);
      
      if (!programTypeObj) {
        // If it doesn't exist, create a new object for this programType
        programTypeObj = {
          programType: item.programClassType,
          courses: []
        };
        acc.push(programTypeObj);
      }
      
      // Add the course details to the corresponding programType
      programTypeObj.courses.push({
        majorId: item.majorId,
        courseId: item.courseId,
        courseTitleId: item.courseTitleId,
        courseTitle: item.courseTitle,
        credit: item.credit
      });
      return acc;
    }, []);
    return result
  }
}
