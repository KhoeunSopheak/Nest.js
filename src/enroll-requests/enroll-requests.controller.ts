import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { EnrollRequestsService } from './enroll-requests.service';
import { CreateEnrollRequestDto } from './dto/create-enroll-request.dto';
import { UpdateEnrollRequestDto } from './dto/update-enroll-request.dto';

@Controller('enroll-requests')
export class EnrollRequestsController {
  constructor(private readonly enrollRequestsService: EnrollRequestsService) {}

  @Post()
  create(@Body() createEnrollRequestDto: CreateEnrollRequestDto) {
    return this.enrollRequestsService.create(createEnrollRequestDto);
  }

  
  @Put(':enrollId')
  update(@Param('enrollId') enrollId: number) {
    return this.enrollRequestsService.update(enrollId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollRequestsService.remove(+id);
  }
}
