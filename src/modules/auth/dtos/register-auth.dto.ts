import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";


export class RegisterAuthDTO {
    @ApiProperty({
        example: 'PhuQuy',
        required: true,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    name: string;

    @ApiProperty({
        example: '123@gmail.com',
        required: true,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    @IsEmail({}, { message: 'validation.COMMON_ERROR' })
    email: string;

    @ApiProperty({
        example: '123456',
        required: true,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    @MinLength(6, { message: 'validation.COMMON_ERROR' })
    password: string;


}