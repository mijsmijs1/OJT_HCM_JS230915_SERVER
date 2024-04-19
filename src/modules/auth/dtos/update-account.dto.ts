import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsIn, IsOptional, IsString } from "class-validator";

export class UpdateCandidateDTO {
    @ApiProperty({
        example: 'PhuQuy',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    name?: string;

    @ApiProperty({
        example: 'MALE',
        required: false,
    })
    @IsOptional()
    @IsIn(['MALE', 'FEMALE'], { message: 'validation.COMMON_ERROR' })
    gender?: string;

    @ApiProperty({
        example: '123 Street, City',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    address?: string;

    @ApiProperty({
        example: '0123456789',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    phone?: string;

    @ApiProperty({
        example: 'https://www.facebook.com/yourprofile',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    link_fb?: string;

    @ApiProperty({
        example: 'https://www.linkedin.com/in/yourprofile',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    link_linkedin?: string;

    @ApiProperty({
        example: 'https://github.com/yourprofile',
        required: false,
    })
    @IsString({ message: 'validation.COMMON_ERROR' })
    @IsOptional()
    link_git?: string;

    @ApiProperty({
        example: '1990-01-01',
        required: false,
    })
    @Type(() => Date)
    @IsOptional()
    dob?: Date;
}
