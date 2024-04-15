import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsIn, IsNotEmpty, IsString } from "class-validator";
import { Role } from "src/constant/enum";

export class LoginAuthDTO {

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
    password: string;

    @ApiProperty({ default: 1, example: 'candidate|company', required: true })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    @IsIn(['company', 'candidate'], { message: 'validation.COMMON_ERROR' })
    role: string;
}