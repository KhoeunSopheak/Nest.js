import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEnrollRequestDto } from './dto/create-enroll-request.dto';
import { UpdateEnrollRequestDto } from './dto/update-enroll-request.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class EnrollRequestsService {
  constructor(
    @InjectDataSource() private readonly datasource: DataSource,
  ) {}

  async create(createEnrollRequestDto: CreateEnrollRequestDto) {
    const { studentId, majorId, status, selectedCourse } = createEnrollRequestDto;
    const existingEnrollQuery = `SELECT * FROM enroll_requests WHERE student_id = ${studentId};`
  
    const insertEnrollRequests = `
      INSERT INTO enroll_requests 
        (major_id, student_id, status, requested_at, approved_at)
      VALUES 
        ($1, $2, $3, NOW(), NOW()) 
      RETURNING id;
    `;

    const queryRunner: QueryRunner = this.datasource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
    const existingEnroll = await this.datasource.query(existingEnrollQuery);

      let enrollId = null
      // Insert enroll request
      if(existingEnroll.length === 0){
      const result = await queryRunner.query(insertEnrollRequests, [majorId, studentId, status]);
           enrollId = result[0]?.id || result?.id;  // Adapt this depending on the result structure
      }
      else{
        enrollId = existingEnroll[0]?.id
      }
      console.log("enroll ID",enrollId)
      // Prepare and execute batch insert for enroll request items
      if (selectedCourse.length > 0) {
        const values = selectedCourse.map((course, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index*3 + 3})`).join(', ');
        const params = selectedCourse.flatMap(course => [course.courseId, enrollId, course.remark]);

        const insertEnrollRequestItems = `
          INSERT INTO enroll_request_items (course_id, enroll_request_id, remarks) 
          VALUES ${values};
        `;
        
        await queryRunner.query(insertEnrollRequestItems, params);
      }

      await queryRunner.commitTransaction();
      console.log(enrollId)
      return { "enrollId": enrollId };
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error inserting enroll request:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }  }

  findAll() {
    return `This action returns all enrollRequests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} enrollRequest`;
  }

  async update(enrollId: number) {
    const findEnrollQuery = `SELECT * FROM enroll_requests WHERE id=${enrollId} `

    const enrollExisted = await this.datasource.query(findEnrollQuery)
    if (enrollExisted.length == 0) {
      throw new HttpException("Enrollment not found!", HttpStatus.NOT_FOUND)
    }

    const updateEnrollmentStatusQuery = `UPDATE enroll_requests 
                                         SET total_credits=(
                                                            SELECT SUM(courses.credit) 
                                                            FROM enroll_request_items AS ERI
                                                            INNER JOIN courses
                                                            ON ERI.course_id = courses.id
                                                            WHERE ERI.enroll_request_id=${enrollId}), 
                                             status='submitted' WHERE id=${enrollId}`
    const result = await this.datasource.query(updateEnrollmentStatusQuery);

    if(result[1] > 0){
      return { message: "Enrollment updated successfully", statusCode: HttpStatus.OK };
    }else{
      throw new HttpException("internal sever error", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  remove(id: number) {
    return `This action removes a #${id} enrollRequest`;
  }
}
