import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";



export class RegisterCompanyDTO {
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

    @ApiProperty({
        example: 'Cong Ty FPT',
        required: true,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    name: string;

    @ApiProperty({
        example: '46/1C, to 18, ap xtd2, Hoc mon, Ho Chi Minh',
        required: true,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    address: string;

    @ApiProperty({
        example: '123@gmail.com',
        required: true,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    @IsEmail({}, { message: 'validation.COMMON_ERROR' })
    companyEmail: string;

    @ApiProperty({
        example: '0936549821',
        required: true,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    phone: string;
}