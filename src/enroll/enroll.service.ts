import { Injectable } from '@nestjs/common';
import { CreateEnrollDto } from './dto/create-enroll.dto';
import { UpdateEnrollDto } from './dto/update-enroll.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class EnrollService {

  constructor(
    @InjectDataSource() private readonly datasource: DataSource
  ){}
  async create(createEnrollDto: CreateEnrollDto) {
    const { studentId, majorId, selectedCourse } = createEnrollDto;
  
    const insertEnrollRequests  = `
      INSERT INTO enroll_requests 
        (major_id, student_id, status, requested_at, approved_at)
      VALUES 
        ($1, $2, 'pending', NOW(), NOW()) 
      RETURNING id;
    `;
  
    const data = await this.datasource.query(insertEnrollRequests, [majorId, studentId]);
    const enroll_id = data[0].id;
  
    // Construct the query with PostgreSQL style numbered placeholders
    const insertEnrollRequestItems = `
      INSERT INTO enroll_request_items (course_id, enroll_request_id) 
      VALUES ${selectedCourse.map(() => `($1, $2)`).join(', ')}
    `;

    console.log(selectedCourse)
    // Flatten the values array: each courseId and enroll_id pair should be added to the values array
    const values = selectedCourse.flatMap(course => [course.courseId, enroll_id]);
  
    try {
      const result = await this.datasource.query(insertEnrollRequestItems, values);
      return result;
    } catch (error) {
      console.error('Error inserting courses:', error);
      throw error;
    }
  }
  findAll() {
    return `This action returns all enroll`;
  }

  findOne(id: number) {
    return `This action returns a #${id} enroll`;
  }

  update(id: number, updateEnrollDto: UpdateEnrollDto) {
    return `This action updates a #${id} enroll`;
  }

  remove(id: number) {
    return `This action removes a #${id} enroll`;
  }
}
