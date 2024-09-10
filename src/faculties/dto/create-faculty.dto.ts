import { IsInt, IsString, Length } from "class-validator";

export class CreateFacultyDto {
    @IsString()
    @Length(1, 255)
    name: string 
    
    @IsInt()
    min_credit: Int16Array
}
