import { IsNotEmpty, IsEmail } from 'class-validator'

export class UpdateUserDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    firstName: string;
    lastName: string;

}