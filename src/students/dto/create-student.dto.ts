import { IsString, Length } from "class-validator";



export class CreateStudentDto {

    @IsString()
    @Length(1, 255)
    name: string 

}
