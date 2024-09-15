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
    const existingEnrollQuery = `SELECT * FROM enroll_requests WHERE student_id = $1;`;
  
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
      const existingEnroll = await queryRunner.query(existingEnrollQuery, [studentId]);

      let enrollId = null;

      // Insert enroll request
      if (existingEnroll.length === 0) {
        const result = await queryRunner.query(insertEnrollRequests, [majorId, studentId, status]);
        enrollId = result[0]?.id || result?.id;  // Adapt this depending on the result structure
      } else {
        enrollId = existingEnroll[0]?.id;
      }
      console.log('enroll ID', enrollId);

      // Prepare and execute batch insert for enroll request items
      if (selectedCourse.length > 0) {
        const values = selectedCourse.map((course, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`).join(', ');
        const params = selectedCourse.flatMap(course => [course.courseId, enrollId, course.remark]);

        const insertEnrollRequestItems = `
          INSERT INTO enroll_request_items (course_id, enroll_request_id, remarks) 
          VALUES ${values};
        `;
        
        await queryRunner.query(insertEnrollRequestItems, params);
      }

      await queryRunner.commitTransaction();
      return { enrollId: enrollId };
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error inserting enroll request:', error);
      throw new HttpException(
        error.message || 'Failed to create enrollment request',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    } finally {
      await queryRunner.release();
    }
  }


  async update(enrollId: number) {
    const findEnrollQuery = `SELECT * FROM enroll_requests WHERE id = $1`;

    try {
      const enrollExisted = await this.datasource.query(findEnrollQuery, [enrollId]);
      if (enrollExisted.length === 0) {
        throw new HttpException('Enrollment not found!', HttpStatus.NOT_FOUND);
      }

      const updateEnrollmentStatusQuery = `UPDATE enroll_requests 
                                           SET total_credits = (
                                                                SELECT SUM(courses.credit) 
                                                                FROM enroll_request_items AS ERI
                                                                INNER JOIN courses
                                                                ON ERI.course_id = courses.id
                                                                WHERE ERI.enroll_request_id = $1
                                                              ), 
                                               status = 'submitted' WHERE id = $1`;
      const result = await this.datasource.query(updateEnrollmentStatusQuery, [enrollId]);

      if (result.affectedRows > 0) {
        return { message: 'Enrollment updated successfully', statusCode: HttpStatus.OK };
      } else {
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update enrollment',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: number) {
    try {
      // Implement the logic to remove an enrollment request
      return `This action removes a #${id} enrollRequest`;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to remove enrollment request',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}