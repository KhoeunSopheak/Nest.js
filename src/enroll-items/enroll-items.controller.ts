import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { EnrollItemsService } from './enroll-items.service';
import { CreateEnrollItemDto } from './dto/create-enroll-item.dto';
import { UpdateEnrollItemDto } from './dto/update-enroll-item.dto';

@Controller('enrollment-items')
export class EnrollItemsController {
  constructor(private readonly enrollItemsService: EnrollItemsService) {}

  @Post()
  create(@Body() createEnrollItemDto: CreateEnrollItemDto) {
    return this.enrollItemsService.create(createEnrollItemDto);
  }

  // update remarks for each items
  @Put('/remarks')
  update(@Query("enrollId") enrollId: number, @Query("courseId") courseId: number, @Body() updateEnrollItemDto: UpdateEnrollItemDto) {
    return this.enrollItemsService.update(enrollId, courseId, updateEnrollItemDto);
  }
  
  @Delete()
  remove(@Query("enrollId") enrollId: number , @Query("courseId") courseId: number) {
    return this.enrollItemsService.remove(enrollId, courseId);
  }
}
