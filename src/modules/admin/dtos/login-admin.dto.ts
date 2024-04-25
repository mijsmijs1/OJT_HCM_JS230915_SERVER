import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsIn, IsNotEmpty, IsString, Length } from "class-validator";


export class LoginAdminDTO {

    @ApiProperty({
        example: '123@gmail.com',
        required: true,
    })
    @IsString({ message: 'validation.INVALID_STRING' })
    @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
    @IsEmail({}, { message: 'validation.INVALID_EMAIL' })
    email: string;

    @ApiProperty({
        example: '123456',
        required: true,
    })
    @IsString({ message: 'validation.INVALID_STRING' })
    @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
    @Length(6, 12, { message: 'validation.LENGTH' })
    password: string;

    @ApiProperty({ default: 1, example: 'isAdmin', required: true })
    isAdmin: string;
}