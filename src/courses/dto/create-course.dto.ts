import { IsInt, IsString, Length } from "class-validator";




export class CreateCourseDto {

    @IsString()
    @Length(1, 255)
    title: string 

    parent_subject_id: string 
    
    @IsInt()
    credit: Int32Array

}
