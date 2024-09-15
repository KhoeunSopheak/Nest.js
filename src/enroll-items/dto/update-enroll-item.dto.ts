import { PartialType } from '@nestjs/mapped-types';
import { CreateEnrollItemDto } from './create-enroll-item.dto';

export class UpdateEnrollItemDto extends PartialType(CreateEnrollItemDto) {
    remark:string
}
