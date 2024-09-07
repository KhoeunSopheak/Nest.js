import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';
import { IsString, Length } from 'class-validator';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
    @IsString()
    @Length(1, 255)
    name: string
}
