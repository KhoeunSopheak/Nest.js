import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateEnrollItemDto } from './dto/create-enroll-item.dto';
import { UpdateEnrollItemDto } from './dto/update-enroll-item.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { HttpException } from '@nestjs/common';
@Injectable()
export class EnrollItemsService {
  constructor(
    @InjectDataSource() private readonly datasource: DataSource
  ) {}

  create(createEnrollItemDto: CreateEnrollItemDto) {
    // Example implementation, you can adjust this if needed
    return 'This action adds a new enrollItem';
  }

  async findAll(id: number) {
    try {
      const query = `SELECT 
                      courses.id,
                      courses.title, 
                      courses.credit, 
                      ER.status, 
                      ER.student_id,
                      courses.course_id, 
                      ERI.enroll_request_id, 
                      ERI.remarks   
                  FROM enroll_request_items AS ERI
                  INNER JOIN 
                      enroll_requests AS ER ON ERI.enroll_request_id = ER.id
                  INNER JOIN 
                      courses ON ERI.course_id = courses.id
                  WHERE ER.student_id = ${id};`;

      const data = await this.datasource.query(query);

      if (!data.length) {
        throw new HttpException('No enrollments found for the given student ID', HttpStatus.NOT_FOUND);
      }

      const cleanData = data.map(item => ({
        courseId: item.id,
        studentId: item.student_id,
        courseTitle: item.title,
        credit: item.credit,
        courseTitleId: item.course_id,
        enrollId: item.enroll_request_id,
        status: item.status,
        remark: item.remarks
      }));

      return {
        enrollId: cleanData[0]?.enrollId,
        enrollStatus: cleanData[0]?.status,
        courses: cleanData
      };

    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve enroll items',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }



  async update(enrollId: number, courseId: number, updateEnrollItem: UpdateEnrollItemDto) {
    try {
      const query = `UPDATE enroll_request_items SET remarks=$1 
                     WHERE enroll_request_id=$2 AND course_id=$3`;
      
      const result = await this.datasource.query(query, [updateEnrollItem.remark, enrollId, courseId]);
      
      if (result.affectedRows === 0) {
        throw new HttpException('Update failed: enroll item not found', HttpStatus.NOT_FOUND);
      }

      return { message: 'Enroll item updated successfully' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update enroll item',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(enrollId: number, courseId: number) {
    try {
      const query = `DELETE FROM enroll_request_items 
                     WHERE course_id = ${courseId} AND enroll_request_id = ${enrollId};`;

      const result = await this.datasource.query(query);

      if (result.affectedRows === 0) {
        throw new HttpException('Delete failed: enroll item not found', HttpStatus.NOT_FOUND);
      }

      return { message: 'Enroll item deleted successfully' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete enroll item',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}