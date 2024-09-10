import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnrollService } from './enroll.service';
import { CreateEnrollDto } from './dto/create-enroll.dto';
import { UpdateEnrollDto } from './dto/update-enroll.dto';

@Controller('enroll')
export class EnrollController {
  constructor(private readonly enrollService: EnrollService) {}

  @Post()
  create(@Body() createEnrollDto: CreateEnrollDto) {
    return this.enrollService.create(createEnrollDto);
  }

  @Get()
  findAll() {
    return this.enrollService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnrollDto: UpdateEnrollDto) {
    return this.enrollService.update(+id, updateEnrollDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollService.remove(+id);
  }
}
