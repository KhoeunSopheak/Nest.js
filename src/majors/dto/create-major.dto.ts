import { IsInt, IsString, Length } from "class-validator"

export class CreateMajorDto {

    @IsString()
    @Length(1, 255)
    major_name: string 

    @IsInt()
    min_credit_required: Int16Array

    @IsString()
    faculty_id: string 
}
