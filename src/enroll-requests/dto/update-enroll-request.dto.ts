import { PartialType } from '@nestjs/mapped-types';
import { CreateEnrollRequestDto } from './create-enroll-request.dto';

export class UpdateEnrollRequestDto extends PartialType(CreateEnrollRequestDto) {}
