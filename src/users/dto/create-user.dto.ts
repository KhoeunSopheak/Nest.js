import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'First name must be a string.' })
  @IsNotEmpty({ message: 'First name is required.' })
  first_name: string;

  @IsString({ message: 'Last name must be a string.' })
  @IsNotEmpty({ message: 'Last name is required.' })
  last_aame: string;

  @IsEmail({}, { message: 'Email must be a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @IsString({ message: 'Password must be a string.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password: string;
}

