import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length, MaxLength, MinLength } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";


export class RegisterAdminDTO {
    @ApiProperty({
        example: 'abc',
        required: true,
    })
    @IsString({ message: 'validation.INVALID_STRING' })
    @IsNotEmpty({ message: 'validation.NOT_EMPTY' })
    name: string;

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


}