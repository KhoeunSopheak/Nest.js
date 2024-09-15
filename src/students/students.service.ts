import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EnrollItemsService } from 'src/enroll-items/enroll-items.service';
import { EnrollRequestsService } from 'src/enroll-requests/enroll-requests.service';
import { HttpException } from '@nestjs/common';
@Injectable()
export class StudentsService {
  constructor(
    @InjectDataSource() private readonly datasource: DataSource,
    private readonly enrollItemService: EnrollItemsService,
    private readonly enrollRequestService: EnrollRequestsService
  ) { }

  

  update(enrollId: number) {
    return this.enrollRequestService.update(enrollId);
  }



  async findAllCourses(id: number) {
    const query = `
      SELECT 
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
        sah.student_id = $1;
    `;
  
    try {
      // Fetch courses related to the student
      const data = await this.datasource.query(query, [id]);
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
      }));
  
      // Fetch courses that the student is already enrolled in
      const selectedCourses = await this.enrollItemService.findAll(id);
      const courses = coursesInMajor.filter(course => 
        !selectedCourses.courses.find(c => c.courseTitleId === course.courseTitleId)
      );
  
      // Group by programClassType
      const result = courses.reduce((acc, item) => {
        let programTypeObj = acc.find(obj => obj.programType === item.programClassType);
        
        if (!programTypeObj) {
          programTypeObj = {
            programType: item.programClassType,
            courses: []
          };
          acc.push(programTypeObj);
        }
        
        programTypeObj.courses.push({
          majorId: item.majorId,
          courseId: item.courseId,
          courseTitleId: item.courseTitleId,
          courseTitle: item.courseTitle,
          credit: item.credit
        });
        
        return acc;
      }, []);
      
      return result;
  
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw new HttpException('Failed to fetch courses', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
