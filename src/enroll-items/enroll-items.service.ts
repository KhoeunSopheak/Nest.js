import { Injectable } from '@nestjs/common';
import { CreateEnrollItemDto } from './dto/create-enroll-item.dto';
import { UpdateEnrollItemDto } from './dto/update-enroll-item.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class EnrollItemsService {
  constructor(
    @InjectDataSource() private readonly datasource: DataSource
  ){}
  create(createEnrollItemDto: CreateEnrollItemDto) {
    return 'This action adds a new enrollItem';
  }

  async findAll(id: number) {

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
                        WHERE ER.student_id = ${id};`

      // const query = `SELECT ER.status,
      //                       ER.student_id, 
      //                       ERI.course_id,
      //                       courses.title, 
      //                       courses.id,
      //                       courses.credit, 
      //                       courses.course_id,
      //                       ERI.enroll_request_id,
      //                       ERI.remarks
      //                   FROM enroll_requests AS ER
      //                   INNER JOIN enroll_request_items AS ERI 
      //                   INNER JOIN courses ON ERI.course_id = courses.id
      //                   ON ER.id = ERI.enroll_request_id;`
      
      const data = await this.datasource.query(query);

      const cleanData = data.map(item =>({
      courseId: item.id,
      studentId: item.student_id,
      courseTitle: item.title,
      credit: item.credit,
      courseTitleId: item.course_id,
      enrollId: item.enroll_request_id,
      status: item.status,
      remark: item.remarks
      }))
      return {"enrollId": cleanData[0]?.enrollId , "enrollStatus": cleanData[0]?.status, "courses": cleanData};
  }

  findOne(id: number) {
    return `This action returns a #${id} enrollItem`;
  }

  update(enrollId: number, courseId: number, updateEnrollItem: UpdateEnrollItemDto) {
    console.log(enrollId, courseId, updateEnrollItem.remark)
    const query = `UPDATE enroll_request_items SET remarks=$1 
                   WHERE enroll_request_id=$2 AND course_id=$3`
            
    return this.datasource.query(query,[updateEnrollItem.remark, enrollId, courseId]);
  }

  remove(enrollId: number, courseId: number) {
    const query = `DELETE FROM enroll_request_items 
                   WHERE course_id = ${courseId} AND enroll_request_id = ${enrollId};
                   `
    return this.datasource.query(query);
  }
}

