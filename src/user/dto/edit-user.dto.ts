import { IsOptional, IsEmail, IsString } from "class-validator";


export class EditUserDto {

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsString()
    firstname?: string;

    @IsOptional()
    @IsString()
    lastname?: string;
    
}