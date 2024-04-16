import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";



export class ChangePasswordDTO {
    @ApiProperty({
        example: '123456789',
        required: true,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    @MinLength(6, { message: 'validation.COMMON_ERROR' })
    oldPassword: string;

    @ApiProperty({
        example: '123456789',
        required: true,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsNotEmpty({ message: 'validation.COMMON_ERROR' })
    @MinLength(6, { message: 'validation.COMMON_ERROR' })
    newPassword: string;

}